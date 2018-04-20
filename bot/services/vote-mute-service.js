const Discord = require('discord.js');
const Permissions = Discord.Permissions;

const moment = require('moment');
const outdent = require('outdent');

const requestHelper = require('./../../common/request-helper');

class VoteMuteService {
  constructor (apiPath) {
    this.url = `${apiPath}/mute`;
  }

  async vote (voter, candidate, voiceChannel, textChannel) {
    let potentialVoters = voiceChannel.members
        .filter(member => member.id !== candidate.id)
        .array()
        .length;

    if (potentialVoters < 3) {
      return 'Se não tiver pelo menos 3 pessoas pra votar não tem votação...';
    }

    let vote = {
      candidateDiscordId: candidate.id,
      voterDiscordId: voter.id,
      channelId: voiceChannel.id,
      dateTimeIndex: moment().format('YYYYMMDDHHmmss')
    };

    let voteResult = await requestHelper.post(this.url, vote);

    if (voteResult.created && voteResult.voted) {
      return 'Votação iniciada!';
    } else if (voteResult.voted) {
      let votesNeeded = calculateVotesNeeded(potentialVoters);
      let votesTotal = voteResult.votation.votes.length;

      if (votesTotal >= votesNeeded) {
        let permissionOverwrites = voiceChannel.permissionOverwrites.get(candidate.id);
        let originalOverwrite = null;

        if (permissionOverwrites != null) {
          let allowedPermissions = new Permissions(permissionOverwrites.allow);
          let denniedPermissions = new Permissions(permissionOverwrites.deny);

          originalOverwrite = {
            SPEAK: permissionsConversion(allowedPermissions, denniedPermissions, Permissions.FLAGS.SPEAK)
          };

          console.log(originalOverwrite);
        }

        await voiceChannel.overwritePermissions(candidate, { SPEAK: false });
        setTimeout(async () => {
          try {
            if (originalOverwrite != null) {
              await voiceChannel.overwritePermissions(candidate, originalOverwrite);
            } else {
              let permissionOverwrite = voiceChannel.permissionOverwrites.get(candidate.id);
              if (permissionOverwrite != null) await permissionOverwrite.delete();
            }
            textChannel.send(`${candidate.displayName} desmutado.`);
          } catch (err) {
            textChannel.send(`Algum bug ao desmutar o ${candidate.displayName}.`);
          }
        }, 120000);
        return outdent`
          Votação encerrada!
          Usuário ${candidate.displayName} foi mutado por 2 minutos.
        `;
      } else {
        return outdent`
          Seu voto contabilizado, ${voter.displayName}
          Status: ${votesTotal}/${votesNeeded}
        `;
      }
    } else {
      return 'Você já votou!';
    }
  }
}

const calculateVotesNeeded = (potentialVoterQtdy) => {
  return (potentialVoterQtdy / 2) + 1;
};

const permissionsConversion = (allowedPermissions, denniedPermissions, permission) => {
  if (allowedPermissions.has(permission)) {
    return true;
  }
  if (denniedPermissions.has(permission)) {
    return false;
  }
  return null;
};

module.exports = VoteMuteService;
