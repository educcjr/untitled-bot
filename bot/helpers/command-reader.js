const ACTIONS = {
  COMMAND_ERROR: 'command_error',
  MUTE_MEMBER: 'mute_member'
};

const COMMANDS = {
  VOTE_MUTE: 'mute'
};

class CommandReader {
  read (command, message) {
    let splittedCommand = command.split(' ');

    if (splittedCommand[0] === COMMANDS.VOTE_MUTE) {
      let members = message.mentions.members.array();
      if (members.length > 1) {
        return {
          action: ACTIONS.COMMAND_ERROR,
          params: { message: 'Você só pode votar em um por vez!' }
        };
      }
      return {
        action: ACTIONS.MUTE_MEMBER,
        params: { guildMember: members[0] }
      };
    }

    return null;
  }

  actions () {
    return ACTIONS;
  }
}

module.exports = CommandReader;
