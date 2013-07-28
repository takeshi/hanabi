'use strict';

describe('Controller: SubsystemCtrl', function () {

  // load the controller's module
  beforeEach(module('hanabiApp'));

  var SubsystemCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SubsystemCtrl = $controller('SubsystemCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
