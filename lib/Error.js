'use strict';

var utils = require('./utils');

module.exports = _Error;

/**
 * Generic Error klass to wrap any errors returned by baabedo-js
 */
function _Error(raw) {
  this.populate.apply(this, arguments);
  this.stack = (new Error(this.message)).stack;
}

// Extend Native Error
_Error.prototype = Object.create(Error.prototype);

_Error.prototype.type = 'GenericError';
_Error.prototype.populate = function(type, message) {
  this.type = type;
  this.message = message;
};

_Error.extend = utils.protoExtend;

/**
 * Create subclass of internal Error klass
 * (Specifically for errors returned from Baabedo's REST API)
 */
var BaabedoError = _Error.BaabedoError = _Error.extend({
  type: 'BaabedoError',
  populate: function(raw) {
    // Move from prototype def (so it appears in stringified obj)
    this.type = this.type;

    this.stack = (new Error(raw.message)).stack;
    this.rawType = raw.type;
    this.code = raw.code;
    this.param = raw.param;
    this.message = raw.message;
    this.detail = raw.detail;
    this.raw = raw;
    this.requestId = raw.requestId;
  }
});

/**
 * Helper factory which takes raw baabedo errors and outputs wrapping instances
 */
BaabedoError.generate = function(rawBaabedoError) {
  switch (rawBaabedoError.type) {
    case 'invalid_request_error':
      return new _Error.BaabedoInvalidRequestError(rawBaabedoError);
    case 'api_error':
      return new _Error.BaabedoAPIError(rawBaabedoError);
  }
  return new _Error('Generic', 'Unknown Error');
};

// Specific Baabedo Error types:
_Error.BaabedoInvalidRequestError = BaabedoError.extend({ type: 'BaabedoInvalidRequest' });
_Error.BaabedoAPIError = BaabedoError.extend({ type: 'BaabedoAPIError' });
_Error.BaabedoAuthenticationError = BaabedoError.extend({ type: 'BaabedoAuthenticationError' });
_Error.BaabedoConnectionError = BaabedoError.extend({ type: 'BaabedoConnectionError' });
