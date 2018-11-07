const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  discordId: String,
  dateTimeIndex: Number
});

const voteMuteSchema = new mongoose.Schema({
  startedDateTimeIndex: { type: Number, index: true },
  channelDiscordId: String,
  candidateDiscordId: String,
  closed: Boolean,
  muteCompleted: Boolean,
  votes: [voteSchema]
});

class VoteMuteRepository {
  constructor (connection) {
    this.model = connection.model('VoteMute', voteMuteSchema);
  }

  find (initialDateTimeIndex, finalDateTimeIndex, channelDiscordId, candidateDiscordId) {
    return this.model.findOne({
      startedDateTimeIndex: { $gte: initialDateTimeIndex, $lte: finalDateTimeIndex },
      channelDiscordId,
      candidateDiscordId,
      closed: false
    });
  }

  create (candidateDiscordId, channelDiscordId, startedDateTimeIndex, vote) {
    return this.model.create({
      candidateDiscordId,
      channelDiscordId,
      startedDateTimeIndex,
      votes: [ vote ],
      closed: false,
      muteCompleted: false
    });
  }

  vote (votation, vote) {
    return this.model.findByIdAndUpdate(
      votation._id,
      { votes: [ ...votation.votes, vote ] },
      { new: true }
    );
  }

  closeVotation (candidateDiscordId, channelDiscordId, startedDateTimeIndex) {
    return this.model.findOneAndUpdate(
      { candidateDiscordId, channelDiscordId, startedDateTimeIndex },
      { closed: true },
      { new: true }
    );
  }

  completeMute (candidateDiscordId, channelDiscordId, startedDateTimeIndex) {
    return this.model.findOneAndUpdate(
      { candidateDiscordId, channelDiscordId, startedDateTimeIndex },
      { muteCompleted: true },
      { new: true }
    );
  }
}

module.exports = VoteMuteRepository;
