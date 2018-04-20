const ACTIONS = {
  COMMAND_ERROR: 'command_error',
  MUTE_MEMBER: 'mute_member'
};

const COMMANDS = {
  VOTE_MUTE: 'vote-mute'
};

class CommandReader {
  read (command, message) {
    let splittedCommand = command.split(' ');

    if (splittedCommand[0] === COMMANDS.VOTE_MUTE) {
      let members = message.mentions.members.array();
      let voiceChannel = message.member.voiceChannel;

      if (members.length > 1) {
        return commandError('Você só pode votar em um por vez!');
      }

      if (voiceChannel == null) {
        return commandError('Você precisa estar conectado a algum canal de voz para votar.');
      }

      return {
        action: ACTIONS.MUTE_MEMBER,
        params: {
          voter: message.member,
          candidate: members[0],
          voiceChannel,
          textChannel: message.channel
        }
      };
    }

    return null;
  }

  actions () {
    return ACTIONS;
  }
}

const commandError = (message) => {
  return {
    action: ACTIONS.COMMAND_ERROR,
    params: { message }
  };
};

module.exports = CommandReader;
