const path = require('path');

class AudioGreetingService {
  constructor (audioGreetingRepository, storageService) {
    this.audioGreetingRepository = audioGreetingRepository;
    this.storageService = storageService;
  }

  getAll () {
    return this.audioGreetingRepository.getAll();
  }

  async get (discordId) {
    return (await this.audioGreetingRepository.get(discordId))
      .map(({ _id, name }) => ({
        id: _id,
        url: this.storageService.getUrl(name),
        name: name
      }));
  }

  async create (discordId, file) {
    if (path.extname(file.filename) !== '.mp3') {
      throw new Error('Tipo de arquivo incorreto.');
    }

    let resultPath = await this.storageService.uploadGreeting(file.path, file.filename);

    if (resultPath) {
      await this.audioGreetingRepository.create({ discordId, name: file.filename });
    }

    return {
      path: resultPath,
      name: file.filename
    };
  }

  delete (discordId) {
    return this.audioGreetingRepository.delete(discordId);
  }
}

module.exports = AudioGreetingService;
