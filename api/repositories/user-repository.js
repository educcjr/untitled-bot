const DatastoreHelper = require('./datastore-helper');

class UserRepository {
  constructor (datastore) {
    this.datastoreHelper = new DatastoreHelper(DatastoreHelper.kinds.USER, datastore);
  }

  async get (discordId) {
    let query = this.datastoreHelper
      .query()
      .filter('discordId', discordId);

    let entities = await this.datastoreHelper.runQuery(query);

    if (entities.length > 1) {
      throw new Error('Existem usuários duplicados no banco de dados.');
    }

    let user = entities[0];
    return user;
  }

  getAll () {
    return this.datastoreHelper.getAll();
  }

  create (discordId, name) {
    return this.datastoreHelper.insert({ discordId, name });
  }

  update (userEntity, name) {
    return this.datastoreHelper.update({ ...userEntity, name });
  }

  delete (user) {
    return this.datastoreHelper.delete(user);
  }
}

module.exports = UserRepository;
