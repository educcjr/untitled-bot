const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const StorageService = require('./services/storage-service');

const UserRepository = require('./repositories/user-repository');
const AudioGreetingRepository = require('./repositories/audio-greeting-repository');
const VoiceMuteRepository = require('./repositories/voice-mute-repository');

const AudioGreetingService = require('./services/audio-greeting-service');

const openDotaRouter = require('./routers/open-dota-router');
const UserRouter = require('./routers/user-router');
const AudioGreetingRouter = require('./routers/audio-greeting-router');
const VoteMuteRouter = require('./routers/vote-mute-router');

const appConfigs = require('./../app-configs');

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.sendError = (err, status = 500) => {
    res.status(status).send({ message: err.message, stack: err.stack });
  };
  next();
});

let datastore = null;
let connection = mongoose.createConnection(appConfigs.MLAB_CONN_STR);
let storageService = new StorageService();

let userRepository = new UserRepository(datastore);
let audioGreetingRepository = new AudioGreetingRepository(connection);
let voiceMuteRepository = new VoiceMuteRepository(datastore);

let audioGreetingService = new AudioGreetingService(audioGreetingRepository, storageService);

let userRouter = new UserRouter(userRepository);
let audioGreetingRouter = new AudioGreetingRouter(audioGreetingService);
let voteMuteRouter = new VoteMuteRouter(voiceMuteRepository);

app.use('/user', userRouter.router());
app.use('/odota', openDotaRouter);
app.use('/greetings', audioGreetingRouter.router());
app.use('/mute', voteMuteRouter.router());

const port = process.env.NODE_ENV === 'test'
  ? appConfigs.API_TEST_PORT
  : appConfigs.API_PORT;
app.listen(port, () => {
  console.log('Api running on: ' + port);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
});

module.exports = app;
