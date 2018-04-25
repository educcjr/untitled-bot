const path = require('path');
const fs = require('fs');

const download = require('download');

const mathHelper = require('./../../common/math-helper');
const requestHelper = require('./../../common/request-helper');

class VoiceService {
  constructor (apiPath) {
    this.apiPath = apiPath;
    this.streaming = false;
    this.voiceConn = null;
  }

  async greetings (member) {
    if (this.streaming) {
      // TODO: greetings queue;
      return;
    }

    if (this.voiceConn == null || this.voiceConn.channel.id !== member.voiceChannelID) {
      this.voiceConn = await member.voiceChannel.join();
      this.voiceConn.on('disconnect', () => { this.voiceConn = null; });
    }

    await this.playAudio(member.id, this.voiceConn);
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
