const Discord = require('discord.js');
const client = new Discord.Client();

const appConfigs = require('./app-configs.js');

let isStreaming = false;

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  if (message.content.toLowerCase().match(/you pass butter/g)) {
    message.channel.send('Oh damn :C');
  }
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
  if (!isStreaming &&
      !newMember.user.bot &&
      newMember.voiceChannel &&
      newMember.voiceChannelID !== oldMember.voiceChannelID) {

    newMember.voiceChannel.join()
      .then(conn => {
        newMember.guild.defaultChannel.send('I\'m a weirdo.');
        isStreaming = true;
        const dispatcher = conn.playFile('/mnt/c/Users/educc/Desktop/teste3.mp3');
        dispatcher.setVolume(0.5);
        dispatcher.on('end', () => {
          newMember.voiceChannel.leave();
          isStreaming = false;
        });
        dispatcher.on('error', e => {
          console.log(e);
          newMember.voiceChannel.leave();
          isStreaming = false;
        });
      })
      .catch(err => console.log(err));
  }
});

client.login(process.env.TOKEN || appConfigs.TOKEN);
