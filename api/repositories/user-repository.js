const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordId: { type: String, index: true },
  name: String
});

class UserRepository {
  constructor (connection) {
    this.model = connection.model('User', userSchema);
  }

  getAll () {
    return this.model.find({});
  }

  get (discordId) {
    return this.model.find({ discordId });
  }

  create (user) {
    return this.model.create(user);
  }

  update (user) {
    return this.model.findOneAndUpdate({ discordId: user.discordId }, user);
  }

  createOrUpdate (user) {
    return this.model.findOneAndUpdate(
      { discordId: user.discordId },
      user,
      { upsert: true }
    );
  }

  delete (discordId) {
    return this.model.findOneAndDelete({ discordId });
  }
}

module.exports = UserRepository;
