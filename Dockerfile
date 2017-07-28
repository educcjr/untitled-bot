FROM node:8.2-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install
EXPOSE 3000

RUN npm install pm2 -g
CMD ["pm2-docker", "process.yml"]
