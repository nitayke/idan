FROM node:latest
WORKDIR /server
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3040
CMD ["node", "index.js"]