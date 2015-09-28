'use strict';

var BaabedoResource = require('../BaabedoResource');
var utils = require('../utils');
var baabedoMethod = BaabedoResource.method;

module.exports = BaabedoResource.extend({

  path: 'channels',
  includeBasic: [
    'create', 'list', 'retrieve', 'del'
  ],

  /**
   * Channels: Product methods
   */

  createProduct: baabedoMethod({
    method: 'POST',
    path: '/{channelId}/products',
    urlParams: ['channelId']
  }),

  createProducts: baabedoMethod({
    method: 'PUT',
    path: '/{channelId}/products',
    urlParams: ['channelId']
  }),

  updateProducts: baabedoMethod({
    method: 'PUT',
    path: '/{channelId}/products',
    urlParams: ['channelId']
  }),

  listProducts: baabedoMethod({
    method: 'GET',
    path: '/{channelId}/products',
    urlParams: ['channelId']
  }),

  retrieveProduct: baabedoMethod({
    method: 'GET',
    path: '/{channelId}/products/{productId}',
    urlParams: ['channelId', 'productId']
  }),

  updateProduct: baabedoMethod({
    method: 'PUT',
    path: '/{channelId}/products/{productId}',
    urlParams: ['channelId', 'productId']
  }),

  /**
   * Channels: ProductOrders methods
   */

  createProductOrders: baabedoMethod({
    method: 'PUT',
    path: '/{channelId}/product_orders',
    urlParams: ['channelId']
  }),

  updateProductOrders: baabedoMethod({
    method: 'PUT',
    path: '/{channelId}/product_orders',
    urlParams: ['channelId']
  }),

  listProductOrders: baabedoMethod({
    method: 'GET',
    path: '/{channelId}/product_orders',
    urlParams: ['channelId']
  }),

  updateProductOrder: baabedoMethod({
    method: 'PUT',
    path: '/{channelId}/product_orders/{order_item_id}',
    urlParams: ['channelId', 'order_item_id']
  }),

  /**
   * Channels: Statistics methods
   */

  retrieveStatisticsProfit: baabedoMethod({
    method: 'GET',
    path: '/{channelId}/statistics/profit',
    urlParams: ['channelId']
  }),

  retrieveStatisticsRevenue: baabedoMethod({
    method: 'GET',
    path: '/{channelId}/statistics/revenue',
    urlParams: ['channelId']
  }),

  /**
   * Channels: Search methods
   */

  searchProducts: baabedoMethod({
    method: 'GET',
    path: '/{channelId}/search/products',
    urlParams: ['channelId', 'query', 'per_page', 'page']
  })

});
