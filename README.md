# README

## Notes on how the apps were created

# Rails API

* Create the Rails API via a Docker Image `docker run -it --rm -v "$PWD":/usr/src/app -w /usr/src/app phusion/passenger-ruby24:0.9.27 gem install --no-rdoc --no-ri rails -v 5.1.4 && rails new --skip-bundle --api --database postgresql todoapi`

