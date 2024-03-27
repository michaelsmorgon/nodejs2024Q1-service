FROM node:alpine3.19 as builder

WORKDIR /app

COPY package*.json .

COPY prisma ./prisma/

RUN npm cache clean --force

RUN npm ci

FROM node:alpine3.19

WORKDIR /app

EXPOSE ${PORT}

CMD npx prisma generate && npx prisma migrate deploy && npm run start:dev
