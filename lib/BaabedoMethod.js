'use strict';

var _ = require('lodash');
var path = require('path');
var utils = require('./utils');
var OPTIONAL_REGEX = /^optional!/;

/**
 * Create an API method from the declared spec.
 *
 * @param [spec.method='GET'] Request Method (POST, GET, DELETE, PUT)
 * @param [spec.path=''] Path to be appended to the API BASE_PATH, joined with 
 *  the instance's path (e.g. "charges" or "customers")
 * @param [spec.required=[]] Array of required arguments in the order that they
 *  must be passed by the consumer of the API. Subsequent optional arguments are
 *  optionally passed through a hash (Object) as the penultimate argument
 *  (preceeding the also-optional callback argument
 */
module.exports = function baabedoMethod(spec) {

  var commandPath = typeof spec.path == 'function' ? spec.path
                  : utils.makeURLInterpolator( spec.path || '' );
  var requestMethod = (spec.method || 'GET').toUpperCase();
  var urlParams = spec.urlParams || [];

  return function() {
    var self = this;
    var args = [].slice.call(arguments);

    var callback = typeof args[args.length - 1] == 'function' && args.pop();
    var deferred = this.createDeferred(callback);
    var urlData = this.createUrlData();

    for (var i = 0, l = urlParams.length; i < l; ++i) {

      var arg = args[0];
      var param = urlParams[i];

      var isOptional = OPTIONAL_REGEX.test(param);
      param = param.replace(OPTIONAL_REGEX, '');

      if (!arg) {
        if (isOptional) {
          urlData[param] = '';
          continue;
        }
        throw new Error('Baabedo: I require argument "' + urlParams[i] + '", but I got: ' + arg);
      }

      urlData[param] = args.shift();
    }

    var data = utils.getDataFromArgs(args);
    var opts = utils.getOptionsFromArgs(args);

    if (args.length) {
      throw new Error(
        'Baabedo: Unknown arguments (' + args + '). Did you mean to pass an options object?'
      );
    }

    var requestPath = this.createFullPath(commandPath, urlData);

    // HACK FOR OLD CORE API
    var serialize = function(obj) {
      var str = [];
      for(var p in obj)
        if (obj.hasOwnProperty(p)) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
      return str.join("&");
    }

    if (opts.query && !_.isEmpty(opts.query)) {
      requestPath = requestPath + '?' + serialize(opts.query);
    }

    var requestCallback = function(err, response) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(
          spec.transformResponseData ?
            spec.transformResponseData(response) :
            response
        );
      }
    };

    var options = { headers: _.extend(opts.headers, spec.headers) };
    var request = self._request(requestMethod, requestPath, data, opts.auth, options, requestCallback);

    return deferred.promise;

  };
};
