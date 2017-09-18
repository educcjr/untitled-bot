// import * as Discord from 'discord.js'; // For autocomplete
// import * as UserService from './user-service.js';

const _ = require('lodash');
const Caixa2 = require('./caixa2-service.js');
const helper = require('../helpers/command-helpers.js');

const withoutGroup = {
  PING: 'ping'
};
const groups = {
  LOUNGE: 'lounge',
  CAIXA2: [ 'caixa2', '$' ]
};
const loungeGroup = {
  USER_ADD: 'add-user',
  USER_LIST: 'list-user',
};

class CommandService {
  /**
   * @param {Discord.Client} client 
   * @param {UserService} userService 
   */
  constructor (client, userService) {
    this.client = client;
    this.userService = userService;

    this.caixa2Service = new Caixa2(client);
  }

  /**
   * @param {string} command 
   * @param {Discord.Message} message 
   */
  execute (command, message) {
    let channel = message.channel;
    let splittedCommand = command.split(' ');
    
    // Match group-less first
    if(helper.commandMatches(splittedCommand[0], withoutGroup.PING)) {
      channel.send('Rá toma no cu!');
    }

    // Match grouped commands
    if(helper.commandMatches(splittedCommand[0], groups.LOUNGE)) {
      this.loungeGroup(splittedCommand, message);
    }
    if(helper.commandMatches(splittedCommand[0], groups.CAIXA2)) {
      this.caixa2(splittedCommand, message);
    }
  }

  /**
   * @param {Array<String>} splittedCommand 
   * @param {Discord.Message} message 
   */
  loungeGroup (splittedCommand, message) {
    let channel = message.channel;
    
    switch (splittedCommand[1]) {
      case loungeGroup.USER_ADD:
        let id = splittedCommand[2]
          .replace('<@', '')
          .replace('>', '')
          .replace('!', '');
        let user = this.client.users.get(id);
        if (user) {
          this.userService.add({id: user.id, name: user.username})
            .then(result => {
              if (result && result.data) {
                channel.send('Usuário inserido: ```' + JSON.stringify(result.data) + '```');
              }
            })
            .catch(err => defaultCatch(err, channel));
        } else {
          channel.send('Usuário não encontrado.');
        }
        break;
      case loungeGroup.USER_LIST:
        this.userService.list()
          .then(result => {
            if (result) {
              for (let user of result) {
                channel.send(user.name);
              }
            }
          })
          .catch(err => defaultCatch(err, channel));
        break;
    }
  }

  /**
   * @param {Array<String>} splittedCommand 
   * @param {Discord.Message} message 
   */
  caixa2 (splittedCommand, message) {
    this.caixa2Service.process(splittedCommand, message);
  }
}

const defaultCatch = (err, channel) => { if (err) channel.send(JSON.stringify(err)); };

module.exports = CommandService;
