#!/bin/bash

npm install pm2 -g
pm2 stop all

rm -r -f ~/untitled-bot
git clone git@github.com:educcjr/untitled-bot.git
cp  ~/scripts/app-configs.js ~/untitled-bot/bot/

cd ~/untitled-bot
NODE_ENV=production
npm install
npm start
