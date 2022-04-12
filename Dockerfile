ARG NODE_VERSION=16.14.2-alpine

FROM node:16.14.2-alpine3.15 as dev
WORKDIR /opt/tictactoe

COPY package.json package-lock.json ./
RUN [ "npm", "ci" ]
COPY ./ ./
CMD ["npm", "start"]
