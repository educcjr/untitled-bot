const express = require('express');
const router = express.Router();

const VoteMuteService = require('./../services/vote-mute-service');

class VoteMuteRouter {
  constructor (voiceMuteRepository, userRepository) {
    this.service = new VoteMuteService(voiceMuteRepository, userRepository);
  }

  router () {
    router.post('/', async (req, res) => {
      try {
        let { candidateDiscordId, voterDiscordId, dateTimeIndex } = req.body;

        let result = await this.service.vote(candidateDiscordId, voterDiscordId, dateTimeIndex);

        return res.send(result);
      } catch (err) {
        return res.sendError(err);
      }
    });

    return router;
  }
}

module.exports = VoteMuteRouter;
