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

  let userRestService = new UserRestService(appConfigs.API_PATH);

  let replyService = new ReplyService();
  let voiceService = new VoiceService(appConfigs.API_PATH);
  let voteMuteService = new VoteMuteService(appConfigs.API_PATH, defaultGuild.afkChannelID);
  let commandService = new CommandService(client, userRestService, voteMuteService);

  console.log('I am ready!');
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

  client.on('message', async (message) => {
    try {
      if (message.content.substr(0, 5) === '/ubot') {
        await commandService.execute(message.content.substr(6), message);
      } else {
        replyService.reply(message);
      }
    } catch (err) {
      console.log(err);
      message.channel.send('BUGS TODONDE');
    }
  });

  client.on('voiceStateUpdate', async (oldMember, newMember) => {
    try {
      if (
        !newMember.user.bot &&
        newMember.voiceChannel &&
        newMember.voiceChannelID !== oldMember.voiceChannelID &&
        newMember.voiceChannelID !== defaultGuild.afkChannelID
      ) {
        await voiceService.greetings(newMember);
      }
    } catch (err) {
      console.log(err);
    }
  });
});

client.login(appConfigs.TOKEN);
