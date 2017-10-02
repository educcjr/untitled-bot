const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const appConfigs = require('./../app-configs.js');

const Datastore = require('@google-cloud/datastore');
const Storage = require('@google-cloud/storage');

const gcpAuth = {
  projectId: appConfigs.GCP_PROJECTID,
  credentials: require('./../keyfile.json')
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
  req.bucket = storage.bucket(appConfigs.GCP_BUCKET);
  req.bucketUrl = appConfigs.GCP_BUCKET_URL;
  next();
});

app.use('/user', userRouter);
app.use('/odota', openDotaRouter);
app.use('/greetings', greetingsRouter);

const port = process.env.NODE_ENV === 'test'
  ? appConfigs.API_TEST_PORT
  : appConfigs.API_PORT;

app.listen(port, () => {
  console.log('Api running on: ' + port);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
});

module.exports = app;
