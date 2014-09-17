README
======

The `docker-registry-frontend` is a pure web-based solution for browsing and modifying any private Docker repository that you can reach via a URL.

This application is available in the form of a Docker image that you can run as a container by executing this command:

    sudo docker run -d -e DOCKER_REGISTRY_URL=http://path-to-your-registry -p 8080:80 konradkleine/docker-registry-frontend

This command starts the container and forwards the container's private port `80` to your host's port `8080`. Make sure you specify the correct url to your registry.

When the application runs you can open your browser and navigate to [http://localhost:8080][1].

If you like the application, I invite you to contribute and report bugs or feature request on the project's github page: [https://github.com/kwk/docker-registry-frontend][2].

Thank you for your interest!

 -- Konrad


  [1]: http://localhost:8080
  [2]: http://%20https://github.com/kwk/docker-registry-frontend
