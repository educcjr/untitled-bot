const moment = require('moment');

const DATE_TIME_FORMAT = 'YYYYMMDDHHmmss';

class VoteMuteService {
  constructor (voiceMuteRepository) {
    this.voiceMuteRepository = voiceMuteRepository;
  }

  async vote (candidateDiscordId, voterDiscordId, channelDiscordId, dateTimeIndex) {
    let result = { created: false, voted: false, onGoing: false, votation: {} };

    let initialDateTime = parseInt(
      moment(dateTimeIndex, DATE_TIME_FORMAT)
        .subtract(20, 'minutes')
        .format(DATE_TIME_FORMAT)
    );

    let votation = await this.voiceMuteRepository.find(initialDateTime, dateTimeIndex, channelDiscordId, candidateDiscordId);

    if (votation != null && votation.closed) {
      result.onGoing = true;
      result.votation = votation;
      return result;
    }

    let vote = { discordId: voterDiscordId, dateTime: dateTimeIndex };

    if (votation != null) {
      if (votation.votes.find(vote => vote.discordId === voterDiscordId) == null) {
        votation = await this.voiceMuteRepository.vote(votation, vote);
        result.voted = true;
      } else {
        result.voted = false;
      }
    } else {
      votation = await this.voiceMuteRepository.create(
        candidateDiscordId,
        channelDiscordId,
        dateTimeIndex,
        vote
      );
      result.created = true;
      result.voted = true;
    }

    result.votation = votation;
    return result;
  }

  async closeVotation (candidateDiscordId, channelDiscordId, dateTimeIndex) {
    return this.voiceMuteRepository.closeVotation(candidateDiscordId, channelDiscordId, dateTimeIndex);
  }

  async completeMute (candidateDiscordId, channelDiscordId, dateTimeIndex) {
    return this.voiceMuteRepository.completeMute(candidateDiscordId, channelDiscordId, dateTimeIndex);
  }
}

module.exports = VoteMuteService;
