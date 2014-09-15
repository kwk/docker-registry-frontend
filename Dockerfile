FROM ubuntu:14.04
MAINTAINER "Konrad Kleine"

########################################################
# Prerequisites
########################################################

RUN apt-get update
RUN apt-get -y upgrade --no-install-recommends --show-progress
RUN apt-get -y install git nodejs nodejs-legacy npm nginx

########################################################
# Build
########################################################

ENV NGX_ROOT /usr/share/nginx/html
RUN mkdir /tmp/source
ADD . /tmp/source
WORKDIR /tmp/source
RUN npm install -g yo
RUN npm install
RUN bower install --allow-root
RUN grunt build --allow-root

########################################################
# Install
########################################################

ADD dist $NGX_ROOT

# Don't daemonize nginx
echo "\ndaemon off;" >> /etc/nginx/nginx.conf

# Set correct permissions on directories and directories
RUN find $NGX_ROOT -type d -exec chmod 755 {} \;
RUN find $NGX_ROOT -type f -exec chmod 755 {} \;
RUN chown -R www-data:www-data $NGX_ROOT

########################################################
# Cleanup:
# Remove source code and build dependencies
########################################################
RUN rm -rf /tmp/source
RUN apt-get purge -y --auto-remove git nodejs nodejs-legacy npm

WORKDIR /root

# Expose ports.
EXPOSE 80
EXPOSE 443

# Define default command.
CMD ["nginx"]

