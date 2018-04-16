const express = require('express');
const router = express.Router();

class VoteMuteRouter {
  constructor (voiceMuteRepository, userRepository) {
    this.voiceMuteRepository = voiceMuteRepository;
    this.userRepository = userRepository;
  }

  router () {
    router.post('/', async (req, res) => {
      let { candidateDiscordId, voterDiscordId, dateTimeIndex } = req.body;

      let findResult = await this.voiceMuteRepository.find(dateTimeIndex);

      if (findResult.success) {
        let votation = findResult.value.find(v => v.candidateDiscordId === candidateDiscordId);
        let vote = { discordId: voterDiscordId, dateTime: dateTimeIndex };

        if (votation != null) {
          if (votation.votes.find(vote => vote.discordId === voterDiscordId) == null) {
            let voteResult = await this.voiceMuteRepository.vote(votation, vote);

            if (voteResult.success) {
              return res.send({ message: 'Seu voto foi contabilizado!' });
            }
          } else {
            return res.send({ message: 'Você já votou!' });
          }
        } else {
          let creationResult =
            await this.voiceMuteRepository.create(candidateDiscordId, dateTimeIndex, vote);

          if (creationResult.success) {
            return res.send({ message: 'A votação foi iniciada!' });
          }
        }
      }

      return res.send({ message: 'Dang, não consegui fazer o que você pediu :c' });
    });

    return router;
  }
}

module.exports = VoteMuteRouter;
