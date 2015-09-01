'use strict';

var http = require('http');
var https = require('https');
var path = require('path');
var Promise = require('bluebird');
var _ = require('lodash');

var utils = require('./utils');
var Error = require('./Error');

var hasOwn = {}.hasOwnProperty;


// Provide extension mechanism for Baabedo Resource Sub-Classes
BaabedoResource.extend = utils.protoExtend;

// Expose method-creator & prepared (basic) methods
BaabedoResource.method = require('./BaabedoMethod');
BaabedoResource.BASIC_METHODS = require('./BaabedoMethod.basic');

/**
 * Encapsulates request logic for a Baabedo Resource
 */
function BaabedoResource(baabedo, urlData) {

  this._baabedo = baabedo;
  this._urlData = urlData || {};

  this.basePath = utils.makeURLInterpolator(baabedo.getApiField('basePath'));
  this.path = utils.makeURLInterpolator(this.path);

  if (this.includeBasic) {
    this.includeBasic.forEach(function(methodName) {
      this[methodName] = BaabedoResource.BASIC_METHODS[methodName];
    }, this);
  }

  this.initialize.apply(this, arguments);

}

BaabedoResource.prototype = {

  path: '',

  initialize: function() {},

  // Function to override the default data processor. This allows full control
  // over how a BaabedoResource's request data will get converted into an HTTP
  // body. This is useful for non-standard HTTP requests. The function should
  // take method name, data, and headers as arguments.
  requestDataProcessor: null,

  // String that overrides the base API endpoint. If `overrideHost` is not null
  // then all requests for a particular resource will be sent to a base API
  // endpoint as defined by `overrideHost`.
  overrideHost: null,

  createFullPath: function(commandPath, urlData) {
    return path.join(
      this.basePath(urlData),
      this.path(urlData),
      typeof commandPath == 'function' ?
        commandPath(urlData) : commandPath
    ).replace(/\\/g, '/'); // ugly workaround for Windows
  },

  createUrlData: function() {
    var urlData = {};
    // Merge in baseData
    for (var i in this._urlData) {
      if (hasOwn.call(this._urlData, i)) {
        urlData[i] = this._urlData[i];
      }
    }
    return urlData;
  },

  createDeferred: function(callback) {
      var deferred = Promise.defer();

      if (callback) {
        // Callback, if provided, is a simply translated to Promise'esque:
        // (Ensure callback is called outside of promise stack)
        deferred.promise.then(function(res) {
          setTimeout(function(){ callback(null, res) }, 0);
        }, function(err) {
          setTimeout(function(){ callback(err, null); }, 0);
        });
      }

      return deferred;
  },

  _timeoutHandler: function(timeout, req, callback) {
    var self = this;
    return function() {
      var timeoutErr = new Error('ETIMEDOUT');
      timeoutErr.code = 'ETIMEDOUT';

      req._isAborted = true;
      req.abort();

      callback.call(
        self,
        new Error.BaabedoConnectionError({
          message: 'Request aborted due to timeout being reached (' + timeout + 'ms)',
          detail: timeoutErr
        }),
        null
      );
    }
  },

  _responseHandler: function(req, callback) {
    var self = this;

    return function(res) {
      var response = '';

      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        response += chunk;
      });
      res.on('end', function() {
        var headers = res.headers || {};

        try {
          response = JSON.parse(response);
          if (response.errors) {
            var err;

            response.errors.requestId = headers['request-id'];

            if (res.statusCode === 401) {
              err = new Error.BaabedoAuthenticationError(response.errors[0]);
            } else {
              err = Error.BaabedoError.generate(response.errors[0]);
            }
            return callback.call(self, err, null);
          }
        } catch (e) {
          return callback.call(
            self,
            new Error.BaabedoAPIError({
              message: 'Invalid JSON received from the Baabedo API',
              response: response,
              exception: e,
              requestId: headers['request-id']
            }),
            null
          );
        }
        callback.call(self, null, response);
      });
    };
  },

  _errorHandler: function(req, callback) {
    var self = this;
    return function(error) {
      if (req._isAborted) return; // already handled
      callback.call(
        self,
        new Error.BaabedoConnectionError({
          message: 'An error occurred with our connection to Baabedo',
          detail: error
        }),
        null
      );
    }
  },

  _request: function(method, path, data, auth, options, callback) {
    var self = this;
    var requestData;

    if (self.requestDataProcessor) {
      requestData = self.requestDataProcessor(method, data, options.headers);
    } else {
      requestData = utils.stringifyRequestData(data || {});
    }

    var apiVersion = this._baabedo.getApiField('version');

    var headers = {
      // Use specified auth token or use default from this baabedo instance:
      'Authorization': auth ?
        'Basic ' + new Buffer(auth + ':').toString('base64') :
        this._baabedo.getApiField('auth'),
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': requestData.length,
      'User-Agent': 'Baabedo/v1 NodeBindings/' + this._baabedo.getConstant('PACKAGE_VERSION')
    };

    if (apiVersion) {
      headers['Baabedo-Version'] = apiVersion;
    }

    // Grab client-user-agent before making the request:
    this._baabedo.getClientUserAgent(function(cua) {
      headers['X-Baabedo-Client-User-Agent'] = cua;

      if (options.headers) {
        headers = _.extend(headers, options.headers);
      }

      makeRequest();
    });


    function makeRequest() {

      var timeout = self._baabedo.getApiField('timeout');
      var isInsecureConnection = self._baabedo.getApiField('protocol') == 'http:';

      var host = self.overrideHost || self._baabedo.getApiField('host');

      var req = (
        isInsecureConnection ? http : https
      ).request({
        host: host,
        port: self._baabedo.getApiField('port'),
        path: path,
        method: method,
        agent: self._baabedo.getApiField('agent'),
        protocol: self._baabedo.getApiField('protocol'),
        headers: headers,
        ciphers: "DEFAULT:!aNULL:!eNULL:!LOW:!EXPORT:!SSLv2:!MD5"
      });

      req.setTimeout(timeout, self._timeoutHandler(timeout, req, callback));
      req.on('response', self._responseHandler(req, callback));
      req.on('error', self._errorHandler(req, callback));

      req.on('socket', function(socket) {
        socket.on((isInsecureConnection ? 'connect' : 'secureConnect'), function() {
          // Send payload; we're safe:
          req.write(requestData);
          req.end();
        });
      });

      req.end();
    }

  }

};

module.exports = BaabedoResource;
