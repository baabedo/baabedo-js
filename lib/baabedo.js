'use strict';

Baabedo.DEFAULT_HOST = 'api.baabedo.com';
Baabedo.DEFAULT_PORT = '443';
Baabedo.DEFAULT_BASE_PATH = '/v1/';
Baabedo.DEFAULT_API_VERSION = null;

// Use node's default timeout:
Baabedo.DEFAULT_TIMEOUT = require('http').createServer().timeout;

Baabedo.PACKAGE_VERSION = require('../package.json').version;

Baabedo.USER_AGENT = {
  bindings_version: Baabedo.PACKAGE_VERSION,
  lang: 'node',
  lang_version: process.version,
  platform: process.platform,
  publisher: 'baabedo',
  uname: null
};

Baabedo.USER_AGENT_SERIALIZED = null;

var exec = require('child_process').exec;

var resources = {
  Channels: require('./resources/Channels'),
};

Baabedo.BaabedoResource = require('./BaabedoResource');
Baabedo.resources = resources;

function Baabedo(key, version) {

  if (!(this instanceof Baabedo)) {
    return new Baabedo(key, version);
  }

  this._api = {
    auth: null,
    host: Baabedo.DEFAULT_HOST,
    port: Baabedo.DEFAULT_PORT,
    basePath: Baabedo.DEFAULT_BASE_PATH,
    version: Baabedo.DEFAULT_API_VERSION,
    timeout: Baabedo.DEFAULT_TIMEOUT,
    agent: null,
    dev: false
  };

  this._prepResources();
  this.setApiKey(key);
  this.setApiVersion(version);
}

Baabedo.prototype = {

  setHost: function(host, port, protocol) {
    this._setApiField('host', host);
    if (port) this.setPort(port);
    if (protocol) this.setProtocol(protocol);
  },

  setProtocol: function(protocol) {
    this._setApiField('protocol', protocol.toLowerCase());
  },

  setPort: function(port) {
    this._setApiField('port', port);
  },

  setApiVersion: function(version) {
    if (version) {
      this._setApiField('version', version);
    }
  },

  setApiKey: function(key) {
    if (key) {
      this._setApiField(
        'auth',
        'Basic ' + new Buffer(key + ':').toString('base64')
      );
    }
  },

  setTimeout: function(timeout) {
    this._setApiField(
      'timeout',
      timeout == null ? Baabedo.DEFAULT_TIMEOUT : timeout
    );
  },

  setHttpAgent: function(agent) {
    this._setApiField('agent', agent);
  },

  _setApiField: function(key, value) {
    this._api[key] = value;
  },

  getApiField: function(key) {
    return this._api[key];
  },

  getConstant: function(c) {
    return Baabedo[c];
  },

  getClientUserAgent: function(cb) {
    if (Baabedo.USER_AGENT_SERIALIZED) {
      return cb(Baabedo.USER_AGENT_SERIALIZED);
    }
    exec('uname -a', function(err, uname) {
      Baabedo.USER_AGENT.uname = uname || 'UNKNOWN';
      Baabedo.USER_AGENT_SERIALIZED = JSON.stringify(Baabedo.USER_AGENT);
      cb(Baabedo.USER_AGENT_SERIALIZED);
    });
  },

  _prepResources: function() {

    for (var name in resources) {
      this[
        name[0].toLowerCase() + name.substring(1)
      ] = new resources[name](this);
    }

  }

};

module.exports = Baabedo;
