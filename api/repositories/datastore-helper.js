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

    data[this.datastore.KEY] = key;
    return data;
  }

  async update (entity) {
    await this.datastore.update({
      key: entity[this.datastore.KEY],
      data: entity
    });

    return entity;
  }

  async delete (entity) {
    let key = entity[this.datastore.KEY];
    await this.datastore.delete(key);
    return key;
  }

  query () {
    return this.datastore.createQuery(this.kind);
  }

  async runQuery (query) {
    let queryResult = await this.datastore.runQuery(query);
    let entities = queryResult[0];
    return entities;
  }

  getAll () {
    return this.runQuery(this.query());
  }
}

DatastoreHelper.kinds = {
  USER: 'User',
  AUDIO_GREETING: 'AudioGreeting',
  VOICE_MUTE: 'VoiceMute'
};

module.exports = DatastoreHelper;
