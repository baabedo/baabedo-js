'use strict';

var testUtils = require('./testUtils');
var Promise = require('bluebird');
var baabedo = require('../lib/baabedo')(
  testUtils.getUserBaabedoKey(),
  'latest'
);

var expect = require('chai').expect;

var CUSTOMER_DETAILS = {
  description: 'Some channel',
  card: {
    number: '4242424242424242',
    exp_month: 12,
    exp_year: 2015
  }
};

describe('Baabedo Module', function() {

  var cleanup = new testUtils.CleanupUtility();
  this.timeout(20000);

  describe('ClientUserAgent', function() {
    it('Should return a user-agent serialized JSON object', function() {
      var d = Promise.defer();
      baabedo.getClientUserAgent(function(c) {
        d.resolve(JSON.parse(c));
      });
      return expect(d.promise).to.eventually.have.property('lang', 'node');
    });
  });

  describe('setTimeout', function() {
    it('Should define a default equal to the node default', function() {
      expect(baabedo.getApiField('timeout')).to.equal(require('http').createServer().timeout);
    });
    it('Should allow me to set a custom timeout', function() {
      baabedo.setTimeout(900);
      expect(baabedo.getApiField('timeout')).to.equal(900);
    });
    it('Should allow me to set null, to reset to the default', function() {
      baabedo.setTimeout(null);
      expect(baabedo.getApiField('timeout')).to.equal(require('http').createServer().timeout);
    });
  });

  describe('Callback support', function() {

    describe('Any given endpoint', function() {

      it('Will call a callback if successful', function() {

        var defer = Promise.defer();
        baabedo.channels.create({
          marketplace_type: 'generic',
          mws_auth_token: 'abc',
          access_token: 'generic',
        }, function(err, channel) {
          defer.resolve('Called!');
        });

        return expect(defer.promise).to.eventually.equal('Called!');
      });

      it('Given an error the callback will receive it', function() {

        var defer = Promise.defer();

        baabedo.channels.createProduct('nonExistentCustId', { card: {} }, function(err, channel) {
          if (err) {
            defer.resolve('ErrorWasPassed');
          } else {
            defer.reject('NoErrorPassed');
          }
        });

        return expect(defer.promise).to.eventually.become('ErrorWasPassed')
      });

    });
  });

});
