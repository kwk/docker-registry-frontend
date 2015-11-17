FROM ubuntu:14.04
MAINTAINER "Konrad Kleine"

USER root

############################################################
# Setup environment variables
############################################################

ENV SOURCE_DIR /source
ENV START_SCRIPT /root/start-develop.sh

############################################################
# Speedup DPKG and don't use cache for packages
############################################################

# Taken from here: https://gist.github.com/kwk/55bb5b6a4b7457bef38d
#
# this forces dpkg not to call sync() after package extraction and speeds up
# install
RUN echo "force-unsafe-io" > /etc/dpkg/dpkg.cfg.d/02apt-speedup
# we don't need and apt cache in a container
RUN echo "Acquire::http {No-Cache=True;};" > /etc/apt/apt.conf.d/no-cache

RUN apt-get -y update && \
    export DEBIAN_FRONTEND=noninteractive

############################################################
# Install development requirements
############################################################

RUN apt-get -y install \
      git \
      nodejs \
      nodejs-legacy \
      npm \
      --no-install-recommends
RUN git config --global url."https://".insteadOf git://
# Avoid this: "Problem with the SSL CA cert (path? access rights?)"
RUN git config --global http.sslVerify false

############################################################
# Create start script
############################################################

# Let people know how this was built
ADD Dockerfile /root/Dockerfile

# Exposed ports (only the grunt port 9000)
EXPOSE 9000

VOLUME ["/source"]

CMD $START_SCRIPT
