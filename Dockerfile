FROM node:lts-slim

WORKDIR /app

COPY src /app/src/
COPY package.json /app/
COPY package-lock.json /app/
COPY tsconfig.json /app/
# COPY nodemon.json /app/

RUN npm install
RUN npm i -g ts-node
# RUN npm run build
RUN npm i -g knex
# RUN npx knex migrate:latest --knexfile ./src/config/knexfile.ts

EXPOSE 3000

CMD npx ts-node src/index.ts
