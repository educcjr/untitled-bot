const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const StorageService = require('./services/storage-service');

const UserRepository = require('./repositories/user-repository');
const AudioGreetingRepository = require('./repositories/audio-greeting-repository');
const VoteMuteRepository = require('./repositories/vote-mute-repository');

const UserService = require('./services/user-service');
const AudioGreetingService = require('./services/audio-greeting-service');
const VoteMuteService = require('./services/vote-mute-service');
const OpenDotaService = require('./services/open-dota-service');

const UserRouter = require('./routers/user-router');
const AudioGreetingRouter = require('./routers/audio-greeting-router');
const VoteMuteRouter = require('./routers/vote-mute-router');
const OpenDotaRouter = require('./routers/open-dota-router');

const appConfigs = require('./../app-configs');

let connection = mongoose.createConnection(appConfigs.MLAB_CONN_STR);
let storageService = new StorageService();

let userRepository = new UserRepository(connection);
let audioGreetingRepository = new AudioGreetingRepository(connection);
let voteMuteRepository = new VoteMuteRepository(connection);

let userService = new UserService(userRepository);
let audioGreetingService = new AudioGreetingService(audioGreetingRepository, storageService);
let voteMuteService = new VoteMuteService(voteMuteRepository);
let openDotaService = new OpenDotaService();

let userRouter = new UserRouter(userService);
let audioGreetingRouter = new AudioGreetingRouter(audioGreetingService);
let voteMuteRouter = new VoteMuteRouter(voteMuteService);
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

app.listen(appConfigs.API_PORT, () => {
  console.log('Api running on: ' + appConfigs.API_PORT);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
});

module.exports = app;
