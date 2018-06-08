################################################################################
# Stage 1: Build the Angluar application
################################################################################
FROM node:8-alpine as build_app
LABEL maintainer="Konrad Kleine"

ENV WORKDIR=/usr/src
RUN mkdir -p  $WORKDIR \
              $WORKDIR/.git

WORKDIR $WORKDIR

# The node image removes these packages as they are only needed to build node not to run it
# Since we are installing/building npm packages will need these in the image
RUN apk add --no-cache --virtual .build-deps \
  automake \
  autoconf \
  gcc \
  g++ \
  make \
  nasm \
  python \
  zlib-dev

COPY . $WORKDIR

RUN npm install \
  && apk del .build-deps

# Add some git files for versioning
ADD .git/HEAD $WORKDIR/.git/HEAD
ADD .git/refs $WORKDIR/.git/refs

# Create version file
RUN export GITREF=$(cat .git/HEAD | cut -d" " -f2) && \
    export GITSHA1=$(cat .git/$GITREF) && \
    echo "{\"git\": {\"sha1\": \"$GITSHA1\", \"ref\": \"$GITREF\"}}" > app-version.json

## Build App
RUN node_modules/grunt-cli/bin/grunt build --allow-root


################################################################################
# Stage 2:  Run the Angular application
################################################################################

FROM debian:jessie
LABEL maintainer="Konrad Kleine"

USER root

############################################################
# Setup environment variables
############################################################

ENV WWW_DIR /var/www/html
ENV START_SCRIPT /root/start-apache.sh

RUN mkdir -pv $WWW_DIR

############################################################
# Speedup DPKG and don't use cache for packages
############################################################

# Taken from here: https://gist.github.com/kwk/55bb5b6a4b7457bef38d
#
# this forces dpkg not to call sync() after package extraction and speeds up
# install
RUN echo "force-unsafe-io" > /etc/dpkg/dpkg.cfg.d/02apt-speedup
# # we don't need and apt cache in a container
RUN echo "Acquire::http {No-Cache=True;};" > /etc/apt/apt.conf.d/no-cache

############################################################

COPY --from=build_app /usr/src/dist/ $WWW_DIR/
COPY --from=build_app /usr/src/app-version.json $WWW_DIR/app-version.json

############################################################
# Install and configure webserver software
############################################################

RUN apt-get -y update && \
    export DEBIAN_FRONTEND=noninteractive && \
    apt-get -y install \
      apache2 \
      libapache2-mod-auth-kerb \
      libapache2-mod-proxy-html \
      --no-install-recommends && \
    a2enmod proxy && \
    a2enmod proxy_http && \
    apt-get -y autoremove && \
    apt-get -y clean && \
    rm -rf /var/lib/apt/lists/*

############################################################
# Add and enable the apache site and disable all other sites
############################################################

RUN a2dissite 000*
ADD apache-site.conf /etc/apache2/sites-available/docker-site.conf
RUN a2ensite docker-site.conf

ADD start-apache.sh $START_SCRIPT
RUN chmod +x $START_SCRIPT

ENV APACHE_RUN_USER www-data
ENV APACHE_RUN_GROUP www-data
ENV APACHE_LOG_DIR /var/log/apache2

# Let people know how this was built
ADD Dockerfile /root/Dockerfile

# Exposed ports
EXPOSE 80 443

VOLUME ["/etc/apache2/server.crt", "/etc/apache2/server.key"]

CMD $START_SCRIPT
