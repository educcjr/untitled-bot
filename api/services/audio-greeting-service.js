const path = require('path');

class AudioGreetingService {
  constructor (audioGreetingRepository, storageService) {
    this.audioGreetingRepository = audioGreetingRepository;
    this.storageService = storageService;
  }

  getAll () {
    return this.audioGreetingRepository.getAll();
  }

  get (discordId) {
    return this.audioGreetingRepository.get(discordId);
  }

  async create (discordId, file) {
    if (path.extname(file.filename) !== '.mp3') {
      throw new Error('Tipo de arquivo incorreto. Você está enviando um áudio?');
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
