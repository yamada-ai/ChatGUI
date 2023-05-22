FROM node:17

USER root

WORKDIR /app

COPY package*.json ./

RUN npm install

WORKDIR /app/ChatGUI-project

COPY package*.json ./

RUN yarn install