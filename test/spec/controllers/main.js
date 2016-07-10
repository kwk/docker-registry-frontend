'use strict';

describe('MainController', function() {

  // load the controller's module
  beforeEach(module('main-controller'));

  var ctrl;
  var scope = {};

  beforeEach(inject(function($controller) {
    ctrl = $controller('MainController', {$scope: scope});
  }));

  it('should attach an appVersion and registryHost to the scope', function() {
    var scope_keys = Object.keys(scope).sort();
    expect(scope_keys).toEqual(['appVersion', 'registryHost']);
  });
});
