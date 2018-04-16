class DatastoreHelper {
  constructor (kind, datastore) {
    this.kind = kind;
    this.datastore = datastore;
  }

  async insert (data) {
    let result = {};

    try {
      let allocationResult = await this.datastore.allocateIds(this.datastore.key(this.kind), 1);
      let keyList = allocationResult[0];
      let key = keyList[0];
      await this.datastore.insert({key, data});
      result = successResult(key);
    } catch (err) {
      result = errorResult(err);
    }

    return result;
  }

  async update (entity) {
    let result = {};

    try {
      let key = entity[this.datastore.KEY];
      await this.datastore.update({key, entity});
      result = successResult(key);
    } catch (err) {
      result = errorResult(err);
    }

    return result;
  }

  query () {
    return this.datastore.createQuery(this.kind);
  }

  async runQuery (query) {
    let result;

    try {
      let queryResult = await this.datastore.runQuery(query);
      result = successResult(queryResult[0]);
    } catch (err) {
      result = errorResult(err);
    }

    return result;
  }
}

const successResult = (value) => ({
  success: true,
  value
});

const errorResult = (err) => ({
  success: false,
  errorMessage: err.message
});

DatastoreHelper.kinds = {
  USER: 'User',
  AUDIO_GREETING: 'AudioGreeting',
  VOICE_MUTE: 'VoiceMute'
};

module.exports = DatastoreHelper;
