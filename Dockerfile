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

# Modify the our custom nginx site to forward requests
# to /v1/ to the docker registry host. We have to do this
# on every start of the container since nginx has no
# built-in mechanisms to read from environment variables.
# It has other mechanisms (with Lua or Perl) but they are
# too complicated.
ADD nginx-site.conf /root/nginx-site.conf
ADD nginx-site-ssl.conf /root/nginx-site-ssl.conf

ENV START_SCRIPT /root/start-nginx.sh
RUN echo "#!/bin/sh" > $START_SCRIPT
# Remove default site
RUN echo "rm -f /etc/nginx/sites-enabled/*" >> $START_SCRIPT
# Substitute URL to docker registry
RUN echo "cat /root/nginx-site.conf | DOCKER_REGISTRY_URL=\$DOCKER_REGISTRY_URL envsubst '\$DOCKER_REGISTRY_URL' > /etc/nginx/sites-available/registry" >> $START_SCRIPT
# If SSL is requested, copy config to /etc/nginx/conf.d/
# directory from which everyting gets included automatically.
RUN echo "if [ -n \"\$ENABLE_SSL\" ]; then" >> $START_SCRIPT
RUN echo "   cat /root/nginx-site-ssl.conf | DOCKER_REGISTRY_URL=\$DOCKER_REGISTRY_URL envsubst '\$DOCKER_REGISTRY_URL' > /etc/nginx/conf.d/registry-ssl" >> $START_SCRIPT
RUN echo "fi" >> $START_SCRIPT
# Enable the "registry" site
RUN echo "ln -sf /etc/nginx/sites-available/registry /etc/nginx/sites-enabled/registry && \\" >> $START_SCRIPT
# Check nginx config and start it
RUN echo "nginx -t && nginx" >> $START_SCRIPT

RUN chmod +x /root/start-nginx.sh

########################################################
# Cleanup:
# Remove source code and build dependencies
########################################################
RUN rm -rf /tmp/source
RUN apt-get purge -y --auto-remove git nodejs nodejs-legacy npm

# Expose ports.
EXPOSE 80

# If you wish to run the registry container with SSL,
# you can provide your own SSL server key and your
# SSL server certificate.
VOLUME ["/etc/nginx/ssl/server.crt", "/etc/nginx/ssl/server.key"]

# Define default command.
CMD ["/root/start-nginx.sh"]

