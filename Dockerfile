FROM node:4.5-slim-pm2-onbuild
MAINTAINER Jeffrey Jen <yihungjen@gmail.com>

ENTRYPOINT [ "npm", "run" ]
CMD [ "cluster" ]
EXPOSE 8080
