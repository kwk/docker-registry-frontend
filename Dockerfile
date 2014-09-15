FROM nginx
MAINTAINER "Konrad Kleine"

# Install tools to build the frontend
RUN apt-get install -y nodejs nodejs-legacy npm

WORKDIR /tmp
RUN mkdir /tmp/source
ADD . /tmp/source
RUN ls /tmp/source

# Add the generated source code to the HTML folder
#ADD dist /usr/local/nginx/html
