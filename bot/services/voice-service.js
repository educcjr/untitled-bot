const path = require('path');
const https = require('https');
const audioUrl = 'https://storage.googleapis.com/untitled-bot-174418.appspot.com/greetings.mp3';

class VoiceService {
  constructor (defaultChannel) {
    this.defaultChannel = defaultChannel;
    this.streaming = false;
    this.dir = path.resolve(__dirname, '..', 'members_sounds');

    this.members = {
      u7393: {name: 'murilo', url: 'murilo.mp3'},
      u2588: {name: 'renan', url: 'renan.mp3'},
      u2932: {name: 'vitor', url: 'vitor.mp3'},
      u3489: {name: 'dodo', url: 'dodo.mp3'},
      u9982: {name: 'gus', url: 'gus.mp3'},
      u3306: {name: 'eduardo', url: 'eduardo.mp3'},
      u3719: {name: 'ruedo', url: 'ruedo.mp3'},
      u8854: {name: 'joao', url: 'joao.mp3'},
      u9384: {name: 'patrick', url: 'patrick.mp3'},
      u2434: {name: 'luizzak', url: 'luiz.mp3'}
    };
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
    let user = this.members[`u${member.user.discriminator}`];

    if (user) this.playLocal(user.url, member, conn);
    else this.playDefault(member, conn);
  }

  playLocal (url, member, conn) {
    const fileDir = path.resolve(this.dir, url);
    console.log(fileDir);
    const dispatcher = conn.playFile(fileDir);
    dispatcher.on('end', () => this.onDispatcherEnd(member));
    dispatcher.on('error', e => this.onDispatcherError(e, member));
  }

  onDispatcherEnd (member) {
    member.voiceChannel.leave();
    this.streaming = false;
  }

  onDispatcherError (e, member) {
    console.log(e);
    member.voiceChannel.leave();
    this.streaming = false;
  }

  playDefault (member, conn) {
    https.get(
      audioUrl,
      response => this.playVaiTomarNoCu(response, member, conn),
      () => this.handleHttpError(member)
    );
  }

  playVaiTomarNoCu (response, member, conn) {
    const dispatcher = conn.playStream(response);
    dispatcher.on('end', () => this.onDispatcherEnd(member));
    dispatcher.on('error', e => this.onDispatcherError(e, member));
  }

  handleHttpError (member) {
    member.voiceChannel.leave();
    this.streaming = false;
    this.defaultChannel.send('Deu merda 06!');
  }
}

module.exports = VoiceService;
