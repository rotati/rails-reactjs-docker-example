FROM node:slim

ENV APP_HOME /app
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

ENV NODE_ENV=development \
  PATH=$APP_HOME/node_modules/.bin:$PATH

RUN npm install

ADD . $APP_HOME