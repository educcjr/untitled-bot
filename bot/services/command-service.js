
const withoutGroup = {
  PING: 'ping'
};
const groups = {
  LOUNGE: 'lounge'
};
const loungeGroup = {
  USER_ADD: 'add-user',
  USER_LIST: 'list-user'
};

class CommandService {
  constructor (client, userService) {
    this.client = client;
    this.userService = userService;
  }

  execute (command, { channel }) {
    let splittedCommand = command.split(' ');
    switch (splittedCommand[0]) {
      case groups.LOUNGE:
        this.loungeGroup(splittedCommand, channel);
        break;
      case withoutGroup.PING:
        channel.send('Rá toma no cu!');
        break;
    }
  }

  loungeGroup (splittedCommand, channel) {
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
}

const defaultCatch = (err, channel) => { if (err) channel.send(JSON.stringify(err)); };

module.exports = CommandService;
