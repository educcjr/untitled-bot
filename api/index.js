const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const Datastore = require('@google-cloud/datastore');
const Storage = require('@google-cloud/storage');

const gcpAuth = process.env.NODE_ENV === 'production' ? {} : {
  projectId: 'untitled-bot-174418',
  credentials: require('./keyfile.json')
};
const datastore = Datastore(gcpAuth);
const storage = Storage(gcpAuth);

const RequestService = require('./../common/request-service.js');
const requestService = new RequestService();

const openDotaRouter = require('./routers/open-dota-router.js');
const userRouter = require('./routers/user-router.js');
const greetingsRouter = require('./routers/greetings-router.js');

app.use(cors());
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
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
});

module.exports = app;
