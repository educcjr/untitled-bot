const _ = require('lodash');
const path = require('path');
const express = require('express');
const router = express.Router();

const uploadDest = './../uploads/';
const multer = require('multer');
const uploadParser = multer({
  storage: multer.diskStorage({
    destination: uploadDest,
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  })
});

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
    .then((results) => { res.send(results[0]); });
});

router.post('/audio', uploadParser.single('file'), (req, res, next) => {
  if (path.extname(req.file.filename) !== '.mp3') {
    return res.status(500).send({ message: 'Tipo de arquivo incorreto. Você está enviando um áudio?' });
  }

  let uploadOptions = { destination: 'greetings/' + req.file.filename, public: true };
  req.storage
    .bucket('untitled-bot-174418.appspot.com')
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

      res.send({ filename: req.file.filename });
    });
});

module.exports = router;
