## Notes on how the apps were initially created

## Backend: Rails API

For details on developing with the Rails API check the apps [README](todoapi/README.md) file.

* Create the Rails API via a ruby Docker Image `docker run -it --rm -v "$PWD":/usr/src/app -w /usr/src/app phusion/passenger-ruby24:0.9.27 gem install --no-rdoc --no-ri rails -v 5.1.4 && rails new --api --database postgresql todoapi`

This will create our new Rails app (including the Gemfile.lock). The remaining files are added and configured manually as follows:

* Add `Dockerfile`
* Add `docker-compose.yml`
* Add `webapp.conf` 
* Add `rails-env.conf`
* Add `setup.sh`. Set this file to executable `chmod +x setup.sh`.
* Add a customer logger in `config/application.rb` which sends logs to STDOUT so that we can use `docker-compose logs -f` (see below for starting the app).
* Update the database.yml file with the correct credentials for your database
* Add `.dockerignore`
* Add `push.sh` file for building and pushing the Docker image to Docker Hub. Set this file to executable `chmod +x push.sh`.

Make sure that all the paths are correct for the application for example in webapp.conf etc.

See all the above files in this repo for example content in each. Once all the above files are completed just run `./push.sh` to build and push the Docker image to Docker Hub (log into the `docker` cli tool first).

## Frontend: ReactJS Client

For details on developing with the ReactJS App check the apps [README](todoapp/README.md) file.

* Create the new React JS app via an npm Docker Image  `docker run -it --rm -v "$PWD":/usr/src/app -w /usr/src/app node:slim npm install -g create-react-app && create-react-app todoapp`

This will create our new Rails app (including the package-lock.json). The remaining files are added and configured manually as follows:

* Add `Dockerfile`
* Add `push.sh` file for building and pushing the packaged app to S3 / Cloudfront as a static, serverless frontend application. Set this file to executable `chmod +x push.sh`.

## TODO

* Persiste the development database data via volume mounts
* Have development environment working without needing CORS by using reverse proxy Nginx
* Have the tests run as part of the docker-compose process (in separate containers)
* Setup integration testing for the applications 