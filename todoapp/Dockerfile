FROM node:slim

ENV APP_HOME /app
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

ENV NODE_ENV=development \
  PATH=$APP_HOME/node_modules/.bin:$PATH

COPY public $APP_HOME/public/
COPY src $APP_HOME/src/
COPY *.json $APP_HOME/

RUN npm install

EXPOSE 3000

ENTRYPOINT npm run start