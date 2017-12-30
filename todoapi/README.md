# README

### Starting the app

Prerequisites are that you have Git client installed and have cloned this repo. You also need Docker for Mac installed.

1. Run `docker-compose up`
1. Visit the application at `http://localhost`

Note that you can use the `-d` switch with `docker-compose up` to detatch the running app from the terminal. This can be followed by a log output command so to run the app you can open a terminal and run the following:

`docker-compose up -d && docker-compose logs -f`

## Development

### Add a new Rails resource

Run the `rails` command line via `docker-compose` to execute the commands within the Docker image. Do this by prefixing each command with `docker-compose run --rm todoapi`

For example run `docker-compose run --rm todoapi bin/rails g scaffold articles title:string body:text` (change the model name and fields as per what is needed)

### Connect a terminal session to the container

Run `docker exec -it todoapi bash` which will connect you a permanent terminal session to the container. Then it's possible to run `rails`, `rake` (etc) commands without the prefix (since you are 'inside' the container now).

### Test the API using cURL

Run the following to add a new article to the database via the REST API:

`curl -H "Content-Type: application/json" -X POST -d '{"title":"my brand new article","body":"This was made during a demo!"}' http://localhost/articles`