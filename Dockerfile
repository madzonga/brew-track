FROM node:16

RUN apk update && apk upgrade
RUN apk add --no-cache bash

WORKDIR /usr/app 

COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src

RUN npm ci
RUN npm run build

COPY . ./

EXPOSE 8443

RUN chmod +x ./entrypoint.sh

CMD [ "node", "dist/src/index.js" ]