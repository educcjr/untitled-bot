var express = require('express');
var router = express.Router();

router.post('/', (req, res) => {
  if (!req.body.id || !req.body.name) {
    return sendResult('User name or discord id missing.', res);
  }

  let entity = {
    key: req.datastore.key('User'),
    data: {
      discordId: req.body.id,
      name: req.body.name
    }
  };

  let query = req.datastore.createQuery('User').filter('discordId', entity.data.discordId);
  req.datastore.runQuery(query, (err, entities) => {
    if (err) return sendResult(err, res);
    if (entities.length > 0) {
      entity.key = entities[0][req.datastore.KEY];
    }

    req.datastore.save(entity, (err) => {
      sendResult(err, res, entity);
    });
  });
});

router.get('/', (req, res) => {
  let query = req.datastore.createQuery('User');

  req.datastore.runQuery(query, (err, entities) => {
    sendResult(err, res, entities);
  });
});

const sendResult = (err, response, result) => {
  if (err) {
    response.status(500).send(err);
  } else {
    response.send(result);
  }
};

module.exports = router;
