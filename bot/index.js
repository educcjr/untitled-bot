const Discord = require('discord.js');
const client = new Discord.Client();

const appConfigs = require('./../app-configs.js');

const RequestService = require('./../common/request-service');
const resquestService = new RequestService();

const UserService = require('./services/user-service.js');
const ReplyService = require('./services/reply-service.js');
const VoiceService = require('./services/voice-service.js');
const CommandService = require('./services/command-service.js');

const defaultChannelName = 'chatuba-em-texto';

client.on('ready', () => {
  const defaultChannel = getDefaultChannel();

  const userService = new UserService(appConfigs.API_PATH);
  const replyService = new ReplyService();
  const voiceService = new VoiceService(appConfigs.API_PATH, resquestService);
  const commandService = new CommandService(client, userService);

  console.log('I am ready!');
  console.log(`Default channel: ${defaultChannel}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

  client.on('message', (message) => {
    if (message.content.substr(0, 5) === '/ubot') {
      commandService.execute(message.content.substr(6), message);
    } else {
      replyService.reply(message);
    }
  });

  client.on('voiceStateUpdate', (oldMember, newMember) => {
    if (!voiceService.isStreaming() &&
        !newMember.user.bot &&
        newMember.voiceChannel &&
        newMember.voiceChannelID !== oldMember.voiceChannelID) {
      voiceService.greetings(newMember);
    }
  });
});

const getDefaultChannel = () => {
  let defaultChannel = client.channels
    .find(channel => channel.type === 'text' && channel.name === defaultChannelName);
  return defaultChannel;
};

client.login(appConfigs.TOKEN);
