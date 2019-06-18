const mongoose = require('mongoose');

const audioGreetingSchema = new mongoose.Schema({
  discordId: String,
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

  delete (id) {
    return this.model.findByIdAndDelete(id);
  }
}

module.exports = AudioGreetingRepository;
