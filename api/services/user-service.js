class UserService {
  constructor (userRepository) {
    this.userRepository = userRepository;
  }

  getAll () {
    return this.userRepository.getAll();
  }

  async createOrUpdate (discordId, name) {
    let result = { user: null, isNew: false };

    let user = await this.userRepository.get(discordId);
    result.isNew = user == null;

    if (result.isNew) {
      user = await this.userRepository.create(discordId, name);
    } else {
      user = await this.userRepository.update(user, name);
    }

    result.user = user;
    return result;
  }

  async delete (discordId) {
    let result = { deleted: false, key: null };

    let user = await this.userRepository.get(discordId);

    if (user != null) {
      result.key = await this.userRepository.delete(user);
      result.deleted = true;
    }

    return result;
  }
}

module.exports = UserService;
