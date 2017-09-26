const baseBucketDomain = 'https://storage.googleapis.com/untitled-bot-174418.appspot.com';
const defaultAudioUrl = `${baseBucketDomain}/greetings.mp3`;
const bucketDomain = `${baseBucketDomain}/greetings/`;

class VoiceService {
  constructor (apiPath, requestService) {
    this.apiPath = apiPath;
    this.requestService = requestService;
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
        this.requestService.get(`${this.apiPath}/greetings/audio/${member.user.id}`)
          .then(audios => {
            let audioUrl = defaultAudioUrl;

            if (audios.length > 0) {
              const audioIndex = this.getRandomInt(1, audios.length) - 1;
              audioUrl = `${bucketDomain}${audios[audioIndex]}`;
            }

            this.playAudio(audioUrl, conn);
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
