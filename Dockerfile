FROM node:4.4
MAINTAINER Jeffrey Jen <yihungjen@gmail.com>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY .npmrc package.json /usr/src/app/
RUN npm install --production
COPY . /usr/src/app

CMD [ "npm", "start" ]
EXPOSE 8080
