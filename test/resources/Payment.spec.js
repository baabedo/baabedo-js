'use strict';

var baabedo = require('../testUtils').getSpyableBaabedo();
var expect = require('chai').expect;
var Promise = require('bluebird');

var TEST_AUTH_KEY = 'aGN0bIwXnHdw5645VABjPdSn8nWY7G11';

describe('Payment Resource', function() {

  describe('list', function() {

    it('Sends the correct request', function() {

      baabedo.payment.list();
      expect(baabedo.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: '/beta/payment',
        headers: {},
        data: {}
      });

    });

    it('Sends the correct request [with specified auth]', function() {

      baabedo.payment.list(TEST_AUTH_KEY);
      expect(baabedo.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: '/beta/payment?access_token=' + TEST_AUTH_KEY,
        headers: {},
        data: {},
        auth: TEST_AUTH_KEY
      });

    });

  });

});
