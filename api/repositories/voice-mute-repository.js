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

  async create (candidateDiscordId, startedDateTime, vote) {
    let votation = {
      candidateDiscordId,
      startedDateTime,
      votes: [ vote ]
    };

    await this.datastoreHelper.insert(votation);

    return votation;
  }

  async vote (votationEntity, vote) {
    let votation = { ...votationEntity, votes: [ ...votationEntity.votes, vote ] };
    await this.datastoreHelper.update(votation);
    return votation;
  }
}

module.exports = VoiceMuteRepository;
