const mathHelper = require('./../../common/math-helper');
const requestHelper = require('./../../common/request-helper');

class VoiceService {
  constructor (apiPath) {
    this.apiPath = apiPath;
    this.streaming = false;
    this.voiceConnection = null;
  }

  async greetings (member) {
    if (this.streaming) {
      // TODO: greetings queue;
      return;
    }

    if (this.voiceConnection != null && this.voiceConnection.id === member.voiceChannelID) {
      await this.playAudio(member.id);
    } else {
      this.voiceConnection = await member.voiceChannel.join();

      this.voiceConnection.on('disconnect', () => {
        this.voiceConnection = null;
      });

      await this.playAudio(member.id);
    }
  }

  async playAudio (memberId) {
    try {
      this.streaming = true;

      let audios = await requestHelper.get(`${this.apiPath}/greetings/audio/${memberId}`);

      let audioIndex = mathHelper.getRandomInt(0, audios.length - 1);
      let audioRemotePath = audios[audioIndex].path;
      let dispatcher = this.voiceConnection.playArbitraryInput(audioRemotePath);

      let endFunc = () => {
        this.streaming = false;
      };

      dispatcher.on('end', endFunc);
      dispatcher.on('error', (err) => {
        console.log(err);
        endFunc();
      });
    } catch (err) {
      this.streaming = false;
    }
  }
}

module.exports = VoiceService;
