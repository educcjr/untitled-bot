const path = require('path');
const https = require('https');
const Datastore = require('@google-cloud/datastore');
const gcpAuth = process.env.NODE_ENV === 'production' ? {} : {
  projectId: 'untitled-bot-174418',
  credentials: require('./../keyfile.json')
};
const datastore = Datastore(gcpAuth);
const defaultAudioUrl = 'https://storage.googleapis.com/untitled-bot-174418.appspot.com/greetings.mp3';
const urlPrefix = 'https://storage.googleapis.com/untitled-bot-174418.appspot.com/greetings/';

class VoiceService {
  constructor (defaultChannel) {
    this.defaultChannel = defaultChannel;
    this.streaming = false;
  }

  isStreaming () {
    return this.streaming;
  }

  greetings (member) {
    member.voiceChannel.join()
      .then(conn => {
        this.streaming = true;

        this.handleSoundToPlay(member, conn);
      }).catch(err => console.log(err));
  }

  handleSoundToPlay (member, conn) {
    this.getUserAudios(member.user.id).then(audios => {
      if (audios.length > 0) this.playRandom(audios, conn);
      else this.playDefault(conn);
    });
  }

  getUserAudios(userId) {
    const query = datastore
      .createQuery('AudioGreeting')
      .filter('discordId', userId);
    
    return datastore.runQuery(query).then(entities => {
      return entities[0];
    });
  }

  playRandom(audios, conn) {
    const audioIndex = this.getRandomInt(1, audios.length) - 1;
    const userAudioUrl = `${urlPrefix}${audios[audioIndex].name}`;
    this.playAudio(userAudioUrl, conn);
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  playDefault(conn) {
    this.playAudio(defaultAudioUrl, conn);
  }

  playAudio(userAudioUrl, conn) {
    this.streaming = true;
    const dispatcher = conn.playArbitraryInput(userAudioUrl);
    dispatcher.on('end', () => this.onDispatcherEnd(conn));
    dispatcher.on('error', e => this.onDispatcherError(e, conn));
  }

  onDispatcherEnd(conn) {
    conn.channel.leave();
    this.streaming = false;
  }

  onDispatcherError(e, conn) {
    console.log(e);
    conn.channel.leave();
    this.streaming = false;
  }
}

module.exports = VoiceService;
