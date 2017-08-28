const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const gcpAuth = {
  projectId: 'untitled-bot-174418',
  credentials: require('./keyfile.json')
};
const Datastore = require('@google-cloud/datastore');
const datastore = process.env.NODE_ENV === 'production'
  ? Datastore() : Datastore(gcpAuth);
const Storage = require('@google-cloud/storage');
const storage = process.env.NODE_ENV === 'production'
  ? Storage() : Storage(gcpAuth);

const RequestService = require('./../common/request-service.js');
const requestService = new RequestService();

const openDotaRouter = require('./routers/open-dota-router.js');
const userRouter = require('./routers/user-router.js');
const greetingsRouter = require('./routers/greetings-router.js');

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.requestService = requestService;
  req.datastore = datastore;
  req.storage = storage;
  next();
});

app.use('/user', userRouter);
app.use('/odota', openDotaRouter);
app.use('/greetings', greetingsRouter);

const port = 5000;
app.listen(port, () => {
  console.log('Api running on: ' + port);
});
