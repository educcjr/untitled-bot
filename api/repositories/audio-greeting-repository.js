const mongoose = require('mongoose');

const audioGreetingModel = new mongoose.Schema({
  discordId: { type: String, index: true },
  name: String
});

class AudioGreetingRepository {
  constructor (connection) {
    this.model = connection.model('AudioGreeting', audioGreetingModel);
  }

  get (discordId) {
    return this.model.find({ discordId });
  }

  getAll () {
    return this.model.find({});
  }

  create (discordId, name) {
    return this.model.create({ discordId, name });
  }

  delete (objectId) {
    return this.model.findByIdAndRemove(objectId);
  }
}

module.exports = AudioGreetingRepository;
