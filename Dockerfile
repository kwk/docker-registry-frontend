FROM debian:jessie
MAINTAINER "Konrad Kleine"


USER root

############################################################
# Setup environment variables
############################################################

ENV WWW_DIR /var/www/html
ENV SOURCE_DIR /tmp/source
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
# Install and configure webserver software
############################################################

RUN apt-get -y update && \
    apt-get -y install \
      apache2 \
      libapache2-mod-auth-kerb \
      libapache2-mod-proxy-html \
      --no-install-recommends

RUN a2enmod proxy
RUN a2enmod proxy_http

############################################################
# This adds everything we need to the build root except those
# element that are matched by .dockerignore.
# We explicitly list every directory and file that is involved
# in the build process but. All config files (like nginx) are
# not listed to speed up the build process. 
############################################################

# Create dirs
RUN mkdir -p $SOURCE_DIR/dist
RUN mkdir -p $SOURCE_DIR/app
RUN mkdir -p $SOURCE_DIR/test

# Add dirs
ADD app $SOURCE_DIR/app
ADD test $SOURCE_DIR/test

# Dot files
ADD .jshintrc $SOURCE_DIR/
ADD .bowerrc $SOURCE_DIR/
ADD .editorconfig $SOURCE_DIR/
ADD .travis.yml $SOURCE_DIR/

# Other files
ADD bower.json $SOURCE_DIR/
ADD Gruntfile.js $SOURCE_DIR/
ADD LICENSE $SOURCE_DIR/
ADD package.json $SOURCE_DIR/
ADD README.md $SOURCE_DIR/

# Add Git version information to it's own json file app-version.json
RUN mkdir -p $SOURCE_DIR/.git
ADD .git/HEAD $SOURCE_DIR/.git/HEAD
ADD .git/refs $SOURCE_DIR/.git/refs
RUN cd $SOURCE_DIR && \
    export GITREF=$(cat .git/HEAD | cut -d" " -f2) && \
    export GITSHA1=$(cat .git/$GITREF) && \
    echo "{\"git\": {\"sha1\": \"$GITSHA1\", \"ref\": \"$GITREF\"}}" > $WWW_DIR/app-version.json && \
    cd $SOURCE_DIR && \
    rm -rf $SOURCE_DIR/.git

############################################################
# This is written so compact, to reduce the size of the
# final container and its layers. We have to install build
# dependencies, build the app, deploy the app to the web
# root, remove the source code, and then uninstall the build
# dependencies. When packed into one RUN instruction, the
# resulting layer will hopefully only be comprised of the
# installed app artifacts.
############################################################

RUN apt-get -y install \
      git \
      nodejs \
      nodejs-legacy \
      npm \
      --no-install-recommends && \
    git config --global url."https://".insteadOf git:// && \
    cd $SOURCE_DIR && \
    npm install && \
    node_modules/bower/bin/bower install --allow-root && \
    node_modules/grunt-cli/bin/grunt build --allow-root && \
    cp -rf $SOURCE_DIR/dist/* $WWW_DIR && \
    rm -rf $SOURCE_DIR && \
    apt-get -y --auto-remove purge git nodejs nodejs-legacy npm && \
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
