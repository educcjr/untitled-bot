const express = require('express');

class VoteMuteRouter {
  constructor (voteMuteService) {
    this.voteMuteService = voteMuteService;
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

    router.post('/close', async (req, res) => {
      try {
        let { candidateDiscordId, channelDiscordId, dateTimeIndex } = req.body;

        let voteResult = await this.voteMuteService.closeVotation(
          candidateDiscordId,
          channelDiscordId,
          dateTimeIndex
        );

        return res.send(voteResult);
      } catch (err) {
        return res.sendError(err);
      }
    });

    router.post('/complete', async (req, res) => {
      try {
        let { candidateDiscordId, channelDiscordId, dateTimeIndex } = req.body;

        let voteResult = await this.voteMuteService.completeMute(
          candidateDiscordId,
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
