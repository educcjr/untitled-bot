const DatastoreHelper = require('./datastore-helper');

class VoiceMuteRepository {
  constructor (datastore) {
    this.datastoreHelper = new DatastoreHelper(DatastoreHelper.VOICE_MUTE, datastore);
  }

  find (requestedDateTime) {
    let query = this.datastoreHelper
      .query()
      .filter('startedDateTime', '>=', requestedDateTime);

    return this.datastoreHelper.runQuery(query);
  }

  create (candidateDiscordId, startedDateTime, vote) {
    return this.datastoreHelper.insert({
      candidateDiscordId,
      startedDateTime,
      votes: [ vote ]
    });
  }

  vote (voiceMuteEntity, vote) {
    voiceMuteEntity.votes.push(vote);
    return this.datastoreHelper.update(voiceMuteEntity);
  }
}

module.exports = VoiceMuteRepository;
