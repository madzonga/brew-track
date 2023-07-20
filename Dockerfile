FROM node:16

WORKDIR /usr/app 

COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src

RUN npm ci
# Install ts-node inside the container
RUN npm install -g ts-node

COPY . ./

EXPOSE 8443

RUN chmod +x ./entrypoint.sh

CMD [ "ts-node", "src/index.ts" ]