const DatastoreHelper = require('./datastore-helper');

class VoiceMuteRepository {
  constructor (datastore) {
    this.datastoreHelper = new DatastoreHelper(DatastoreHelper.kinds.VOICE_MUTE, datastore);
  }

  async find (initialDateTime, finalDateTime, channelDiscordId, candidateDiscordId) {
    let query = this.datastoreHelper
      .query()
      .filter('startedDateTime', '>=', initialDateTime)
      .filter('startedDateTime', '<=', finalDateTime);

    return (await this.datastoreHelper.runQuery(query))
      .reverse()
      .filter(votation => votation.channelDiscordId === channelDiscordId)
      .filter(votation => !(votation.closed && votation.muteCompleted))
      .find(votation => votation.candidateDiscordId === candidateDiscordId);
  }

  create (candidateDiscordId, channelDiscordId, startedDateTime, vote) {
    return this.datastoreHelper.insert({
      candidateDiscordId,
      channelDiscordId,
      startedDateTime,
      votes: [ vote ],
      closed: false,
      muteCompleted: false
    });
  }

  vote (votationEntity, vote) {
    return this.datastoreHelper.update({
      ...votationEntity,
      votes: [ ...votationEntity.votes, vote ]
    });
  }

  async closeVotation (candidateDiscordId, channelDiscordId, dateTimeIndex) {
    let votation = await this.findSpecific(dateTimeIndex, candidateDiscordId, channelDiscordId);

    return this.datastoreHelper.update({
      ...votation,
      closed: true
    });
  }

  async completeMute (candidateDiscordId, channelDiscordId, dateTimeIndex) {
    let votation = await this.findSpecific(dateTimeIndex, candidateDiscordId, channelDiscordId);

    return this.datastoreHelper.update({
      ...votation,
      muteCompleted: true
    });
  }

  async findSpecific (dateTimeIndex, candidateDiscordId, channelDiscordId) {
    let query = this.datastoreHelper
      .query()
      .filter('startedDateTime', dateTimeIndex)
      .filter('candidateDiscordId', candidateDiscordId)
      .filter('channelDiscordId', channelDiscordId);

    return (await this.datastoreHelper.runQuery(query))[0];
  }
}

module.exports = VoiceMuteRepository;
