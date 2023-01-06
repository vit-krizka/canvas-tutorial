FROM node:19-alpine3.16
WORKDIR /usr/app
COPY package.json .
RUN npm install --quiet
