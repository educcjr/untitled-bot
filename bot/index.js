const Discord = require('discord.js');
const client = new Discord.Client();

const appConfigs = require('./app-configs.js');
const MessageService = require('./services/message-service.js');
const messageService = new MessageService();
const VoiceService = require('./services/voice-service.js');
const voiceService = new VoiceService();

const defaultChannelName = 'chatuba-em-texto';

let defaultChannel;

client.on('ready', () => {
  console.log('I am ready!');

  defaultChannel = client.channels.find(channel => channel.type === 'text' && channel.name === defaultChannelName);
  if (defaultChannel == null) {
    console.log(`Canal '${defaultChannelName}' não foi encontrado.`);
  } else {
    console.log(`Canal padrão: '${defaultChannelName}'`);
  }
});

client.on('message', messageService.reply);

client.on('voiceStateUpdate', (oldMember, newMember) => {
  if (!voiceService.isStreaming() &&
      !newMember.user.bot &&
      newMember.voiceChannel &&
      newMember.voiceChannelID !== oldMember.voiceChannelID) {
    voiceService.greetings(newMember);
  }
});

client.login(process.env.TOKEN || appConfigs.TOKEN);
