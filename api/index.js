const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const datastore = require('@google-cloud/datastore')();

app.use(bodyParser.json());

app.get('/api', (req, res) => {
  res.send('Hooray!');
});

app.post('/user', (req, res) => {
  let entity = {
    key: datastore.key('User', req.body.id),
    data: {
      name: req.body.name
    }
  };
  datastore.save(entity, (err) => defaultCallback(err, res));
});

const defaultCallback = (err, res) => {
  if (!err) {
    res.sendStatus(200);
  } else {
    console.log(err);
    res.status(500).send(err);
  }
};

const port = 5000;
app.listen(port, () => {
  console.log('Api running on: ' + port);
});
