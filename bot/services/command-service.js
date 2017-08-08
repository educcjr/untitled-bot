class CommandService {
  constructor (client, userService) {
    this.client = client;
    this.userService = userService;
  }

  execute (command) {
    let splittedCommand = command.split(' ');

    switch (splittedCommand[0]) {
      case groups.USER:
        this.userGroup(splittedCommand);
        break;
      case withoutGroup.TEST:
        console.log('Hooray!');
        break;
    }
  }

  userGroup (splittedCommand) {
    switch (splittedCommand[1]) {
      case userGroup.ADD:
        let id = splittedCommand[2].substr(2, splittedCommand[2].length - 3);
        let user = this.client.users.get(id);
        this.userService.add({id: user.id, username: user.username});
        break;
      case userGroup.LIST:
        console.log('List users');
        break;
    }
  }
}

const withoutGroup = {
  TEST: 'test'
};

const groups = {
  USER: 'user'
};

const userGroup = {
  ADD: 'add',
  LIST: 'list'
};

module.exports = CommandService;
