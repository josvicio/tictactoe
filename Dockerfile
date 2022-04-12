ARG NODE_VERSION=16.14.2-alpine3.15

FROM node:$NODE_VERSION as dev
RUN ["apk", "add", "--no-cache", "chromium"]
WORKDIR /opt/tictactoe

COPY package.json package-lock.json ./
RUN [ "npm", "ci" ]
COPY ./ ./
CMD ["npm", "start"]

FROM dev as build

RUN ["npm", "run", "build"]
