const Discord = require('discord.js');
const client = new Discord.Client();

const appConfigs = require('./../app-configs');

const UserRestService = require('./rest-services/user-rest-service');
const ReplyService = require('./services/reply-service');
const VoiceService = require('./services/voice-service');
const VoteMuteService = require('./services/vote-mute-service');
const CommandService = require('./services/command-service');

client.on('ready', () => {
  // TODO: multiple guilds
  let defaultGuild = client.guilds.first();

  const userRestService = new UserRestService(appConfigs.API_PATH);

  const replyService = new ReplyService();
  const voiceService = new VoiceService(appConfigs.API_PATH);
  const voteMuteService = new VoteMuteService(appConfigs.API_PATH, defaultGuild.afkChannelID);
  const commandService = new CommandService(client, userRestService, voteMuteService);

  console.log('I am ready!');
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

client.login(appConfigs.TOKEN);
