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

const AUDIO_GREETING = 'AudioGreeting';
const GREETINGS_PATH = 'greetings/';

router.get('/audio', (req, res, next) => {
  const query = req.datastore.createQuery(AUDIO_GREETING);

  req.datastore
    .runQuery(query)
    .then((results) => { res.send(results[0]); });
});

router.get('/audio/:userId', (req, res, next) => {
  if (!_.isInteger(Number.parseInt(req.params.userId))) {
    return res.status(400).send({ message: 'usuário inválido' });
  }

  const query = req.datastore
    .createQuery(AUDIO_GREETING)
    .filter('discordId', req.params.userId);

  req.datastore
    .runQuery(query)
    .then(([result, ...rest]) => {
      if (result.length > 0) {
        res.send(result.map(audioGreeting => ({
          path: `${req.bucketUrl}${GREETINGS_PATH}${audioGreeting.name}`,
          name: audioGreeting.name
        })));
      } else {
        let name = 'greetings.mp3';
        res.send([{ path: `${req.bucketUrl}${name}`, name }]);
      }
    });
});

router.post('/audio', uploadParser.single('file'), (req, res, next) => {
  if (path.extname(req.file.filename) !== '.mp3') {
    return res.status(500).send({ message: 'Tipo de arquivo incorreto. Você está enviando um áudio?' });
  }

  let uploadOptions = { destination: `${GREETINGS_PATH}${req.file.filename}`, public: true };
  req.bucket
    .upload(req.file.path, uploadOptions, (err, file) => {
      if (err) return res.status(500).send(err);

      req.datastore.save({
        key: req.datastore.key(AUDIO_GREETING),
        data: {
          discordId: req.body.id,
          name: req.file.filename
        }
      }, (err) => {
        if (err) return res.status(500).send(err);
      });

      res.send({
        path: `${req.bucketUrl}${GREETINGS_PATH}${req.file.filename}`,
        name: req.file.filename
      });
    });
});

router.delete('/audio', (req, res, next) => {
  let query = req.datastore
    .createQuery(AUDIO_GREETING)
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
