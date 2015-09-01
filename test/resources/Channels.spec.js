'use strict';

var baabedo = require('../testUtils').getSpyableBaabedo();
var expect = require('chai').expect;
var Promise = require('bluebird');

var TEST_AUTH_KEY = 'aGN0bIwXnHdw5645VABjPdSn8nWY7G11';

describe('Customers Resource', function() {

  describe('retrieve', function() {

    it('Sends the correct request', function() {

      baabedo.channels.retrieve('cus_2dkAb792h1mfa4');
      expect(baabedo.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: '/beta/channels/cus_2dkAb792h1mfa4',
        headers: {},
        data: {}
      });

    });

    it('Sends the correct request [with specified auth]', function() {

      baabedo.channels.retrieve('cus_2dkAb792h1mfa4', TEST_AUTH_KEY);
      expect(baabedo.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: '/beta/channels/cus_2dkAb792h1mfa4',
        headers: {},
        data: {},
        auth: TEST_AUTH_KEY
      });

    });

  });

  describe('create', function() {

    it('Sends the correct request', function() {

      baabedo.channels.create({ description: 'Some customer' });
      expect(baabedo.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: '/beta/channels',
        headers: {},
        data: { description: 'Some customer' }
      });

    });

    it('Sends the correct request [with specified auth]', function() {

      baabedo.channels.create({ description: 'Some customer' }, TEST_AUTH_KEY);
      expect(baabedo.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: '/beta/channels',
        headers: {},
        data: { description: 'Some customer' },
        auth: TEST_AUTH_KEY
      });

    });

    it('Sends the correct request [with specified auth and no body]', function() {

      baabedo.channels.create(TEST_AUTH_KEY);
      expect(baabedo.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: '/beta/channels',
        headers: {},
        data: {},
        auth: TEST_AUTH_KEY
      });

    });

    it('Sends the correct request [with specified idempotency_key in options]', function() {

      baabedo.channels.create({ description: 'Some customer' }, { idempotency_key: 'foo' });
      expect(baabedo.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: '/beta/channels',
        headers: {'Idempotency-Key': 'foo'},
        data: { description: 'Some customer' },
      });

    });

    it('Sends the correct request [with specified auth in options]', function() {

      baabedo.channels.create({ description: 'Some customer' }, { api_key: TEST_AUTH_KEY });
      expect(baabedo.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: '/beta/channels',
        headers: {},
        data: { description: 'Some customer' },
        auth: TEST_AUTH_KEY
      });

    });

    it('Sends the correct request [with specified auth and idempotent key in options]', function() {

      baabedo.channels.create({ description: 'Some customer' }, { api_key: TEST_AUTH_KEY, idempotency_key: 'foo'});
      expect(baabedo.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: '/beta/channels',
        headers: {'Idempotency-Key': 'foo'},
        data: { description: 'Some customer' },
        auth: TEST_AUTH_KEY
      });

    });


    it('Sends the correct request [with specified auth in options and no body]', function() {

      baabedo.channels.create({ api_key: TEST_AUTH_KEY });
      expect(baabedo.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: '/beta/channels',
        headers: {},
        data: {},
        auth: TEST_AUTH_KEY
      });

    });


  });

  describe('del', function() {

    it('Sends the correct request', function() {

      baabedo.channels.del('cus_2dkAb792h1mfa4');
      expect(baabedo.LAST_REQUEST).to.deep.equal({
        method: 'DELETE',
        url: '/beta/channels/cus_2dkAb792h1mfa4',
        headers: {},
        data: {}
      });

    });

  });

  describe('list', function() {

    it('Sends the correct request', function() {

      baabedo.channels.list();
      expect(baabedo.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: '/beta/channels',
        headers: {},
        data: {}
      });

    });

    it('Sends the correct request [with specified auth]', function() {

      baabedo.channels.list(TEST_AUTH_KEY);
      expect(baabedo.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: '/beta/channels',
        headers: {},
        data: {},
        auth: TEST_AUTH_KEY
      });

    });

  });

  describe('Search methods', function() {

    describe('searchProducts', function() {

      it('Sends the correct request', function() {

        baabedo.channels.searchProducts('channelIdFoo321');
        expect(baabedo.LAST_REQUEST).to.deep.equal({
          method: 'GET',
          url: '/beta/channels/channelIdFoo321/search/products',
          headers: {},
          data: {}
        });

      });

    });

  });

  describe('ProductOrders methods', function() {

    describe('createProductOrders', function() {

      it('Sends the correct request', function() {
        var payload = {
          product_orders: [
            { id: 1, name: 'gold' },
            { id: 2, name: 'silber' }
          ]
        };

        baabedo.channels.createProductOrders('channelIdFoo321', payload);
        expect(baabedo.LAST_REQUEST).to.deep.equal({
          method: 'PUT',
          url: '/beta/channels/channelIdFoo321/product_orders',
          headers: {},
          data: payload
        });

      });

      it('Sends the correct request [with specified auth]', function() {
        var payload = {
          product_orders: [
            { id: 1, name: 'gold' },
            { id: 2, name: 'silber' }
          ]
        };

        baabedo.channels.createProductOrders('channelIdFoo321', payload, TEST_AUTH_KEY);
        expect(baabedo.LAST_REQUEST).to.deep.equal({
          method: 'PUT',
          url: '/beta/channels/channelIdFoo321/product_orders',
          headers: {},
          data: payload,
          auth: TEST_AUTH_KEY
        });

      });

    });

    describe('updateProductOrders', function() {

      it('Sends the correct request', function() {
        var payload = {
          product_orders: [
            { id: 1, name: 'gold' },
            { id: 2, name: 'silber' }
          ]
        };

        baabedo.channels.updateProductOrders('channelIdFoo321', payload);
        expect(baabedo.LAST_REQUEST).to.deep.equal({
          method: 'PUT',
          url: '/beta/channels/channelIdFoo321/product_orders',
          headers: {},
          data: payload
        });

      });

      it('Sends the correct request [with specified auth]', function() {
        var payload = {
          product_orders: [
            { id: 1, name: 'gold' },
            { id: 2, name: 'silber' }
          ]
        };

        baabedo.channels.updateProductOrders('channelIdFoo321', payload, TEST_AUTH_KEY);
        expect(baabedo.LAST_REQUEST).to.deep.equal({
          method: 'PUT',
          url: '/beta/channels/channelIdFoo321/product_orders',
          headers: {},
          data: payload,
          auth: TEST_AUTH_KEY
        });

      });

    });

    describe('listProductOrders', function() {

      it('Sends the correct request', function() {

        baabedo.channels.listProductOrders('channelIdFoo321');
        expect(baabedo.LAST_REQUEST).to.deep.equal({
          method: 'GET',
          url: '/beta/channels/channelIdFoo321/product_orders',
          headers: {},
          data: {}
        });

      });

      it('Sends the correct request [with specified auth]', function() {

        baabedo.channels.listProductOrders('channelIdFoo321', TEST_AUTH_KEY);
        expect(baabedo.LAST_REQUEST).to.deep.equal({
          method: 'GET',
          url: '/beta/channels/channelIdFoo321/product_orders',
          headers: {},
          data: {},
          auth: TEST_AUTH_KEY
        });

      });

    });

    describe('updateProductOrder', function() {

      it('Sends the correct request', function() {
        var payload = { name: "gold" };

        baabedo.channels.updateProductOrder('channelIdFoo321', 'orderItemIdFoo456', payload);
        expect(baabedo.LAST_REQUEST).to.deep.equal({
          method: 'PUT',
          url: '/beta/channels/channelIdFoo321/product_orders/orderItemIdFoo456',
          headers: {},
          data: payload
        });

      });

      it('Sends the correct request [with specified auth]', function() {
        var payload = { name: "gold" };

        baabedo.channels.updateProductOrder('channelIdFoo321', 'orderItemIdFoo456', payload, TEST_AUTH_KEY);
        expect(baabedo.LAST_REQUEST).to.deep.equal({
          method: 'PUT',
          url: '/beta/channels/channelIdFoo321/product_orders/orderItemIdFoo456',
          headers: {},
          data: payload,
          auth: TEST_AUTH_KEY
        });

      });

    });



  });

  describe('Statistics methods', function() {

    describe('retrieveStatisticsProfit', function() {

      it('Sends the correct request', function() {

        baabedo.channels.retrieveStatisticsProfit('channelIdFoo321');
        expect(baabedo.LAST_REQUEST).to.deep.equal({
          method: 'GET',
          url: '/beta/channels/channelIdFoo321/statistics/profit',
          headers: {},
          data: {}
        });

      });

      it('Sends the correct request [with specified auth]', function() {

        baabedo.channels.retrieveStatisticsProfit('channelIdFoo321', TEST_AUTH_KEY);
        expect(baabedo.LAST_REQUEST).to.deep.equal({
          method: 'GET',
          url: '/beta/channels/channelIdFoo321/statistics/profit',
          headers: {},
          data: {},
          auth: TEST_AUTH_KEY
        });

      });

    });

    describe('retrieveStatisticsRevenue', function() {

      it('Sends the correct request', function() {

        baabedo.channels.retrieveStatisticsRevenue('channelIdFoo321');
        expect(baabedo.LAST_REQUEST).to.deep.equal({
          method: 'GET',
          url: '/beta/channels/channelIdFoo321/statistics/revenue',
          headers: {},
          data: {}
        });

      });

      it('Sends the correct request [with specified auth]', function() {

        baabedo.channels.retrieveStatisticsRevenue('channelIdFoo321', TEST_AUTH_KEY);
        expect(baabedo.LAST_REQUEST).to.deep.equal({
          method: 'GET',
          url: '/beta/channels/channelIdFoo321/statistics/revenue',
          headers: {},
          data: {},
          auth: TEST_AUTH_KEY
        });

      });

    });

  });

  describe('Product methods', function() {

    describe('createProduct', function() {

      it('Sends the correct request', function() {

        baabedo.channels.createProduct('channelIdFoo321', {
          plan: 'gold', quantity: '12'
        });
        expect(baabedo.LAST_REQUEST).to.deep.equal({
          method: 'POST',
          url: '/beta/channels/channelIdFoo321/products',
          headers: {},
          data: { plan: 'gold', quantity: '12' }
        });

      });

      it('Sends the correct request [with specified auth]', function() {

        baabedo.channels.createProduct('channelIdFoo321', {
          plan: 'gold', quantity: '12'
        }, TEST_AUTH_KEY);
        expect(baabedo.LAST_REQUEST).to.deep.equal({
          method: 'POST',
          url: '/beta/channels/channelIdFoo321/products',
          headers: {},
          data: { plan: 'gold', quantity: '12' },
          auth: TEST_AUTH_KEY
        });

      });

    });

    describe('createProducts', function() {

      it('Sends the correct request', function() {
        var payload = { products:
          [ { id: 1, name: 'gold' },
            { id: 2, name: 'silber' } ]
        };

        baabedo.channels.createProducts('channelIdFoo321', payload);
        expect(baabedo.LAST_REQUEST).to.deep.equal({
          method: 'PUT',
          url: '/beta/channels/channelIdFoo321/products',
          headers: {},
          data: payload
        });

      });

      it('Sends the correct request [with specified auth]', function() {
        var payload = { products:
          [ { id: 1, name: 'gold' },
            { id: 2, name: 'silber' } ]
        };

        baabedo.channels.createProducts('channelIdFoo321', payload, TEST_AUTH_KEY);
        expect(baabedo.LAST_REQUEST).to.deep.equal({
          method: 'PUT',
          url: '/beta/channels/channelIdFoo321/products',
          headers: {},
          data: payload,
          auth: TEST_AUTH_KEY
        });

      });

    });

    describe('updateProducts', function() {

      it('Sends the correct request', function() {
        var payload = { products:
          [ { id: 1, name: 'gold' },
            { id: 2, name: 'silber' } ]
        };

        baabedo.channels.updateProducts('channelIdFoo321', payload);
        expect(baabedo.LAST_REQUEST).to.deep.equal({
          method: 'PUT',
          url: '/beta/channels/channelIdFoo321/products',
          headers: {},
          data: payload
        });

      });

      it('Sends the correct request [with specified auth]', function() {
        var payload = { products:
          [ { id: 1, name: 'gold' },
            { id: 2, name: 'silber' } ]
        };

        baabedo.channels.updateProducts('channelIdFoo321', payload, TEST_AUTH_KEY);
        expect(baabedo.LAST_REQUEST).to.deep.equal({
          method: 'PUT',
          url: '/beta/channels/channelIdFoo321/products',
          headers: {},
          data: payload,
          auth: TEST_AUTH_KEY
        });

      });

    });

    describe('listProducts', function() {

      it('Sends the correct request', function() {

        baabedo.channels.listProducts('channelIdFoo321');
        expect(baabedo.LAST_REQUEST).to.deep.equal({
          method: 'GET',
          url: '/beta/channels/channelIdFoo321/products',
          headers: {},
          data: {}
        });

      });

      it('Sends the correct request [with specified auth]', function() {

        baabedo.channels.listProducts('channelIdFoo321', TEST_AUTH_KEY);
        expect(baabedo.LAST_REQUEST).to.deep.equal({
          method: 'GET',
          url: '/beta/channels/channelIdFoo321/products',
          headers: {},
          data: {},
          auth: TEST_AUTH_KEY
        });

      });

    });

    describe('retrieveProduct', function() {

      it('Sends the correct request', function() {

        baabedo.channels.retrieveProduct('channelIdFoo321', 'productIdFoo456');
        expect(baabedo.LAST_REQUEST).to.deep.equal({
          method: 'GET',
          url: '/beta/channels/channelIdFoo321/products/productIdFoo456',
          headers: {},
          data: {}
        });

      });

      it('Sends the correct request [with specified auth]', function() {

        baabedo.channels.retrieveProduct('channelIdFoo321', 'productIdFoo456', TEST_AUTH_KEY);
        expect(baabedo.LAST_REQUEST).to.deep.equal({
          method: 'GET',
          url: '/beta/channels/channelIdFoo321/products/productIdFoo456',
          headers: {},
          data: {},
          auth: TEST_AUTH_KEY
        });

      });

    });

    describe('updateProduct', function() {

      it('Sends the correct request', function() {
        var payload = { id: 1, name: 'gold' };

        baabedo.channels.updateProduct('channelIdFoo321', 'productIdFoo456', payload);
        expect(baabedo.LAST_REQUEST).to.deep.equal({
          method: 'PUT',
          url: '/beta/channels/channelIdFoo321/products/productIdFoo456',
          headers: {},
          data: payload
        });

      });

      it('Sends the correct request [with specified auth]', function() {
        var payload = { id: 1, name: 'gold' };

        baabedo.channels.updateProduct('channelIdFoo321', 'productIdFoo456', payload, TEST_AUTH_KEY);
        expect(baabedo.LAST_REQUEST).to.deep.equal({
          method: 'PUT',
          url: '/beta/channels/channelIdFoo321/products/productIdFoo456',
          headers: {},
          data: payload,
          auth: TEST_AUTH_KEY
        });

      });

    });

  });

});
