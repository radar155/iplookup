FROM node:18-alpine3.14

WORKDIR /home/node/app

COPY package*.json ./

RUN npm i

COPY ./src ./src
COPY ./tsconfig.json ./

RUN npm run build