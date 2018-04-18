const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const appConfigs = require('./../app-configs');

const Datastore = require('@google-cloud/datastore');
const Storage = require('@google-cloud/storage');

const gcpAuth = {
  projectId: appConfigs.GCP_PROJECTID,
  credentials: require('./../keyfile.json')
};
const datastore = Datastore(gcpAuth);
const storage = Storage(gcpAuth);

const UserRepository = require('./repositories/user-repository');
const VoiceMuteRepository = require('./repositories/voice-mute-repository');

const userRepository = new UserRepository(datastore);
const voiceMuteRepository = new VoiceMuteRepository(datastore);

const openDotaRouter = require('./routers/open-dota-router');
const UserRouter = require('./routers/user-router');
const greetingsRouter = require('./routers/greetings-router');
const VoteMuteRouter = require('./routers/vote-mute-router');

const userRouter = new UserRouter(userRepository);
const voteMuteRouter = new VoteMuteRouter(voiceMuteRepository);

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.datastore = datastore;
  req.storage = storage;
  req.bucket = storage.bucket(appConfigs.GCP_BUCKET);
  req.bucketUrl = appConfigs.GCP_BUCKET_URL;
  res.sendError = (err, status = 500) => {
    res.status(status).send({ message: err.message, stack: err.stack });
  };
  next();
});

app.use('/user', userRouter.router());
app.use('/odota', openDotaRouter);
app.use('/greetings', greetingsRouter);
app.use('/mute', voteMuteRouter.router());

const port = process.env.NODE_ENV === 'test'
  ? appConfigs.API_TEST_PORT
  : appConfigs.API_PORT;
app.listen(port, () => {
  console.log('Api running on: ' + port);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
});

module.exports = app;
