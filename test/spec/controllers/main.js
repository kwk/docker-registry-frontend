'use strict';

describe('MainController', function() {

  // load the controller's module
  beforeEach(module('main-controller'));

  var ctrl;
  var scope = {};
  var $httpBackend;

  beforeEach(inject(function($controller, _$httpBackend_) {
    ctrl = $controller('MainController', {$scope: scope});
    $httpBackend = _$httpBackend_;
  }));

  it('should attach an appVersion and registryHost to the scope', function() {
    var scopeKeys = Object.keys(scope).sort();
    expect(scopeKeys).toEqual(['appVersion', 'registryHost']);

    var expectedAppVersion = {"git": {"sha1": "foo", "ref": "bar"}};
    var expectedRegistryHost = {"host": "path-to-your-registry", "port": 80};
    $httpBackend.expectGET('/app-version.json').respond(expectedAppVersion);
    $httpBackend.expectGET('registry-host.json').respond(expectedRegistryHost);
    $httpBackend.flush();
    jasmine.addCustomEqualityTester(angular.equals);
    expect(scope.appVersion).toEqual(expectedAppVersion);
    expect(scope.registryHost).toEqual(expectedRegistryHost);
  });
});
