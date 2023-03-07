FROM node:18.14-alpine3.16

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY ./ ./

CMD npm run start