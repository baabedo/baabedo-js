# Baabedo API JS-Client for Node and Browser

The package can be used in node.js and browser environments. Just
`require('baabedo')`. If you want to use it in your client/browser app, just
`browserify` your app, which requires `baabedo`.

## Installation

`npm install baabedo`

To get a js file you can use in the frontend run  
```bash
$ npm install -g browserify
$ browserify lib/baabedo.js -o bundle.js -s Baabedo
```

## API Overview

Every resource is accessed via your `baabedo` instance:

```js
var baabedo = require('baabedo')(' your baabedo access_token ');
// baabedo.{ RESOURCE_NAME }.{ METHOD_NAME }
```

Every resource method accepts an optional callback as the last argument:

```js
baabedo.channels.create(
  { marketplace_type: 'Amazon' },
  function(err, channel) {
    err; // null if no error occurred
    channel; // the created channel object
  }
);
```

Additionally, every resource method returns a promise, so you don't have to use the regular callback. E.g.

```js
// Create a new customer and then a new charge for that customer:
baabedo.channels.create({
  marketplace_type: 'Amazon'
}).then(function(channel) {
  return baabedo.channel.createProduct(channel.id, {
    name: 'Blue Socks',
    min_price: 1600,
    currency: 'usd',
  });
}).then(function(charge) {
  // New charge created on a new customer
}, function(err) {
  // Deal with an error
});
```

### Available resources & methods

*Where you see `params` it is a plain JavaScript object, e.g. `{ email: 'foo@example.com' }`*

 * __Channels__
  * `create(params)`
  * `list([params])`
  * `retrieve(channelId)`
  * `del(channelId)`
  * _Products_
  * `createProduct(channelId)`
  * `createProducts(channelId)`
  * `updateProducts(channelId)`
  * `listProducts(channelId)`
  * `retrieveProduct(channelId, productId)`
  * `updateProduct(channelId, productId)`
  * _ProductOrders_
  * `createProductOrders(channelId)`
  * `updateProductOrders(channelId)`
  * `listProductOrders(channelId)`
  * `updateProductOrder(channelId, OrderItemId)`
  * _Statistics_
  * `retrieveStatisticsProfit(channelId)`
  * `retrieveStatisticsRevenue(channelId)`
  * _Search_
  * `searchProducts(channelId)`
 * __Payment_Plans__
  * `list([params])` _not yet implemented_
  * `updateSubscription(params)` _not yet implemented_
  * `cancelSubscription(params)` _not yet implemented_
 * __Payment_Information__
  * `list([params])` _not yet implemented_
  * `update(params)` _not yet implemented_
  * `retrieveClientToken(params)` _not yet implemented_


## Configuration

 * `baabedo.setApiKey(' your secret api key ');`
 * `baabedo.setTimeout(20000); // in ms` (default is node's default: `120000ms`)

## Development

Run the tests using [`npm`](https://www.npmjs.com/):

```bash
$ npm install
$ npm test
```
## [License](LICENSE)

Copyright (C) 2015 [Storeness](http://storeness.de)
