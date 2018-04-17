const moment = require('moment');

const DATE_TIME_FORMAT = 'YYYYMMDDHHmmss';

class VoteMuteService {
  constructor (voiceMuteRepository, userRepository) {
    this.voiceMuteRepository = voiceMuteRepository;
    this.userRepository = userRepository;
  }

  async vote (candidateDiscordId, voterDiscordId, dateTimeIndex) {
    let result = { created: false, voted: false, votation: {} };

    let initialDateTime = parseInt(
      moment(dateTimeIndex, DATE_TIME_FORMAT)
        .subtract(20, 'minutes')
        .format(DATE_TIME_FORMAT)
    );

    let votationList = await this.voiceMuteRepository.find(initialDateTime, dateTimeIndex);
    let votation = votationList.reverse().find(v => v.candidateDiscordId === candidateDiscordId);
    let vote = { discordId: voterDiscordId, dateTime: dateTimeIndex };

    if (votation != null) {
      let didVoterAlreadyVote = votation.votes.find(vote => vote.discordId === voterDiscordId) != null;

      if (!didVoterAlreadyVote) {
        votation = await this.voiceMuteRepository.vote(votation, vote);
        result.voted = true;
      } else {
        result.voted = false;
      }
    } else {
      votation = await this.voiceMuteRepository.create(candidateDiscordId, dateTimeIndex, vote);
      result.created = true;
      result.voted = true;
    }

    result.votation = votation;
    return result;
  }
}

module.exports = VoteMuteService;
