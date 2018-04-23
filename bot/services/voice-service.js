const path = require('path');
const fs = require('fs');

const download = require('download');

const mathHelper = require('./../../common/math-helper');
const requestHelper = require('./../../common/request-helper');

class VoiceService {
  constructor (apiPath) {
    this.apiPath = apiPath;
    this.streaming = false;
  }

  async greetings (member) {
    if (this.streaming) {
      // TODO: greetings queue;
      return;
    }

    let conn = await member.voiceChannel.join();
    await this.playAudio(member.id, conn);
  }

  async playAudio (memberId, conn) {
    try {
      this.streaming = true;

      let audios = await requestHelper.get(`${this.apiPath}/greetings/audio/${memberId}`);

      let randomIndex = mathHelper.getRandomInt(0, audios.length - 1);
      let audioUrl = audios[randomIndex].path;
      let localAudioDirectory = path.join(__dirname, '..', 'greetings-audios');
      let localAudioPath = path.join(localAudioDirectory, path.basename(audioUrl));

      if (!fs.existsSync(localAudioPath)) {
        await download(audioUrl, localAudioDirectory);
      }

      let dispatcher = conn.playFile(localAudioPath);

      let endFunc = () => {
        this.streaming = false;
        conn.disconnect();
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
