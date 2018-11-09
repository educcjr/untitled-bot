const path = require('path');
const fs = require('fs');

const download = require('download');

const mathHelper = require('./../../common/math-helper');
const requestHelper = require('./../../common/request-helper');

const appSettings = require('./../../app-configs');

class VoiceService {
  constructor () {
    this.streaming = false;
    this.voiceConn = null;
  }

  async greetings (member) {
    if (this.streaming) {
      // TODO: greetings queue;
      return;
    }

    let audios = await this.getAudios(member.id);

    if (audios.length === 0) {
      return;
    }

    this.voiceConn = this.getVoiceConnection(this.voiceConn, member);

    this.playAudio(this.voiceConn, audios);
  }

  async getAudios (discordId) {
    let audios = [];

    try {
      audios = await requestHelper.get(`${appSettings.API_PATH}/audio-greeting/${discordId}`);
    } catch (err) {
      console.log(err);
    }

    return audios;
  }

  async getVoiceConnection (voiceConn, { voiceChannelID, voiceChannel }) {
    if (voiceConn == null || voiceConn.channel.id !== voiceChannelID) {
      let newConn = await voiceChannel.join();
      newConn.on('disconnect', () => { this.voiceConn = null; });
      return newConn;
    }

    return voiceConn;
  }

  async playAudio (conn, audios) {
    try {
      this.streaming = true;

      let randomIndex = mathHelper.getRandomInt(0, audios.length - 1);
      let audioUrl = audios[randomIndex];
      let localAudioPath = path.join(appSettings.AUDIO_GREETING_DIR, path.basename(audioUrl));

      if (!fs.existsSync(localAudioPath)) {
        await download(audioUrl, appSettings.AUDIO_GREETING_DIR);
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
      console.log(err);
    }
  }
}

module.exports = VoiceService;
