const requestHelper = require('./../../common/request-helper');

class VoiceService {
  constructor (apiPath) {
    this.apiPath = apiPath;
    this.streaming = false;
  }
  isStreaming () {
    return this.streaming;
  }

  greetings (member) {
    member.voiceChannel
      .join()
      .then(conn => {
        this.streaming = true;
        requestHelper.get(`${this.apiPath}/greetings/audio/${member.user.id}`)
          .then(audios => {
            const audioIndex = this.getRandomInt(1, audios.length) - 1;
            this.playAudio(audios[audioIndex].path, conn);
          });
      })
      .catch(err => console.log(err));
  }
  // TODO: extract into a reusable class
  getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  playAudio (userAudioUrl, conn) {
    this.streaming = true;
    const dispatcher = conn.playArbitraryInput(userAudioUrl);

    let endFunc = () => {
      this.streaming = false;
      conn.channel.leave();
    };

    dispatcher.on('end', endFunc);
    dispatcher.on('error', err => {
      console.log(err);
      endFunc();
    });
  }
}

module.exports = VoiceService;
