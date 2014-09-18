FROM ubuntu:14.04
MAINTAINER "Konrad Kleine"

ENV NGX_ROOT /usr/share/nginx/html
ENV SOURCE_DIR /tmp/source
ENV START_SCRIPT /root/start-nginx.sh

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

############################################################
# This is written so compact, to reduce the size of the
# final container and its layers. We have to install build
# dependencies, build the app, deploy the app to the web
# root, remove the source code, and then uninstall the build
# dependencies. When packed into one RUN instruction, the
# resulting layer will hopefully only be comprised of the
# installed app artifacts.
############################################################

RUN apt-get update && \
    apt-get -y install git nodejs nodejs-legacy npm nginx gettext-base && \
    cd $SOURCE_DIR && \
    npm install -g yo && \
    npm install && \
    bower install --allow-root && \
    grunt build --allow-root && \
    cp -rf $SOURCE_DIR/dist/* $NGX_ROOT && \
    rm -rf /tmp/source && \
    apt-get purge -y --auto-remove git nodejs nodejs-legacy npm

# Add nginx config files for HTTP and HTTPS
ADD nginx-site.conf /root/nginx-site.conf
ADD nginx-site-ssl.conf /root/nginx-site-ssl.conf

# Final touches on the app artifacts.
RUN find $NGX_ROOT -type d -exec chmod 755 {} \; && \
    find $NGX_ROOT -type f -exec chmod 755 {} \; && \
    chown -R www-data:www-data $NGX_ROOT && \
    echo "\ndaemon off;" >> /etc/nginx/nginx.conf

# Build the start script
RUN echo "#!/bin/sh" > $START_SCRIPT && \
    echo "rm -f /etc/nginx/sites-enabled/*" >> $START_SCRIPT && \
    echo "cat /root/nginx-site.conf | DOCKER_REGISTRY_URL=\$DOCKER_REGISTRY_URL envsubst '\$DOCKER_REGISTRY_URL' > /etc/nginx/sites-available/registry" >> $START_SCRIPT && \
    echo "if [ -n \"\$ENABLE_SSL\" ]; then" >> $START_SCRIPT && \
    echo "   cat /root/nginx-site-ssl.conf | DOCKER_REGISTRY_URL=\$DOCKER_REGISTRY_URL envsubst '\$DOCKER_REGISTRY_URL' > /etc/nginx/conf.d/registry-ssl" >> $START_SCRIPT && \
    echo "fi" >> $START_SCRIPT && \
    echo "ln -sf /etc/nginx/sites-available/registry /etc/nginx/sites-enabled/registry && \\" >> $START_SCRIPT && \
    echo "nginx -t && nginx" >> $START_SCRIPT && \
    chmod +x /root/start-nginx.sh

# Exposed ports
EXPOSE 80 443

# If you wish to run the registry container with SSL,
# you can provide your own SSL server key and your
# SSL server certificate.
VOLUME ["/etc/nginx/ssl/server.crt", "/etc/nginx/ssl/server.key"]

# Define default command.
CMD ["/root/start-nginx.sh"]
