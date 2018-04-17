class DatastoreHelper {
  constructor (kind, datastore) {
    this.kind = kind;
    this.datastore = datastore;
  }

  async insert (data) {
    let allocationResult = await this.datastore.allocateIds(this.datastore.key(this.kind), 1);

    let keyList = allocationResult[0];
    let key = keyList[0];
    await this.datastore.insert({ key, data });

    return key;
  }

  async update (entity) {
    let key = entity[this.datastore.KEY];
    await this.datastore.update({ key, data: entity });
    return key;
  }

  query () {
    return this.datastore.createQuery(this.kind);
  }

  async runQuery (query) {
    let queryResult = await this.datastore.runQuery(query);
    return queryResult[0];
  }
}

DatastoreHelper.kinds = {
  USER: 'User',
  AUDIO_GREETING: 'AudioGreeting',
  VOICE_MUTE: 'VoiceMute'
};

module.exports = DatastoreHelper;
