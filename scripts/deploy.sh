#!/bin/bash

# TODO: remove ~/untitled-bot and clone again
cd ~/untitled-bot
git pull
npm install
NODE_ENV=production
npm start
