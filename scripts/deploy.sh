#!/bin/bash

npm install pm2 -g
pm2 stop all

rm -r -f ~/untitled-bot
git clone git@github.com:educcjr/untitled-bot.git
cp  ~/scripts/app-configs.js ~/untitled-bot/
cp  ~/scripts/keyfile.json ~/untitled-bot/

cd ~/untitled-bot

npm install
npm test
npm start
