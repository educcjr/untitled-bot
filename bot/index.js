const https = require('https');
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
        isStreaming = true;

        https.get('https://storage.googleapis.com/untitled-bot-174221.appspot.com/greetings.mp3', (response) => {
          const dispatcher = conn.playStream(response);
          dispatcher.on('end', () => {
            newMember.voiceChannel.leave();
            isStreaming = false;
          });
          dispatcher.on('error', e => {
            console.log(e);
            newMember.voiceChannel.leave();
            isStreaming = false;
          });
        });
      })
      .catch(err => console.log(err));
  }
});

client.login(process.env.TOKEN || appConfigs.TOKEN);
