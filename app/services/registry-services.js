'use strict';

// This is the main entrypoint to interact with the Docker registry.

// Helpful resources
//
// https://docs.angularjs.org/tutorial/step_11
// https://docs.angularjs.org/api/ngResource/service/$resource

angular.module('registry-services', ['ngResource'])
  .factory('RegistryHost', ['$resource', function($resource){
    return $resource('registry-host.json', {}, {
      'query': {
        method:'GET',
        isArray: false,
      },
    });
  }])
  // Repository returns:
  //
  //   {
  //     repos: [
  //       {username: 'SomeNamespace', name: 'SomeNamespace/SomeRepo1', selected: true|false},
  //       {username: 'SomeOtherNamespace', name: 'SomeOtherNamespace/SomeRepo2', selected: true|false},
  //       {username: 'SomeCompletelyDifferenNamespace', name: 'SomeCompletelyDifferenNamespace/SomeRepo3', selected: true|false}
  //     ],
  //     nextLink: '/v2/_catalog?last=SomeNamespace%F2SomeRepo&n=1'
  //   }
  //
  // The "nextLink" element is a preparation for supporting pagination
  // (see https://github.com/docker/distribution/blob/master/docs/spec/api.md#pagination)
  //
  // On subsequent calls to "Repository()" you may pass in "n" as the number of
  // elements per page as well as "last" which is the "nextLink" from the last
  // call to Repository.
  .factory('Repository', ['$resource', function($resource){
    return $resource('/v2/_catalog?n=:n&last=:last', {}, {
      'query': {
        method:'GET',
        isArray: false,
        transformResponse: function(data, headers){
          var repos = angular.fromJson(data).repositories;

          // Extract the "last=" part from Link header:
          //
          //   Link: </v2/_catalog?last=namespace%2repository&n=10>; rel="next"
          //
          // We only want to extrace the "last" part and store it like this
          //
          //   lastNamespace = namespace
          //   lastRepository = repository
          //
          // TODO: Can we clean this up a bit?
          var last = undefined;
          var lastNamespace = undefined;
          var lastRepository = undefined;
          var linkHeader = headers()['link'];
          //console.log('linkHeader='+linkHeader);
          if (linkHeader) {
            var lastUrl = ''+linkHeader.split(';')[0].replace('<','').replace('>','');
            var startPos = lastUrl.search('last=');
            //console.log('startPos=' + startPos);
            if (startPos >= 0) {
              var endPos = lastUrl.substring(startPos).search('&');
              //console.log('endPos=' + endPos);
              if (endPos >= 0) {
                last = lastUrl.substring(startPos+'last='.length, startPos+endPos);
                //console.log('last=' + last);
                var parts = last.split('%2F');
                //console.log('parts=' + parts);
                if (parts.length == 2) {
                  lastNamespace = parts[0];
                  lastRepository = parts[1];
                }
              }
            }
          }

          var ret = {
            repos: [],
            lastNamespace: lastNamespace,
            lastRepository: lastRepository
          };

          angular.forEach(repos, function(value/*, key*/) {
            ret.repos.push({
              username: ''+value.split('/')[0],
              name: value,
              selected: false
            });
          });

          return ret;
        }
      },
      'delete': {
        url: '/v2/repositories/:repoUser/:repoName/',
        method: 'DELETE',
      }
    });
  }])
  .factory('Tag', ['$resource', function($resource){
    // TODO: rename :repo to repoUser/repoString for convenience.
    // https://github.com/docker/distribution/blob/master/docs/spec/api.md#listing-image-tags
    return $resource('/v2/:repoUser/:repoName/tags/list', {}, {
      // Response example:
      // {"name":"kkleine/docker-registry-frontend","tags":["v2", "v1-deprecated"]}
      'query': {
        method:'GET',
        isArray: true,
        transformResponse: function(data/*, headers*/){
          var res = [];
          var resp = angular.fromJson(data);
          for (var idx in resp.tags){
            res.push({
              name: resp.tags[idx],
              imageId: 'ImageIDOf'+resp.tags[idx],
              selected: false
            });
          }
          return res;
        },
      },
      'delete': {
        url: '/v1/repositories/:repoUser/:repoName/tags/:tagName',
        method: 'DELETE',
      },
      'exists': {
        url: '/v1/repositories/:repoUser/:repoName/tags/:tagName',
        method: 'GET',
        transformResponse: function(data/*, headers*/){
          // data will be the image ID if successful or an error object.
          data = angular.isString(angular.fromJson(data));
          return data;
        },
      },
      // Usage: Tag.save({repoUser:'someuser', repoName: 'someRepo', tagName: 'someTagName'}, imageId);
      'save': {
        method:'PUT',
        url: '/v1/repositories/:repoUser/:repoName/tags/:tagName',
      },
    });
  }])
  .factory('Manifest', ['$resource', function($resource){

    return $resource('/v2/:repoUser/:repoName/manifests/:tagName', {}, {
      // Response example:
      // {
      //   "schemaVersion": 2,
      //   "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
      //   "config": {
      //     "mediaType": "application/vnd.docker.container.image.v1+json",
      //     "size": 7963,
      //     "digest": "sha256:1f1e1ccbb0918e4b08f877035831d178a6c34aeec58cfe2dc6014557b2e8ec13"
      //   },
      //   "layers": [
      //     {
      //       "mediaType": "application/vnd.docker.image.rootfs.diff.tar.gzip",
      //       "size": 52550276,
      //       "digest": "sha256:cd0a524342efac6edff500c17e625735bbe479c926439b263bbe3c8518a0849c"
      //     },
      //     {
      //       "mediaType": "application/vnd.docker.image.rootfs.diff.tar.gzip",
      //       "size": 78849205,
      //       "digest": "sha256:14b8a88a0af049efa3c92b1c96a947f501ec7c751a568b0d3881b3c757a184a3"
      //     }
      //   ]
      // }
      'query': {
        method:'GET',
        headers: {
          accept: 'application/vnd.docker.distribution.manifest.v2+json',
        },
        transformResponse: function(data, headers){
          data = angular.fromJson(data);
          data.digest = headers('docker-content-digest');
          data.imageId = data.config.digest.replace(/^sha256:/, '');
          data.size = data.layers.reduce(function(size, layer) {
            return size + layer.size;
          }, data.config.size);

          return data;
        },
      }
    });
  }])
  .factory('Blob', ['$resource', function($resource){
    return $resource('/v2/:repoUser/:repoName/blobs/:digest', {}, {
    // {
    //   "architecture": "amd64",
    //   "config": {},
    //   "container": "caab3f21c75adc3560754e71374cd01cb1bbe39b2b9c2809ff6c22bbcd39206c",
    //   "container_config": {},
    //   "created": "2017-04-25T03:44:24.620936172Z",
    //   "docker_version": "17.04.0-ce",
    //   "history": [
    //     {
    //       "created": "2017-04-24T19:20:41.290148217Z",
    //       "created_by": "/bin/sh -c #(nop) ADD file:712c48086043553b85ffb031d8f6c5de857a2e53974df30cdfbc1e85c1b00a25 in / "
    //     },
    //     {
    //       "created": "2017-04-24T19:20:42.022627269Z",
    //       "created_by": "/bin/sh -c #(nop)  CMD [\"/bin/bash\"]",
    //       "empty_layer": true
    //     }
    //   ],
    //   "os": "linux",
    //   "rootfs": {}
    // }
      'query': {
        method: 'GET',
        transformResponse: function(data, headers){
          data = angular.fromJson(data);
          data.dockerfile = data.history.map(function(history) {
            return history.created_by
              .replace(new RegExp('^/bin/sh -c #\\(nop\\)\\s*'), '')
              .replace(new RegExp('^/bin/sh -c\\s*'), 'RUN ')
              .replace(/\t\t/g, '\\\n\t');
          });

          return data;
        }
      }

    });
  }]);
