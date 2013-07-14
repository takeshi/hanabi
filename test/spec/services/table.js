'use strict';

describe('Service: table', function () {

  // load the service's module
  beforeEach(module('hanabiApp'));

  // instantiate service
  var table;
  beforeEach(inject(function (_table_) {
    table = _table_;
  }));

  it('should do something', function () {
    expect(!!table).toBe(true);
  });

});
