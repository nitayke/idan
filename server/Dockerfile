FROM node:latest

WORKDIR /idan-app
COPY package.json .
RUN npm install
COPY . .
CMD npm start