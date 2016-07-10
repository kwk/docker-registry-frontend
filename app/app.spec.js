'use strict';

describe('docker-registry-frontend', function() {
  var $route, $location, $rootScope, $httpBackend;

  beforeEach(module('docker-registry-frontend'));
  beforeEach(inject(function(_$route_, _$location_, _$rootScope_, _$httpBackend_) {
    $route = _$route_;
    $location = _$location_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
  }));

  it('/home should display home page', function() {
    $httpBackend.expectGET('home.html').respond(200);
    $location.path('/home');
    $rootScope.$digest();
    expect($route.current.templateUrl).toBe('home.html');
    expect($route.current.controller).toBe('HomeController');
  });

  it('/repositories should display repository list page', function() {
    $httpBackend.expectGET('repository/repository-list.html').respond(200);
    $location.path('/repositories');
    $rootScope.$digest();
    expect($route.current.templateUrl).toBe('repository/repository-list.html');
    expect($route.current.controller).toBe('RepositoryListController');
  });

  it('/repositories/10 should display repository list page', function() {
    $httpBackend.expectGET('repository/repository-list.html').respond(200);
    $location.path('/repositories/10');
    $rootScope.$digest();
    expect($route.current.templateUrl).toBe('repository/repository-list.html');
    expect($route.current.controller).toBe('RepositoryListController');
  });

  it('/repositories/20 should display repository list page', function() {
    $httpBackend.expectGET('repository/repository-list.html').respond(200);
    $location.path('/repositories/20');
    $rootScope.$digest();
    expect($route.current.templateUrl).toBe('repository/repository-list.html');
    expect($route.current.controller).toBe('RepositoryListController');
  });

  it('URL with repositoryUser and repositoryName and no tagsPerPage should display repository detail page', function() {
    $httpBackend.expectGET('repository/repository-detail.html').respond(200);
    $location.path('/repository/owner/name');
    $rootScope.$digest();
    expect($route.current.templateUrl).toBe('repository/repository-detail.html');
    expect($route.current.controller).toBe('RepositoryDetailController');
  });

  it('URL with repositoryUser and repositoryName and tagsPerPage should display repository detail page', function() {
    $httpBackend.expectGET('repository/repository-detail.html').respond(200);
    $location.path('/repository/owner/name/10');
    $rootScope.$digest();
    expect($route.current.templateUrl).toBe('repository/repository-detail.html');
    expect($route.current.controller).toBe('RepositoryDetailController');
  });

  // This test currently fails; this URL is incorrectly routing to the home page
  // @todo @FIXME
  //
  // it('URL with repositoryName but no repositoryUser and no tagsPerPage should display repository detail page', function() {
  //   $httpBackend.expectGET('repository/repository-detail.html').respond(200);
  //   $location.path('/repository/cx');
  //   $rootScope.$digest();
  //   expect($route.current.templateUrl).toBe('repository/repository-detail.html');
  //   expect($route.current.controller).toBe('RepositoryDetailController');
  // });

  it('URL with repositoryName but no repositoryUser and tagsPerPage should display repository detail page', function() {
    $httpBackend.expectGET('repository/repository-detail.html').respond(200);
    $location.path('/repository/cx/10');
    $rootScope.$digest();
    expect($route.current.templateUrl).toBe('repository/repository-detail.html');
    expect($route.current.controller).toBe('RepositoryDetailController');
  });

  it('/about should display about page', function() {
    $httpBackend.expectGET('about.html').respond(200);
    $location.path('/about');
    $rootScope.$digest();
    expect($route.current.templateUrl).toBe('about.html');
  });

  it('/tag/repositoryUser/repositoryName/latest should display tag detail page', function() {
    $httpBackend.expectGET('tag/tag-detail.html').respond(200);
    $location.path('/tag/repositoryUser/repositoryName/latest');
    $rootScope.$digest();
    expect($route.current.templateUrl).toBe('tag/tag-detail.html');
    expect($route.current.controller).toBe('TagController');
  });

  // This test currently fails; this URL is incorrectly routing to the home page
  // @todo @FIXME
  //
  // it('/tag/repositoryName/latest should display tag detail page', function() {
  //   $httpBackend.expectGET('tag/tag-detail.html').respond(200);
  //   $location.path('/tag/repositoryName/latest');
  //   $rootScope.$digest();
  //   expect($route.current.templateUrl).toBe('tag/tag-detail.html');
  //   expect($route.current.controller).toBe('TagController');
  // });

  it('/image/88e37c7099fa should display image detail page', function() {
    $httpBackend.expectGET('tag/image-detail.html').respond(200);
    $location.path('/image/88e37c7099fa');
    $rootScope.$digest();
    expect($route.current.templateUrl).toBe('tag/image-detail.html');
    expect($route.current.controller).toBe('ImageController');
  });

  it('/image/88e37c7099fa/tag should display create tag page', function() {
    $httpBackend.expectGET('tag/create-tag.html').respond(200);
    $location.path('/image/88e37c7099fa/tag');
    $rootScope.$digest();
    expect($route.current.templateUrl).toBe('tag/create-tag.html');
    expect($route.current.controller).toBe('CreateTagController');
  });

  it('/unknown-url should display home page', function() {
    $httpBackend.expectGET('home.html').respond(200);
    $location.path('/unknown-url');
    $rootScope.$digest();
    expect($route.current.templateUrl).toBe('home.html');
    expect($route.current.controller).toBe('HomeController');
  });

});
