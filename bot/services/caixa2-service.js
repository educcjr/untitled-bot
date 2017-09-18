//import * as Discord from 'discord.js'; // For autocomplete
//import * as UserService from './user-service.js';

const moment = require('moment');

const _ = require('lodash');
const Parser = require('../helpers/parser.js');

const Datastore = require('@google-cloud/datastore');
const gcpAuth = process.env.NODE_ENV === 'production' ? {} : {
  projectId: 'untitled-bot-174418',
  credentials: require('./../keyfile.json')
};
const datastore = Datastore(gcpAuth);

/*
 * Debt entity keys:
 * 
 * {
 *  "from": <user_id (Discord.GuildMember.id)>,
 *  "to": <user_id (Discord.GuildMember.id)>,
 *  "description": String,
 *  "ammount": Number,
 *  "accepted": Boolean,
 *  "created": Date
 * }
 */

class Caixa2Service {
  /**
   * 
   * @param {Discord.Client} client 
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * @param {Array<string>} splittedCommand Original chat line command, split in
   * spaces, with no `/bot`, e.g.: `caixa2 20 para vitão: da gasolina.`
   * @param {Discord.Message} message Original message
   */
  process(splittedCommand, message) {
    // Empty command- just list user's ownings
//    if (splittedCommand.length == 1) {
//      listOwningsShort(message.member, message);
//      return;
//    }

    this.listOwningsShort(message.member, message);
  }

  /**
   * @param {Discord.GuildMember} member
   * @param {Discord.Message} message
   */
  listOwningsShort(member, message) {
    const userId = member.user.id;

    Promise
      .all([this._getDebtsGoingTo(userId), this._getDebtsGoingFrom(userId)])
      .then((results) => {
        const to = results[0][0];
        const from = results[1][0];
        
        // Resolve display names from each side
        return Promise.all([
          this._resolveDisplayNamesInDebts(to, message.guild),
          this._resolveDisplayNamesInDebts(from, message.guild)
        ]);
      }).then((results) => {
        const debtsToUser = results[0]
        const debtsFromUser = results[1];

        if (debtsToUser.length == 0 && debtsFromUser.length == 0) {
          message.channel.send('Caixa2: Nenhuma dívida aberta registrada para ' + message.member.displayName + '!');
          return;
        }

        // Let's accumulate a message into one string
        var final = "Caixa2: Resumo de " + message.member.displayName + ":\n";
        final += "\n";

        // Let's group the debts per-user before presenting:
        var fromUsers = {};
        var toUsers = {};

        // Accumulate 'from's and 'to's, every dictionary entry is the user ID,
        // with the dictionary values being arrays of the debts for the matching
        // user.
        fromUsers = _.groupBy(debtsToUser, (value) => value['from']);
        toUsers = _.groupBy(debtsFromUser, (value) => value['to']);

        // Let's fetch pending debts first, to display and allow the user to 
        // accept them:

        var toAccept = [];
        _.forOwn(toUsers, (debts, nick) => {
          toAccept = _.concat(toAccept, debts.filter((debt) => !debt.accepted));
        });

        // Sort by date
        // This is very important! If we don't, we cannot guarantee the ordering
        // when listing and then later on accepting debts by using simple indexes.
        _.sortBy(toAccept, (debt) => debt.created);

        if(toAccept.length > 0) {
          final += "Você tem dívidas pendentes para aceitar:\n";
          final += "\n";

          toAccept.forEach((debt, index) => {
            final += (index + 1) + ") ";
            final += this._formatDat$$Boyy(debt.ammount);
            final += " de " + debt.nick_to + ": ";
            final += "\"" + debt.description + "\"";
          });

          final += "\n";
          final += "Digite `/ubot caixa2 aceitar <n>` para aceitar a(s) dívida(s) acima.";
          final += "\n";
        }

        // fromUsers/toUsers are right now { '<nick>': Array<Debt>, '<nick2>': ... }
        // Turn them into one dictionary as follow:
        // debts = 
        //   { 
        //    '<nick>': {
        //      'debtsFrom': Array<Debt>, // Debts from <nick> to user
        //      'debtsTo': Array<Debt>,   // Debts from user to <nick>
        //      'totalFrom': <total debts from <nick> to user>,
        //      'totalTo': <total debts from user to to <nick>>,
        //      'balance': <totalFrom> - <totalTo>
        //     },
        //     ...
        //   }

        var debts = { };

        // Pre-populate first w/ empty values for all users that this user owes
        // to and is owed from.
        _.uniq(_.concat(_.keys(fromUsers), _.keys(toUsers))).forEach(nick => {
          debts[nick] = {
            'nick': nick, // We'll use this later when we 'array-fy' this dictionary
            'debtsFrom': [],
            'debtsTo': [],
            'totalFrom': 0,
            'totalTo': 0,
            'balance': 0
          };
        });
        
        _.forOwn(fromUsers, (debtsFrom, nick) => {
          debts[nick].debtsFrom = debtsFrom;
          debts[nick].totalFrom = this._getTotalSumOfDebts(debtsFrom);
          debts[nick].balance = debts[nick].totalFrom;
        });

        _.forOwn(toUsers, (debtsTo, nick) => {
          debts[nick].debtsTo = debtsTo;
          debts[nick].totalTo = this._getTotalSumOfDebts(debtsTo);
          debts[nick].balance += debts[nick].totalTo;
        });

        // Now, for printing, split the groups into two: One where balance > 0
        // (meaning other users owe to us), and another where balance < 0 (meaning
        // we owe them).
        const owingUs =  _.filter(debts, (value) => { value.balance > 0 });
        const weOweTo =  _.filter(debts, (value) => { value.balance < 0 });

        if (owingUs.length > 0) {
          let total = owingUs.reduce((total, debt) => total + debt['balance'], 0);

          final += "**Devendo** para "
          final += message.member.displayName
          final += " (total: " + this._formatDat$$Boyy(total) + "):\n";

          final += "\n";

          owingUs.forEach(function(debt) {
            final += this._formatDat$$Boyy(debt.balance);
            final += " de "
            final += "**" + nick + "**: ";
            final += this._getDebtBriefings(debt.debtsFrom);
          });
        }

        if (weOweTo.length > 0) {
          let total = weOweTo.reduce((total, debt) => total - debt['balance'], 0);

          final += "**Dívidas** de "
          final += message.member.displayName
          final += " (total: " + this._formatDat$$Boyy(total) + "):\n";

          final += "\n";

          weOweTo.forEach(function(debt) {
            final += this._formatDat$$Boyy(-debt.balance); // Negate to show as positive
            final += " para "
            final += "**" + debt.nick + "**: ";
            final += this._getDebtBriefings(debt.debtsTo);
          }, this);
        }

        message.channel.send(final);
      }).catch((error) => {
        message.channel.send('Deu merda!');
        console.log(error);
      });
  }

  /**
   * Resolves display names for the given debts against Discord.
   * Promise returns the same debt objects, but with new keys 'nick_from' and
   * 'nick_to' for the resolved display names.
   * 
   * @param {Array<object>} debts 
   * @param {Discord.Guild} guild
   * @returns {Promise<object>}
   */
  _resolveDisplayNamesInDebts(debts, guild) {
    var promises =
      debts.map((debt) => {
        const fromMember =
          guild
            .fetchMember(debt['from'])
            .then((member) => member.displayName)
            .catch(() => '<desconhecido>')
            .then(name => {
              debt['nick_from'] = name;
            });

        const toMember =
          guild.fetchMember(debt['to'])
            .then((member) => member.displayName)
            .catch(() => '<desconhecido>')
            .then(name => {
              debt['nick_to'] = name;
            });

        return Promise.all([fromMember, toMember]);
      }, this);

    return Promise.all(promises);
  }

  /**
   * From an array of debts, returns the description of them all separated by
   * commas and individually surrounded by quotes.
   * 
   * E.g.:
   * 
   *    "\"Debt 1\", \"Debt 2\"
   * 
   * @param {Array<any>} debts 
   * @returns {string}
   */
  _getDebtBriefings(debts) {
    return debts
      .map((debt) => "\"" + debt['description'] + "\"")
      .join(', ');
  }

  /**
   * Returns a value that states the total debt that a given user has to another
   * user.
   * 
   * A positive value indicates `fromUser` owes `toUser` the value ammount, and 
   * a negative value indicates `toUser` owes `fromUser`.
   * 
   * @param {string} user1 
   * @param {string} user2 
   * @returns {Promise<Number>}
   */
  _getTotalDebtBetween(user1, user2) {
    const queryOut = 
      datastore
        .createQuery('Debt')
        .filter('from', user1)
        .filter('to', user2);
    
    const queryIn =
      datastore
        .createQuery('Debt')
        .filter('from', user2)
        .filter('to', user1);

    return 
      Promise.all([datastore.runQuery(queryOut), datastore.runQuery(queryIn)])
        .then((results) => {
          return this._getTotalSumOfDebts(results[0][0], results[1][0]);
        });
  }

  /**
   * Returns a value that states the total debt that two sets of debts, one ingoing
   * and one outgoing (both must be between two users!) represent.
   * 
   * A positive value indicates a first user1 owes user2 the value ammount
   * (assuming all debts from `debtsIn` are from user1 -> user2, and `debtsOut`
   * are the inverse), and a negative value indicates user1 owes user2.
   * 
   * @param {Array<any>} debtsIn 
   * @param {Array<any>} debtsOut 
   * @returns {Number}
   */
  _getTotalSumOfDebts(debtsIn, debtsOut) {
    const totalOut = this._calculateTotal(debtsOut);
    const totalIn = this._calculateTotal(debtsIn);

    return totalIn - totalOut;
  }

  /** 
   * For counting total sum of ammounts in arrays of debts.
   * 
   * @param {Array<object>} debtsArray 
   * @returns Number
   */
  _calculateTotal(debtsArray) {
    return debtsArray.reduce((total, debt) => total + debt['ammount'], 0);
  };

  /**
   * @param {string} user
   * @returns {Promise<Array<any>>}
   */
  _getDebtsGoingFrom(user) {
    const query =
      datastore
        .createQuery('Debt')
        .filter('from', user);

    return datastore.runQuery(query);
  }

  /**
   * @param {string} user
   * @returns {Promise<Array<any>>}
   */
  _getDebtsGoingTo(user) {
    const query =
      datastore
        .createQuery('Debt')
        .filter('to', user);

    return datastore.runQuery(query);
  }

  /**
   * Adds a new debt record.
   * Automatically deals w/ total debt records.
   * 
   * @param {string} from User ID that debt originates from.
   * @param {string} to User ID that debt is owed to.
   * @param {number} ammount Ammount of debt money. 
   * @param {string} description A textual description for the debt, used to quickly
   * refer to the origin of a debt later on.
   */
  _recordDebt(from, to, ammount, description) {
    return this._ensureHasTotalDebtEntities(from, to)
      .then(() => {

      });
  }

  _formatDat$$Boyy(ammount) {
    return "R$ " + ammount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  }
}

module.exports = Caixa2Service;
