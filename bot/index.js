const https = require('https');
const Discord = require('discord.js');
const client = new Discord.Client();
const appConfigs = require('./app-configs.js');
const messageResponser = require('./message-responser.js');
const getMemberAudioUrl = require('./get-member-audio-url.js');

const members = {
  murilo: {id: '7393', url: 'members_sounds/murilo.mp3'},
  renan: {id: '2588', url: 'members_sounds/renan.mp3'},
  vitor: {id: '2932', url: 'members_sounds/vitor.mp3'},
  dodo: {id: '3489', url: 'members_sounds/dodo.mp3'},
  gus: {id: '9982', url: 'members_sounds/gus.mp3'},
  eduardo: {id: '3306', url: 'members_sounds/eduardo.mp3'},
  ruedo: {id: '3719', url: 'members_sounds/ruedo.mp3'},
  joao: {id: '8854', url: 'members_sounds/joao.mp3'},
  patrick: {id: '9384', url: 'members_sounds/patrick.mp3'}
};

const audioUrl = 'https://storage.googleapis.com/untitled-bot-174221.appspot.com/greetings.mp3';

let isStreaming = false;

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  messageResponser(message);
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
  if (voiceVerifications(oldMember, newMember)) {
      newMember.voiceChannel.join()
        .then(conn => {
          isStreaming = true;

          handleSoundToPlay(newMember, conn);
      }).catch(err => console.log(err));
  }
});

const voiceVerifications = (oldMember, member) => {
  return !isStreaming &&
    !member.user.bot &&
    member.voiceChannel &&
    member.voiceChannelID !== oldMember.voiceChannelID;
};

const handleSoundToPlay = (member, conn) => {
  const audioUrl = getMemberAudioUrl(member.user.discriminator);
  
  if (audioUrl) playLocal(audioUrl, member, conn);
  else playDefault(member, conn);
}

const playLocal = (url, member, conn) => {
  const dispatcher = conn.playFile(url);
  dispatcher.on('end', () => onDispatcherEnd(member));
  dispatcher.on('error', e => onDispatcherError(e, member));
};

const onDispatcherEnd = member => {
  member.voiceChannel.leave();
  isStreaming = false;
};

const onDispatcherError = (e, member) => {
  console.log(e);
  member.voiceChannel.leave();
  isStreaming = false;
};

const playDefault = (member, conn) => {
  https.get(
    audioUrl,
    response => playVaiTomarNoCu(response, member, conn),
    () => handleHttpError()
  );
}

const playVaiTomarNoCu = (response, member, conn) => {
  const dispatcher = conn.playStream(response);
  dispatcher.on('end', () => onDispatcherEnd(member));
  dispatcher.on('error', e => onDispatcherError(e, member));
};

const handleHttpError = () => {
  newMember.voiceChannel.leave();
  message.channel.send('Deu merda 06!');
};

client.login(process.env.TOKEN || appConfigs.TOKEN);
