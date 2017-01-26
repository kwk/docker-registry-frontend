# Setup development environment

These sections show how you can get started to develop for the docker-registry-frontend on various platforms.

## Quick and dirty frontend development

This method shows how you can code on the angularJS frontend code and directly see the results in your browser. You only depend on `docker-compose` and `git` on your host system.

1. [Install Docker Compose](https://docs.docker.com/compose/install/) and [Git](http://git-scm.com/downloads) on your development host. The rest of the requirements will be installed in a container.
1. Checkout the docker-registry-frontend source code:

   `git clone https://github.com/kwk/docker-registry-frontend.git`

1. Start a frontend container and a testing registry container in the background:

   `cd docker-registry-frontend/develop && docker-compose up`

1. Navigate to [http://localhost:9000](http://localhost:9000) on your development machine and see the docker-registry-frontend in action. Note, that the testing registry does not persistently store changes and when started for the first time, it will not contain any repository nor image.

Now you can edit the code under `docker-registry-frontend/app` **on your development host**. Most of the time when you edit something, your browser will automatically update to reflect your changes. Sometimes you might need to reload the browser to see your changes. Cool, eh?

### How to connect to your own registry?

If you want to use your own hosted registry with your development environment, make sure that your registry is reachable without authentication from your development host.

Kill all potentially running frontend or registry containers:

    docker-compose -f docker-registry-frontend/develop/docker-compose.yml kill

Then open [develop/docker-compose.yml](docker-compose.yml) and paste this into the file:

```yaml
    frontend:
      build: .
      ports:
        - "9000:9000"
      volumes:
        - ../:/source:rw
        - ./start-develop.sh:/root/start-develop.sh:ro
```

Notice that we removed the `links` section from the `frontend` section and that the `registry` section is completely gone.

Now open [Gruntfile.js](../Gruntfile.js) and find these lines:

```javascript
        {
          context: '/v2',
          host: 'path-to-your-registry-v2',
          port: 80,
          https: false,
          xforward: false,
          headers: {
            "x-custom-added-header": 'custom-value'
          }
        }
```

Adjust them to your liking and replace `path-to-your-registry` with the IP address or hostname of your own registry. I suggest to use the IP address; otherwise your development container might have hard time resolving the domain.

Now, setup your containers again:

   `docker-compose -f docker-registry-frontend/develop/docker-compose.yml up -d`

Finally, browse to [http://localhost:9000](http://localhost:9000) to see the frontend serving your registry.

### Things not covered by this method

This method uses `grunt` internally and no Apache. Therefore some things cannot be tested or developed with this method:

1. authentication (e.g. Kerberos) - since authentication is done in Apache normally
1. [HTTPS](https://github.com/kwk/docker-registry-frontend#ssl-encryption)
1. basically any parameter that you would configure in `start-apache.sh`

Happy hacking!
