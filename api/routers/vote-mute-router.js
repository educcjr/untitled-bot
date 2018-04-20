const express = require('express');

const VoteMuteService = require('./../services/vote-mute-service');

class VoteMuteRouter {
  constructor (voiceMuteRepository, userRepository) {
    this.voteMuteService = new VoteMuteService(voiceMuteRepository, userRepository);
  }

  router () {
    const router = express.Router();

    router.post('/', async (req, res) => {
      try {
        let { candidateDiscordId, voterDiscordId, channelDiscordId, dateTimeIndex } = req.body;

        let voteResult = await this.voteMuteService.vote(
          candidateDiscordId,
          voterDiscordId,
          channelDiscordId,
          dateTimeIndex
        );

        return res.send(voteResult);
      } catch (err) {
        return res.sendError(err);
      }
    });

    return router;
  }
}

module.exports = VoteMuteRouter;
