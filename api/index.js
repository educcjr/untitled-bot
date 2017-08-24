const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const Datastore = require('@google-cloud/datastore');
const datastore = process.env.NODE_ENV === 'production'
  ? Datastore()
  : Datastore({
    projectId: 'untitled-bot-174418',
    credentials: require('./keyfile.json')
  });

const RequestService = require('./../common/request-service.js');
const requestService = new RequestService();

const openDotaRouter = require('./routers/open-dota-router.js');
const userRouter = require('./routers/user-router.js');

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.requestService = requestService;
  req.datastore = datastore;
  next();
});

app.use('/user', userRouter);
app.use('/odota', openDotaRouter);

const port = 5000;
app.listen(port, () => {
  console.log('Api running on: ' + port);
});
