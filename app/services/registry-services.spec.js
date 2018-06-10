'use strict';

describe('registry-service', function () {
  var mockRepository, $httpBackend;
  beforeEach(angular.mock.module('registry-services'));

  describe('GET catalog', function() {
    beforeEach(function () {
      angular.mock.inject(function ($injector) {
          $httpBackend = $injector.get('$httpBackend');
          mockRepository = $injector.get('Repository');
      });
    });

    describe('when no last given', function(){
      it('should return repositories', inject(function () {
        $httpBackend.expectGET('/v2/_catalog?n=20&last=')
          .respond(200, {
            repositories: ['nginx']
          });

        var result = mockRepository.query({ n: 20 });
        $httpBackend.flush();

        expect(result).hasOwnProperty('repos');
        expect(result.repos.length).toEqual(1);
        expect(result.repos[0]).toEqual({
          username: 'nginx',
          name: 'nginx',
          selected: false
        });
        expect(result.lastNamespace).toBeUndefined;
        expect(result.lastRepository).toBeUndefined;
      }));
    });

    describe('when last given', function(){
      it('should use last in query pram', inject(function () {
        $httpBackend.expectGET('/v2/_catalog?n=20&last=nginx')
          .respond({
            repositories: ['redis']
          });

        var result = mockRepository.query({ n: 20, last: 'nginx' });

        $httpBackend.flush();

        expect(result).hasOwnProperty('repos');
        expect(result.repos.length).toEqual(1);
        expect(result.repos[0]).toEqual({
          username: 'redis',
          name: 'redis',
          selected: false
        });
        expect(result.lastNamespace).toBeUndefined;
        expect(result.lastRepository).toBeUndefined;
      }));
    });

    describe('when only the first page is fetched', function(){
      describe('and last parameter has namespace and repo name', function(){
        it('should return last properties', inject(function () {
          $httpBackend.expectGET('/v2/_catalog?n=20&last=')
            .respond({
              repositories: ['redis']
            }, {
              link: '</v2/_catalog?last=namespace%2Frepository&n=10>; rel="next"'
            });

          var result = mockRepository.query({ n: 20 });

          $httpBackend.flush();

          expect(result).hasOwnProperty('repos');
          expect(result.repos.length).toEqual(1);
          expect(result.repos[0]).toEqual({
            username: 'redis',
            name: 'redis',
            selected: false
          });
          expect(result.lastNamespace).toEqual('namespace');
          expect(result.lastRepository).toEqual('repository');
        }));
      });

      describe('and last parameter has only repo name', function(){
        it('should return last properties', inject(function () {
          $httpBackend.expectGET('/v2/_catalog?n=20&last=')
            .respond({
              repositories: ['redis']
            }, {
              link: '</v2/_catalog?last=repository&n=10>; rel="next"'
            });

          var result = mockRepository.query({ n: 20 });

          $httpBackend.flush();

          expect(result).hasOwnProperty('repos');
          expect(result.repos.length).toEqual(1);
          expect(result.repos[0]).toEqual({
            username: 'redis',
            name: 'redis',
            selected: false
          });
          expect(result.lastNamespace).toEqual('repository');
          expect(result.lastRepository).toBeUndefined;
        }));
      });

      describe('and no next link is provided', function(){
        it('should return undefined last properties', inject(function () {
          $httpBackend.expectGET('/v2/_catalog?n=20&last=')
            .respond({
              repositories: ['redis']
            }, {
              link: '</v2/_catalog?last=namespace%2Frepository&n=10>; rel="not-next"'
            });

          var result = mockRepository.query({ n: 20 });

          $httpBackend.flush();

          expect(result).hasOwnProperty('repos');
          expect(result.repos.length).toEqual(1);
          expect(result.repos[0]).toEqual({
            username: 'redis',
            name: 'redis',
            selected: false
          });
          expect(result.lastNamespace).toBeUndefined;
          expect(result.lastRepository).toBeUndefined;
        }));
      });

      describe('and next link malformed', function(){
        it('should return undefined last properties', inject(function () {
          $httpBackend.expectGET('/v2/_catalog?n=20&last=')
            .respond({
              repositories: ['redis']
            }, {
              link: '/v2/_catalog?last=namespace%2Frepository&n=10; rel="next"'
            });

          var result = mockRepository.query({ n: 20 });

          $httpBackend.flush();

          expect(result).hasOwnProperty('repos');
          expect(result.repos.length).toEqual(1);
          expect(result.repos[0]).toEqual({
            username: 'redis',
            name: 'redis',
            selected: false
          });
          expect(result.lastNamespace).toBeUndefined;
          expect(result.lastRepository).toBeUndefined;
        }));
      });

      describe('and next link missing last parameter', function(){
        it('should return undefined last properties', inject(function () {
          $httpBackend.expectGET('/v2/_catalog?n=20&last=')
            .respond({
              repositories: ['redis']
            }, {
              link: '/v2/_catalog?n=10; rel="next"'
            });

          var result = mockRepository.query({ n: 20 });

          $httpBackend.flush();

          expect(result).hasOwnProperty('repos');
          expect(result.repos.length).toEqual(1);
          expect(result.repos[0]).toEqual({
            username: 'redis',
            name: 'redis',
            selected: false
          });
          expect(result.lastNamespace).toBeUndefined;
          expect(result.lastRepository).toBeUndefined;
        }));
      });
    });
  });
});
