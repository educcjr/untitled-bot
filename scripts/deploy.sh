#!/bin/bash

npm install pm2 -g
pm2 stop all

rm -r -f ~/untitled-bot
git clone git@github.com:educcjr/untitled-bot.git
cp  ~/scripts/app-configs.js ~/untitled-bot/bot/
cp  ~/scripts/keyfile.json ~/untitled-bot/bot/
cp  ~/scripts/keyfile.json ~/untitled-bot/api/

cd ~/untitled-bot
npm install

NODE_ENV=test
npm test

NODE_ENV=production
npm start
