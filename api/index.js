const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const StorageService = require('./services/storage-service');

const UserRepository = require('./repositories/user-repository');
const AudioGreetingRepository = require('./repositories/audio-greeting-repository');
const VoiceMuteRepository = require('./repositories/voice-mute-repository');

const UserService = require('./services/user-service');
const AudioGreetingService = require('./services/audio-greeting-service');
const OpenDotaService = require('./services/open-dota-service');

const UserRouter = require('./routers/user-router');
const AudioGreetingRouter = require('./routers/audio-greeting-router');
const VoteMuteRouter = require('./routers/vote-mute-router');
const OpenDotaRouter = require('./routers/open-dota-router');

const appConfigs = require('./../app-configs');

let datastore = null;
let connection = mongoose.createConnection(appConfigs.MLAB_CONN_STR);
let storageService = new StorageService();

let userRepository = new UserRepository(connection);
let audioGreetingRepository = new AudioGreetingRepository(connection);
let voiceMuteRepository = new VoiceMuteRepository(datastore);

let userService = new UserService(userRepository);
let audioGreetingService = new AudioGreetingService(audioGreetingRepository, storageService);
let openDotaService = new OpenDotaService();

let userRouter = new UserRouter(userService);
let audioGreetingRouter = new AudioGreetingRouter(audioGreetingService);
let voteMuteRouter = new VoteMuteRouter(voiceMuteRepository);
let openDotaRouter = new OpenDotaRouter(openDotaService);

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.sendError = (err, status = 500) => {
    res.status(status).send({ message: err.message, stack: err.stack });
  };
  next();
});

app.use('/user', userRouter.router());
app.use('/audio-greeting', audioGreetingRouter.router());
app.use('/mute', voteMuteRouter.router());
app.use('/odota', openDotaRouter.router());

const port = process.env.NODE_ENV === 'test'
  ? appConfigs.API_TEST_PORT
  : appConfigs.API_PORT;

app.listen(port, () => {
  console.log('Api running on: ' + port);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
});

module.exports = app;
