const Discord = require('discord.js');
const client = new Discord.Client();

const appConfigs = require('./../app-configs');

const UserService = require('./remote-services/user-service');
const ReplyService = require('./services/reply-service');
const VoiceService = require('./services/voice-service');
const VoteMuteService = require('./services/vote-mute-service');
const CommandService = require('./services/command-service');

const DEFAULT_CHANNEL_NAME = 'chatuba-em-texto';

client.on('ready', () => {
  console.log(`Guilds: ${client.guilds.array().length}`);

  // TODO: multiple guilds
  let defaultGuild = client.guilds.first();

  const defaultChannel = getDefaultChannel(defaultGuild);

  const userRemoteService = new UserService(appConfigs.API_PATH);

  const replyService = new ReplyService();
  const voiceService = new VoiceService(appConfigs.API_PATH);
  const voteMuteService = new VoteMuteService(appConfigs.API_PATH);
  const commandService = new CommandService(client, userRemoteService, voteMuteService);

  console.log('I am ready!');
  console.log(`Default channel: ${defaultChannel.id}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

  client.on('message', async (message) => {
    if (message.content.substr(0, 5) === '/ubot') {
      try {
        await commandService.execute(message.content.substr(6), message);
      } catch (err) {
        message.channel.send('BUGS TODONDE');
      }
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

const getDefaultChannel = (guild) => {
  return guild
    .channels
    .find(channel => channel.type === 'text' && channel.name === DEFAULT_CHANNEL_NAME);
};

client.login(appConfigs.TOKEN);
