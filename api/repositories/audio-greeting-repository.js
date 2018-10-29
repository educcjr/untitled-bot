const mongoose = require('mongoose');

const audioGreetingSchema = new mongoose.Schema({
  discordId: { type: String, index: true },
  name: String
});

class AudioGreetingRepository {
  constructor (connection) {
    this.model = connection.model('AudioGreeting', audioGreetingSchema);
  }

  getAll () {
    return this.model.find({});
  }

  get (discordId) {
    return this.model.find({ discordId });
  }

  create (audioGreeting) {
    return this.model.create(audioGreeting);
  }

  delete (discordId) {
    return this.model.findOneAndDelete({ discordId });
  }
}

module.exports = AudioGreetingRepository;
