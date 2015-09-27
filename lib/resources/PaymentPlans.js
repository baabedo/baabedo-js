'use strict';

var BaabedoResource = require('../BaabedoResource');
var utils = require('../utils');
var baabedoMethod = BaabedoResource.method;

module.exports = BaabedoResource.extend({

  path: 'payment/plans',
  includeBasic: [
    'list'
  ]

});
