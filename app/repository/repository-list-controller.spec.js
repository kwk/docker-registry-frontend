'use strict';

describe('RepositoryListController', function() {

  // load the controller's module
  beforeEach(module('repository-list-controller'));

  var $controller, $httpBackend, $q, $rootScope;

  beforeEach(inject(function(_$controller_, _$httpBackend_, _$q_, _$rootScope_) {
    $controller = _$controller_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  it('should attach some keys to the scope', function() {
    var $scope = $rootScope.$new();
    var route = {
      'current': {
        'params': {
          'lastNamespace': 'lastNamespace',
          'lastRepository': 'lastRepository',
          'reposPerPage': 10
        }
      }
    };

    var mockRepositoryReturnValue = {
      repos: [{username: 'username', name: 'name', selected: true}],
      lastNamespace: 'lastNamespace',
      lastRepository: 'lastRepository'
    };
    var mockRepository = {query: null};
    spyOn(mockRepository, 'query').and.returnValue({$promise: $q.when(mockRepositoryReturnValue)});

    var expectedAppMode = {"browseOnly": true, "defaultRepositoriesPerPage": 20, "defaultTagsPerPage": 10};
    $httpBackend.expectGET('/app-mode.json').respond(expectedAppMode);
    var ctrl = $controller('RepositoryListController', {$scope: $scope, $route: route, Repository: mockRepository});
    $httpBackend.flush();
    expect($scope.reposPerPage).toBe(10);
    expect($scope.lastNamespace).toEqual('lastNamespace');
    expect($scope.lastRepository).toEqual('lastRepository');
    expect($scope.selectedRepositories).toEqual(['name']);
    expect(mockRepository.query).toHaveBeenCalled();
    expect($scope.repositories).toEqual(mockRepositoryReturnValue);
  });
});

