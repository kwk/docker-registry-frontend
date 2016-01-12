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
      //   "schemaVersion": 1,
      //   "name": "arthur/busybox",
      //   "tag": "demo",
      //   "architecture": "amd64",
      //   "fsLayers": [
      //     {
      //       "blobSum": "sha256:a3ed95caeb02ffe68cdd9fd84406680ae93d633cb16422d00e8a7c22955b46d4"
      //     },
      //     {
      //       "blobSum": "sha256:d7e8ec85c5abc60edf74bd4b8d68049350127e4102a084f22060f7321eac3586"
      //     }
      //   ],
      //   "history": [
      //     {
      //       "v1Compatibility": "{\"id\":\"3e1018ee907f25aef8c50016296ab33624796511fdbfdbbdeca6a3ed2d0ba4e2\",\"parent\":\"176dfc9032a1ec3ac8586b383e325e1a65d1f5b5e6f46c2a55052b5aea8310f7\",\"created\":\"2016-01-12T17:47:39.251310827Z\",\"container\":\"2732d16efa11ab7da6393645e85a7f2070af94941a782a69e86457a2284f4a69\",\"container_config\":{\"Hostname\":\"ea7fe68f39fd\",\"Domainname\":\"\",\"User\":\"\",\"AttachStdin\":false,\"AttachStdout\":false,\"AttachStderr\":false,\"Tty\":false,\"OpenStdin\":false,\"StdinOnce\":false,\"Env\":[\"PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\"],\"Cmd\":[\"/bin/sh\",\"-c\",\"#(nop) LABEL awesome=Not yet!\"],\"Image\":\"176dfc9032a1ec3ac8586b383e325e1a65d1f5b5e6f46c2a55052b5aea8310f7\",\"Volumes\":null,\"WorkingDir\":\"\",\"Entrypoint\":null,\"OnBuild\":[],\"Labels\":{\"awesome\":\"Not yet!\",\"test\":\"yes\",\"working\":\"true\"}},\"docker_version\":\"1.9.1\",\"author\":\"Arthur\",\"config\":{\"Hostname\":\"ea7fe68f39fd\",\"Domainname\":\"\",\"User\":\"\",\"AttachStdin\":false,\"AttachStdout\":false,\"AttachStderr\":false,\"Tty\":false,\"OpenStdin\":false,\"StdinOnce\":false,\"Env\":[\"PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\"],\"Cmd\":[\"sh\"],\"Image\":\"176dfc9032a1ec3ac8586b383e325e1a65d1f5b5e6f46c2a55052b5aea8310f7\",\"Volumes\":null,\"WorkingDir\":\"\",\"Entrypoint\":null,\"OnBuild\":[],\"Labels\":{\"awesome\":\"Not yet!\",\"test\":\"yes\",\"working\":\"true\"}},\"architecture\":\"amd64\",\"os\":\"linux\"}"
      //     },
      //     {
      //       "v1Compatibility": "{\"id\":\"5c5fb281b01ee091a0fffa5b4a4c7fb7d358e7fb7c49c263d6d7a4e35d199fd0\",\"created\":\"2015-12-08T18:31:50.979824705Z\",\"container\":\"ea7fe68f39fd0df314e841247fb940ddef4c02ab7b5edb0ee724adc3174bc8d9\",\"container_config\":{\"Hostname\":\"ea7fe68f39fd\",\"Domainname\":\"\",\"User\":\"\",\"AttachStdin\":false,\"AttachStdout\":false,\"AttachStderr\":false,\"Tty\":false,\"OpenStdin\":false,\"StdinOnce\":false,\"Env\":null,\"Cmd\":[\"/bin/sh\",\"-c\",\"#(nop) ADD file:c295b0748bf05d4527f500b62ff269bfd0037f7515f1375d2ee474b830bad382 in /\"],\"Image\":\"\",\"Volumes\":null,\"WorkingDir\":\"\",\"Entrypoint\":null,\"OnBuild\":null,\"Labels\":null},\"docker_version\":\"1.8.3\",\"config\":{\"Hostname\":\"ea7fe68f39fd\",\"Domainname\":\"\",\"User\":\"\",\"AttachStdin\":false,\"AttachStdout\":false,\"AttachStderr\":false,\"Tty\":false,\"OpenStdin\":false,\"StdinOnce\":false,\"Env\":null,\"Cmd\":null,\"Image\":\"\",\"Volumes\":null,\"WorkingDir\":\"\",\"Entrypoint\":null,\"OnBuild\":null,\"Labels\":null},\"architecture\":\"amd64\",\"os\":\"linux\",\"Size\":1113436}"
      //     }
      //   ],
      // }
      'query': {
        method:'GET',
        isArray: false,
        transformResponse: function(data, headers){
          var res = {};
          var history = [];
          var tmp;
          var resp = angular.fromJson(data);
          var v1Compatibility = undefined;

          for (var idx in resp.history){

            v1Compatibility = angular.fromJson(resp.history[idx].v1Compatibility);

            if(v1Compatibility !== undefined){
              tmp = {
                id : v1Compatibility.id,
                os : v1Compatibility.os,
                docker_version: v1Compatibility.docker_version,
                created: v1Compatibility.created,
                // parentLayer: v1Compatibility.parent
              };
              if(v1Compatibility.author){
                tmp.author = v1Compatibility.author;
              }
              if(v1Compatibility.config && v1Compatibility.config.Labels){
                tmp.labels = v1Compatibility.config.Labels;
              }
              history.push(tmp);
            }
          }
          if(history.length > 0){
            res = history[0];
            res.history = history;
          }
          res.fsLayers = resp.fsLayers;
          res.digest = headers('docker-content-digest');
          res.architecture = resp.architecture;
          return res;
        },
      }
    });
  }])
  // This is not totally working right now (problem with big layers)
  /*
  .factory('Blob', ['$resource', function($resource){
    return $resource('/v2/:repoUser/:repoName/blobs/:digest', {}, {

      'query': {
        method:'HEAD',
        interceptor: function(data, headers){
          var res = {contentLength: parseInt(headers('content-length'))};
          return res;
        } 
      }

    });
  }]) */ ;
