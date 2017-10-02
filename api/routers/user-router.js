const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  if (!req.body.id || !req.body.name) {
    return res
      .status(500)
      .send({ errorMessage: 'Nome do usuário ou discordId não foi enviado.' });
  }

  let entity = {
    key: req.datastore.key(req.datastoreKinds.USER),
    data: {
      discordId: req.body.id,
      name: req.body.name
    }
  };

  let query = req.datastore
    .createQuery(req.datastoreKinds.USER)
    .filter('discordId', entity.data.discordId);

  req.datastore.runQuery(query, (err, entities) => {
    if (err) return res.status(500).send(datastoreErr(err));
    if (entities.length > 1) {
      return res
        .status(500)
        .send({
          errorMessage: 'Existem usuários duplicados no banco de dados.'
        });
    }

    let isNew = true;
    if (entities.length === 1) {
      entity.key = entities[0][req.datastore.KEY];
      isNew = false;
    }

    req.datastore.save(entity, (err) => {
      if (err) return res.status(500).send(datastoreErr(err));
      res.send({ user: entity, isNew });
    });
  });
});

router.get('/', (req, res) => {
  let query = req.datastore.createQuery(req.datastoreKinds.USER);
  req.datastore.runQuery(query, (err, entities) => {
    if (err) return res.status(500).send(datastoreErr(err));
    res.send(entities);
  });
});

router.delete('/:id', (req, res) => {
  req.datastore.delete(req.datastore.key([req.datastoreKinds.USER, req.datastore.int(req.params.id)]), (err, apiResponse) => {
    if (err) return req.status(500).send(datastoreErr(err));
    res.send({ key: req.params.id });
  });
});

const datastoreErr = (err) => {
  return {
    errorMessage: 'Houve algum problema com o Datastore.',
    errorDetails: err
  };
};

module.exports = router;
