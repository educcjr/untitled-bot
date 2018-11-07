class UserService {
  constructor (userRepository) {
    this.userRepository = userRepository;
  }

  getAll () {
    return this.userRepository.getAll();
  }

  async createOrUpdate (user) {
    let existing = await this.userRepository.createOrUpdate(user);
    let updated = await this.userRepository.get(user.discordId);

    return {
      existing,
      updated
    };
  }

  delete (discordId) {
    return this.userRepository.delete(discordId);
  }
}

module.exports = UserService;
