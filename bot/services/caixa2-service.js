const _ = require('lodash');

const command = {
  USER_ADD: 'add-user',
  USER_LIST: 'list-user',
};

class Caixa2Service {
  constructor (client) {
    this.client = client;
  }

  /**
   * 
   * @param {Array<string>} splittedCommand Original command, split in spaces, e.g.
   * @param {*} channel 
   */
  process (splittedCommand, channel) {
    if(splittedCommand.length)
  }
}

module.exports = Caixa2Service;
