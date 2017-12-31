## Notes on how the apps were initially created

## Backend: Rails API

For details on developing with the Rails API check the apps [README](todoapi/README.md) file.

* Create the Rails API via a Docker Image `docker run -it --rm -v "$PWD":/usr/src/app -w /usr/src/app phusion/passenger-ruby24:0.9.27 gem install --no-rdoc --no-ri rails -v 5.1.4 && rails new --api --database postgresql todoapi`

This will create our new Rails app (including the Gemfile.lock). The remaining files are added and configured manually as follows:

* Add `Dockerfile`
* Add `docker-compose.yml`
* Add `webapp.conf` 
* Add `rails-env.conf`
* Add `setup.sh`
* Add a customer logger in `config/application.rb` which sends logs to STDOUT so that we can use `docker-compose logs -f` (see below for starting the app).
* Update the database.yml file with the correct credentials for your database
* Add `.dockerignore`
* Add `push.sh` file for building and pushing the Docker image to Docker Hub.

Make sure 'setup.sh' and 'push.sh' are both executable!

`chmod +x setup.sh`
`chmod +x push.sh`

Also, make sure that all the paths are correct for the application for example in webapp.conf etc.

See all the above files in this repo for example content in each. Once all the above files are completed just run `./push.sh` to build and push the Docker image to Docker Hub (log into the `docker` cli tool first).

## Frontend: ReactJS Client

For details on developing with the ReactJS App check the apps [README](todoapp/README.md) file.

## TODO

* How to create and dockerize the frontend React JS app
* Persiste the development database data via volume mounts