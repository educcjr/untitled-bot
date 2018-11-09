const moment = require('moment');
const outdent = require('outdent');

const requestHelper = require('./../../common/request-helper');
const permissionsHelper = require('./../helpers/permissions-helper');

const appConfigs = require('./../../app-configs');

const VOTE_MUTE_API_URL = `${appConfigs.API_PATH}/mute`;

class VoteMuteService {
  constructor (afkChannelDiscordId) {
    this.afkChannelDiscordId = afkChannelDiscordId;
  }

  async vote (voter, candidate, voiceChannel, textChannel) {
    let potentialVoters = voiceChannel.members
        .filter(member => member.id !== candidate.id)
        .array()
        .length;

    if (potentialVoters < 3) {
      return 'Se não tiver pelo menos 3 pessoas pra votar não tem votação...';
    }

    let voteResult = await requestHelper.post(
      VOTE_MUTE_API_URL,
      this.createVoteRequest(candidate, voter, voiceChannel)
    );

    if (voteResult.onGoing) {
      return `O ${candidate.displayName} já está mutado!`;
    }

    if (voteResult.created && voteResult.voted) {
      return 'Votação iniciada!';
    } else if (voteResult.voted) {
      let votesNeeded = this.calculateVotesNeeded(potentialVoters);
      let votesTotal = voteResult.votation.votes.length;

      if (votesTotal >= votesNeeded) {
        await requestHelper.post(
          `${VOTE_MUTE_API_URL}/close`,
          this.createVotationRequest(voteResult.votation)
        );

        let permissionOverwrites = voiceChannel.permissionOverwrites.get(candidate.id);
        let originalSpeakPermission = null;

        if (permissionOverwrites != null) {
          originalSpeakPermission = permissionsHelper.checkPermission(
            permissionOverwrites,
            permissionsHelper.FLAGS.SPEAK
          );
        }

        await voiceChannel.overwritePermissions(candidate, { SPEAK: false });
        await candidate.setVoiceChannel(this.afkChannelDiscordId);
        await candidate.setVoiceChannel(voiceChannel);

        setTimeout(async () => {
          try {
            if (permissionOverwrites != null) {
              await voiceChannel.overwritePermissions(candidate, { SPEAK: originalSpeakPermission });
            } else {
              let permissionOverwrite = voiceChannel.permissionOverwrites.get(candidate.id);
              if (permissionOverwrite != null) await permissionOverwrite.delete();
            }

            await requestHelper.post(
              `${VOTE_MUTE_API_URL}/complete`,
              this.createVotationRequest(voteResult.votation)
            );

            textChannel.send(`${candidate.displayName} desmutado.`);
          } catch (err) {
            textChannel.send(`Algum bug ao desmutar o ${candidate.displayName}.`);
          }
        }, 120000);

        return outdent`
          Votação encerrada!
          ${candidate.displayName} foi mutado por 2 minutos.
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

  calculateVotesNeeded (potentialVoterQtdy) {
    return Math.floor(potentialVoterQtdy / 2) + 1;
  }

  createVoteRequest (candidate, voter, voiceChannel) {
    return {
      candidateDiscordId: candidate.id,
      voterDiscordId: voter.id,
      channelDiscordId: voiceChannel.id,
      dateTimeIndex: moment().format('YYYYMMDDHHmmss')
    };
  }

  createVotationRequest (votation) {
    let { candidateDiscordId, channelDiscordId, startedDateTime: dateTimeIndex } = votation;
    return { candidateDiscordId, channelDiscordId, dateTimeIndex };
  }
}

module.exports = VoteMuteService;
