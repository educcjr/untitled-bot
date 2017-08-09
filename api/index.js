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

app.use(bodyParser.json());

app.post('/user', (req, res) => {
  let entity = {
    key: datastore.key('User'),
    data: {
      discordId: req.body.id,
      name: req.body.name
    }
  };

  let query = datastore.createQuery('User').filter('discordId', entity.data.discordId);
  datastore.runQuery(query, (err, entities) => {
    if (err) sendRes(err, null, res);
    if (entities.length > 0) {
      entity.key = entities[0][datastore.KEY];
    }

    datastore.save(entity, (err) => {
      sendRes(err, entity, res);
    });
  });
});

app.get('/user', (req, res) => {
  let query = datastore.createQuery('User');

  datastore.runQuery(query, (err, entities) => {
    sendRes(err, entities, res);
  });
});

const sendRes = (err, response, res) => {
  if (!err) {
    res.send(response);
  } else {
    res.status(500).send(err);
  }
};

const port = 5000;
app.listen(port, () => {
  console.log('Api running on: ' + port);
});
