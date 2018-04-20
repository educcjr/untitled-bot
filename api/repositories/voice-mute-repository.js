const DatastoreHelper = require('./datastore-helper');

class VoiceMuteRepository {
  constructor (datastore) {
    this.datastoreHelper = new DatastoreHelper(DatastoreHelper.kinds.VOICE_MUTE, datastore);
  }

  find (initialDateTime, finalDateTime) {
    let query = this.datastoreHelper
      .query()
      .filter('startedDateTime', '>=', initialDateTime)
      .filter('startedDateTime', '<=', finalDateTime);

    return this.datastoreHelper.runQuery(query);
  }

  create (candidateDiscordId, channelDiscordId, startedDateTime, vote) {
    return this.datastoreHelper.insert({
      candidateDiscordId,
      channelDiscordId,
      startedDateTime,
      votes: [ vote ]
    });
  }

  vote (votationEntity, vote) {
    return this.datastoreHelper.update({
      ...votationEntity,
      votes: [ ...votationEntity.votes, vote ]
    });
  }
}

module.exports = VoiceMuteRepository;
