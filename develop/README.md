# Setup development environment

These sections show how you can get started to develop for the docker-registry-frontend on various platforms.

## Quick and dirty frontend development

This method shows how you can code on the angularJS frontend code and directly see the results in your browser. You only depend on `docker-compose` and `git` on your host system.

1. [Install Docker Compose](https://docs.docker.com/compose/install/) and [Git](http://git-scm.com/downloads) on your development host. The rest of the requirements will be installed in a container.
1. Checkout the docker-registry-frontend source code:

   `git clone https://github.com/kwk/docker-registry-frontend.git`

1. Start a frontend container and a testing registry container in the background:

   `docker-compose -f docker-registry-frontend/develop/docker-compose.yml up -d`

1. Navigate to [http://localhost:9000](http://localhost:9000) on your development machine and see the docker-registry-frontend in action.

Now you can edit the code under `docker-registry-frontend/app`. Most of the time when you edit something, your browser will automatically update to reflect your changes. Sometimes you might need to reload the browser to see your changes.

### Things not covered by this method

This method uses `grunt` internally and no Apache. Therefore some things cannot be tested or developed with this method:

1. authentication (e.g. Kerberos) - since authentication is done in Apache normally
1. [HTTPS](https://github.com/kwk/docker-registry-frontend#ssl-encryption)
1. basically any parameter that you would configure in `start-apache.sh`

Happy hacking!
