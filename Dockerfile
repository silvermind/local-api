FROM dockerfile/ubuntu

MAINTAINER Jakub Szalek <jszalek@sointeractive.pl>

# Install Node
RUN  apt-get -y install software-properties-common
RUN  apt-add-repository ppa:chris-lea/node.js
RUN  apt-get update
RUN  apt-get -y install nodejs

COPY . /src
RUN cd /src; npm install

RUN cd /src/bin

EXPOSE 3333
CMD ["/src/bin/localapi", "-r", "/src/example_raml/raml_example_file.raml > /tmp/localapi_error.log > /tmp/localapi_log.log &"]
