README
======

The `docker-registry-frontend` is a pure web-based solution for browsing and modifying any private Docker repository that you can reach via a URL.

This application is available in the form of a Docker image that you can run as a container by executing this command:

    sudo docker run -d \
      -e DOCKER_REGISTRY_URL=http://path-to-your-registry \
      -p 8080:80 \
      konradkleine/docker-registry-frontend

This command starts the container and forwards the container's private port `80` to your host's port `8080`. Make sure you specify the correct url to your registry.

When the application runs you can open your browser and navigate to [http://localhost:8080][1].

If you want to run the application with SSL enabled, you can do the following:
    
    sudo docker run -d \
      -e ENABLE_SSL=yes \
      -v /path/to/your/server.crt:/etc/nginx/ssl/server.crt:ro \
      -v /path/to/your/server.key:/etc/nginx/ssl/server.key:ro \
      -e DOCKER_REGISTRY_URL=http://path-to-your-registry \
      -p 443:443 \
      konradkleine/docker-registry-frontend

Note that the application still serves the port `80` but it is simply not exposed ;).

When the application runs with SSL you can open your browser and navigate to [https://localhost][2].

If you like the application, I invite you to contribute and report bugs or feature request on the project's github page: [https://github.com/kwk/docker-registry-frontend][3].

Thank you for your interest!

 -- Konrad


  [1]: http://localhost:8080
  [2]: https://localhost
  [3]: http://%20https://github.com/kwk/docker-registry-frontend
