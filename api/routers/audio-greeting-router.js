const path = require('path');
const express = require('express');

const multer = require('multer');
const uploadParser = multer({
  storage: multer.diskStorage({
    destination: './../uploads/',
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  })
});

class AudioGreetingRouter {
  constructor (audioGreetingService) {
    this.audioGreetingService = audioGreetingService;
  }

  router () {
    const router = express.Router();

    router.get('/', async (req, res) => {
      try {
        res.send(await this.audioGreetingService.getAll());
      } catch (err) {
        res.sendError(err);
      }
    });

    router.get('/:discordId', async (req, res) => {
      try {
        res.send(await this.audioGreetingService.get(req.params.discordId));
      } catch (err) {
        res.sendError(err);
      }
    });

    router.post('/', uploadParser.single('file'), async (req, res) => {
      try {
        res.send(await this.audioGreetingService.create(req.body.id, req.file));
      } catch (err) {
        res.sendError(err);
      }
    });

    router.delete('/:discordId', async (req, res) => {
      try {
        res.send(await this.audioGreetingService.delete(req.params.discordId));
      } catch (err) {
        res.sendError(err);
      }
    });

    return router;
  }
}

module.exports = AudioGreetingRouter;
