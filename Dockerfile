FROM node:4.4
MAINTAINER Jeffrey Jen <yihungjen@gmail.com>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG registry_url=https://registry.npmjs.org/
RUN npm set registry $registry_url

COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

CMD [ "npm", "start" ]
EXPOSE 8080
