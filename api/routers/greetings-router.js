const _ = require('lodash');
const path = require('path');
const express = require('express');
const router = express.Router();

const multer = require('multer');
const uploadParser = multer({
  storage: multer.diskStorage({
    destination: './../uploads/',
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  })
});

const greetingsPath = 'greetings/';

router.get('/audio', (req, res, next) => {
  const query = req.datastore.createQuery('AudioGreeting');

  req.datastore
    .runQuery(query)
    .then((results) => { res.send(results[0]); });
});

router.get('/audio/:userId', (req, res, next) => {
  if (!_.isInteger(Number.parseInt(req.params.userId))) {
    return res.status(400).send({ message: 'usuário inválido' });
  }

  const query = req.datastore
    .createQuery('AudioGreeting')
    .filter('discordId', req.params.userId);

  req.datastore
    .runQuery(query)
    .then(([result, ...rest]) => {
      res.send(result.map(audioGreeting => ({
        path: `${req.bucketUrl}${greetingsPath}${audioGreeting.name}`,
        name: audioGreeting.name
      })));
    });
});

router.post('/audio', uploadParser.single('file'), (req, res, next) => {
  if (path.extname(req.file.filename) !== '.mp3') {
    return res.status(500).send({ message: 'Tipo de arquivo incorreto. Você está enviando um áudio?' });
  }

  let uploadOptions = { destination: `${greetingsPath}${req.file.filename}`, public: true };
  req.bucket
    .upload(req.file.path, uploadOptions, (err, file) => {
      if (err) return res.status(500).send(err);

      req.datastore.save({
        key: req.datastore.key('AudioGreeting'),
        data: {
          discordId: req.body.id,
          name: req.file.filename
        }
      }, (err) => {
        if (err) return res.status(500).send(err);
      });

      res.send({
        path: `${req.bucketUrl}${greetingsPath}${req.file.filename}`,
        name: req.file.filename
      });
    });
});

router.delete('/audio', (req, res, next) => {
  let query = req.datastore
    .createQuery('AudioGreeting')
    .filter('name', req.body.fileName);

  req.datastore
    .runQuery(query, (err, results) => {
      if (err) return res.status(500).send(err);

      if (results.length === 0) {
        return res.status(500).send({
          name: req.body.fileName,
          deleted: false,
          message: `O arquivo ${req.body.fileName} não existe.`
        });
      }

      let key = results[0][req.datastore.KEY];
      req.datastore.delete(key, (err) => {
        if (err) return req.status(500).send(err);
        res.send({name: req.body.fileName, deleted: true});
      });
    });
});

module.exports = router;
