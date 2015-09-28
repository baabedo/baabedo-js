'use strict';

var BaabedoResource = require('../BaabedoResource');
var utils = require('../utils');
var baabedoMethod = BaabedoResource.method;

module.exports = BaabedoResource.extend({

  path: 'payment_plans',
  includeBasic: [
    'list'
  ]

});
