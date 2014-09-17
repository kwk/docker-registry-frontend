FROM ubuntu:14.04
MAINTAINER "Konrad Kleine"

########################################################
# Prerequisites
########################################################

RUN apt-get update
RUN apt-get -y upgrade --no-install-recommends --show-progress
RUN apt-get -y install git nodejs nodejs-legacy npm nginx gettext-base

########################################################
# Build
########################################################

ENV NGX_ROOT /usr/share/nginx/html
ENV SOURCE_DIR /tmp/source

RUN mkdir $SOURCE_DIR
ADD . $SOURCE_DIR
RUN \
  cd $SOURCE_DIR && \
  npm install -g yo && \
  npm install && \
  bower install --allow-root && \
  grunt build --allow-root && \
  cp -rf $SOURCE_DIR/dist/* $NGX_ROOT

# Set correct permissions on directories and directories
RUN find $NGX_ROOT -type d -exec chmod 755 {} \;
RUN find $NGX_ROOT -type f -exec chmod 755 {} \;
RUN chown -R www-data:www-data $NGX_ROOT

########################################################
# Configure Nginx
########################################################

# Don't daemonize nginx
RUN echo "\ndaemon off;" >> /etc/nginx/nginx.conf

# Modify the default enabled site to forward requests
# to /v1/ to the docker registry host. We have to do this
# on every start of the container since nginx has no
# built-in mechanisms to read from environment variables.
# It has other mechanisms (with Lua or Perl) but they are
# too complicated.
ADD nginx-site.conf /root/nginx-site.conf
RUN echo "#!/bin/sh -x\ncat /root/nginx-site.conf | DOCKER_REGISTRY_URL=\$DOCKER_REGISTRY_URL envsubst '\$DOCKER_REGISTRY_URL' > /etc/nginx/sites-available/custom && ln -sf /etc/nginx/sites-available/custom /etc/nginx/sites-enabled/custom && rm -f /etc/nginx/sites-enabled/default && nginx -t && nginx" >> /root/start-nginx.sh
RUN chmod +x /root/start-nginx.sh

########################################################
# Cleanup:
# Remove source code and build dependencies
########################################################
RUN rm -rf /tmp/source
RUN apt-get purge -y --auto-remove git nodejs nodejs-legacy npm

# Expose ports.
EXPOSE 80

# Define default command.
CMD ["/root/start-nginx.sh"]

