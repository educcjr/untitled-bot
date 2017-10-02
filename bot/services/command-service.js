// import * as Discord from 'discord.js'; // For autocomplete
// import * as UserService from './user-service.js';

const CommandReader = require('./../helpers/command-reader');

const Caixa2 = require('./caixa2-service.js');
const helper = require('../helpers/command-helpers.js');

const withoutGroup = {
  PING: 'ping'
};
const groups = {
  LOUNGE: 'lounge',
  CAIXA2: [ 'caixa2', '$' ],
  LIST_IDS: 'list-ids'
};
const loungeGroup = {
  USER_ADD: 'add-user',
  USER_LIST: 'list-user'
};

class CommandService {
  /**
   * @param {Discord.Client} client
   * @param {UserService} userService
   */
  constructor (client, userService) {
    this.client = client;
    this.userService = userService;

    this.commandReader = new CommandReader();
    this.caixa2Service = new Caixa2(client);
  }

  /**
   * @param {string} command
   * @param {Discord.Message} message
   */
  execute (command, message) {
    let channel = message.channel;
    let splittedCommand = command.split(' ');

    const actions = this.commandReader.actions();
    let commandAction = this.commandReader.read(command, message);

    if (commandAction != null) {
      switch (commandAction.action) {
        case actions.COMMAND_ERROR:
          channel.send(commandAction.params.message);
          break;
        case actions.MUTE_MEMBER:
          channel.send('A feature não está pronta ainda, culpem o Vitão!');
          break;
        default:
          channel.send('Acho que não sei como atendê-lo :c');
      }
    } else if (helper.commandMatches(splittedCommand[0], withoutGroup.PING)) {
      channel.send('Rá toma no cu!');
    } else if (helper.commandMatches(splittedCommand[0], groups.LIST_IDS)) {
      this.listMemberIds(splittedCommand, message);
    } else if (helper.commandMatches(splittedCommand[0], groups.LOUNGE)) {
      this.loungeGroup(splittedCommand, message);
    } else if (helper.commandMatches(splittedCommand[0], groups.CAIXA2)) {
      this.caixa2(splittedCommand, message);
    }
  }

  /**
   * @param {Array<string>} splittedCommand
   * @param {Discord.Message} message
   */
  listMemberIds (splittedCommand, message) {
    var status = 'all';
    // List only online
    if (splittedCommand.length === 1) {
      status = 'online';
    } else {
      status = splittedCommand[1];
    }

    if (status !== 'online' && status !== 'offline' && status !== 'all' && status !== 'idle' && status !== 'dnd') {
      message.channel.send('Mas o que? Que status é esse? Status reconhecidos: \'online\', \'offline\', \'idle\', \'dnd\' (do not disturb), e \'all\' para todos.');
      return;
    }

    var members = message.guild.members.array();

    members = members.filter(member => {
      if (status === 'all') {
        return true;
      }

      return member.presence.status === status;
    });

    if (members.length === 0) {
      message.channel.send('Não achei ninguém não :(');
      return;
    }

    var final = 'Usuários com status ' + status + ':\n';
    members.forEach((member, i) => {
      final += (i + 1) + ') ' + member.displayName + ' id: ' + member.id + '\n';
    });

    message.channel.send(final);
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
