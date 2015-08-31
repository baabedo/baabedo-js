'use strict';

require('./testUtils');

var Error = require('../lib/Error');
var expect = require('chai').expect;

describe('Error', function() {

  it('Populates with type and message params', function() {
    var e = new Error('FooError', 'Foo happened');
    expect(e).to.have.property('type', 'FooError');
    expect(e).to.have.property('message', 'Foo happened');
    expect(e).to.have.property('stack');
  });

  describe('BaabedoError', function() {
    it('Generates specific instance depending on error-type', function() {
      expect(Error.BaabedoError.generate({ type: 'invalid_request_error' })).to.be.instanceOf(Error.BaabedoInvalidRequestError);
      expect(Error.BaabedoError.generate({ type: 'api_error' })).to.be.instanceOf(Error.BaabedoAPIError);
    });
  });
});
