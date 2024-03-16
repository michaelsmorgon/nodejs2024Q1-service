FROM node:alpine3.19
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . /app/
EXPOSE ${PORT}
VOLUME ["/app"]
CMD ["npm", "run", "start:dev"]
