
FROM node:16-alpine as base

WORKDIR /usr/app

COPY package*.json . /

RUN npm install

EXPOSE 3000
