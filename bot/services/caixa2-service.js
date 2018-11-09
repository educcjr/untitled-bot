// // import * as Discord from 'discord.js'; // For autocomplete
// // import * as UserService from './user-service.js';

// // const moment = require('moment');

// const _ = require('lodash');
// const Discord = require('discord.js');
// const Parser = require('../helpers/parser.js');

// const Datastore = require('@google-cloud/datastore');
// const gcpAuth = {
//   projectId: 'untitled-bot-174418',
//   credentials: require('./../../keyfile.json')
// };
// const datastore = Datastore(gcpAuth);

// /*
//  * Debt entity keys:
//  *
//  * {
//  *  "from": <user_id (Discord.GuildMember.id)>,
//  *  "to": <user_id (Discord.GuildMember.id)>,
//  *  "description": String,
//  *  "ammount": Number,
//  *  "accepted": Boolean,
//  *  "created": Date
//  * }
//  */

// class Caixa2Service {
//   /**
//    *
//    * @param {Discord.Client} client
//    */
//   constructor (client) {
//     this.client = client;
//   }

//   /**
//    * @param {Array<string>} splittedCommand Original chat line command, split in
//    * spaces, with no `/bot`, e.g.: `caixa2 20 para vitão: da gasolina.`
//    * @param {Discord.Message} message Original message
//    */
//   process (splittedCommand, message) {
//     // Empty command- just list user's ownings
//     if (splittedCommand.length === 1) {
//       this.listOwningsShort(message.member, message);
//       return;
//     }

//     if (splittedCommand.length === 2) {
//       switch (splittedCommand[1]) {
//         case 'ajuda':
//           this.describeDebtCommand(message);
//           break;
//         case 'nova':
//         case 'novas':
//           this.listDebtsPendingToBeAccepted(message.member, message);
//           break;
//         default:
//           message.channel.send('Tendi foi é nada.');
//       }
//       return;
//     }

//     if (splittedCommand.length === 3) {
//       switch (splittedCommand[1]) {
//         case 'aceitar':
//           this.processPendingDebtMessage(message.member, message, /* toAccept: */ true);
//           return;
//         case 'recusar':
//           this.processPendingDebtMessage(message.member, message, /* toAccept: */ false);
//           return;
//       }
//     }

//     /*
//      * Debt entity keys:
//      *
//      * {
//      *  "from": <user_id (Discord.GuildMember.id)>,
//      *  "to": <user_id (Discord.GuildMember.id)>,
//      *  "description": String,
//      *  "ammount": Number,
//      *  "accepted": Boolean,
//      *  "created": Date
//      * }
//      */

//     try {
//       const parser = new Parser(splittedCommand.join(' '), true);

//       parser.nextIdent(); // Ignore, it's the 'caixa2' or '$' command.

//       const ammount = parser.nextFloat();

//       // Fetch way specifier
//       const way = parser.validateNextIdent(ident => ident === 'de' || ident === 'para');

//       // Only one mention per comment!
//       if (message.mentions.members.array().length < 1) {
//         throw Error();
//       }
//       const user = message.mentions.members.array()[0];

//       // Match user mention
//       parser.nextRegex(Discord.MessageMentions.USERS_PATTERN);

//       // Make ':' optional
//       parser.skipWhitespace();
//       if (!parser.isEoF() && parser.peek() === ':') {
//         parser.next();
//       }

//       // Now, the description!
//       const description = parser.remaining();

//       if (description.length === 0) {
//         message.channel.send('E a descrição da dívida?');
//         return;
//       }

//       const isSenderOwing = way === 'para';

//       this.recordDebt(
//         isSenderOwing ? message.author.id : user.id,
//         isSenderOwing ? user.id : message.author.id,
//         ammount, description, way === 'para')
//         .then(() => {
//           message.channel.send('Dívida de ' + this.formatDat$$Boyy(ammount) + ' registrada com sucesso!');
//         })
//         .catch((error) => {
//           message.channel.send('Deu merda!');
//           console.log(error);
//         });
//     } catch (error) {
//       console.log(error);
//       message.channel.send('Não entendi nada!');
//       this.describeDebtCommand(message);
//     }
//   }

//   describeDebtCommand (message) {
//     var final = '';

//     final += 'Dívidas se registram assim:\n';

//     final += '`/ubot $ 30 [de/para] @duderas: Os 30 conto do churrasco, lesk! -xoxo`\n';
//     final += '`/ubot $ 30 [de/para] @duderas: Os 30 conto do churrasco, lesk! -xoxo`\n';
//     final += 'Se escrever `30 de @fulano`, a dívida é de `@fulano` até você, e precisa ser confirmada\n';
//     final += 'Se escrever `30 para @fulano`, a dívida é sua para `@fulano`, e não precisa ser confirmada!';

//     message.channel.send(final);
//   }

//   /**
//    * @param {Discord.GuildMember} member
//    * @param {Discord.Message} message
//    */
//   listDebtsPendingToBeAccepted (member, message) {
//     const userId = member.user.id;

//     this.getDebtsGoingFrom(userId)
//       .then(results => this.resolveDisplayNamesInDebts(results[0], message.guild))
//       .then(debtsFromSender => {
//         var toAccept = debtsFromSender.filter((debt) => !debt.accepted && debt.from === userId);

//         if (toAccept.length === 0) {
//           message.channel.send('Caixa2: Nenhuma dívida pendente para ' + message.member.displayName + '!');
//           return;
//         }

//         // Sort by date
//         // This is very important! If we don't, we cannot guarantee the ordering
//         // when listing and then later on accepting debts by using simple indexes.
//         _.sortBy(toAccept, (debt) => debt.created);

//         this.messagePendingDebtsToAccept(toAccept, message);
//       });
//   }

//   /**
//    * @param {Discord.GuildMember} member
//    * @param {Discord.Message} message
//    * @param {Boolean} accepting
//    */
//   processPendingDebtMessage (member, message, accepting) {
//     const slices = message.content.split(' ');
//     // slices: [ '/ubot', 'caixa2', 'aceitar'/'recusar', 1 ];

//     const index = Number.parseInt(slices[3]) - 1; // Start from 0

//     // Get number of opened debts remaining
//     const userId = member.user.id;

//     this.getDebtsGoingFrom(userId)
//       .then(results => this.resolveDisplayNamesInDebts(results[0], message.guild))
//       .then(debtsFromSender => {
//         /** @type {Array<any>} */
//         var toAccept = debtsFromSender.filter((debt) => !debt.accepted && debt.from === userId);

//         // Sort by date
//         // This is very important! If we don't, we cannot guarantee the ordering
//         // when listing and then later on accepting debts by using simple indexes.
//         _.sortBy(toAccept, (debt) => debt.created);

//         if (index < 0 || index >= toAccept.length) {
//           message.channel.send('Número de dívida pendente inválido!');

//           if (toAccept.length > 0) {
//             this.messagePendingDebtsToAccept(toAccept, message);
//           }

//           throw new Error('Cancel');
//         }

//         // Accept (or reject)!
//         const debt = toAccept[index];

//         if (accepting) {
//           if (accepting) {
//             debt.accepted = true;
//           }

//           const entity = {
//             key: debt[Datastore.KEY],
//             entity: debt
//           };
//           debt.accepted = true;
//           return datastore.update(entity).then(() => debt);
//         } else {
//           return datastore.delete(debt[Datastore.KEY]).then(() => debt);
//         }
//       }).then(entity => {
//         // Just for funzzies, append a random tidbit at the end of the messages
//         const bitsAccept = [
//           'Bem vindo ao círculo interminável do capitalismo!',
//           'Melhor já arranjar um segundo turno no trabalho!',
//           'Juros: de 0% até seja-lá-a-paciência-do-' + entity.nick_to + '%!',
//           'Melhor pagar essa porra, hein :3'
//         ];
//         const bitsReject = [
//           'Tá certo! Seja mais frugal (ou caloteiro)!',
//           'Nada como não ter dívidas e ter a consciência limpa! Espero que um dia você consiga saber o que é isso!',
//           'Um assassino de aluguel já foi encomendado para recolher a dívida!'
//         ];

//         if (accepting) {
//           message.channel.send('Dívida aceita com sucesso! ' + _.shuffle(bitsAccept)[0]);
//         } else {
//           message.channel.send('Dívida recusada com sucesso! ' + _.shuffle(bitsReject)[0]);
//         }
//       }).catch(error => {
//         if (message === 'Cancel') {
//           return;
//         }
//         message.channel.send('Merdo tudo! Chama os dev!');
//         console.log(error);
//       });
//   }

//   /**
//    * @param {Discord.GuildMember} member
//    * @param {Discord.Message} message
//    */
//   listOwningsShort (member, message) {
//     const userId = member.user.id;

//     Promise
//       .all([this.getDebtsGoingTo(userId), this.getDebtsGoingFrom(userId)])
//       .then((results) => {
//         const to = results[0][0];
//         const from = results[1][0];

//         // Resolve display names from each side
//         return Promise.all([
//           this.resolveDisplayNamesInDebts(to, message.guild),
//           this.resolveDisplayNamesInDebts(from, message.guild)
//         ]);
//       }).then((results) => {
//         const debtsToSender = results[0];
//         const debtsFromSender = results[1];

//         if (debtsToSender.length === 0 && debtsFromSender.length === 0) {
//           message.channel.send('Caixa2: Nenhuma dívida aberta registrada para ' + message.member.displayName + '!');
//           return;
//         }

//         // Let's accumulate a message into one string
//         var final = 'Caixa2: Resumo de ' + message.member.displayName + ':\n';
//         final += '\n';

//         // Let's group the debts per-user before presenting:
//         var fromUsers = {};
//         var toUsers = {};

//         // Accumulate 'from's and 'to's, every dictionary entry is the user ID,
//         // with the dictionary values being arrays of the debts for the matching
//         // user.
//         fromUsers = _.groupBy(debtsToSender.filter((debt) => debt.accepted), (value) => value['from']);
//         toUsers = _.groupBy(debtsFromSender.filter((debt) => debt.accepted), (value) => value['to']);

//         // Let's fetch pending debts first, to display and allow the user to
//         // accept them:

//         var toAccept = debtsFromSender.filter((debt) => !debt.accepted && debt.from === userId);

//         // Sort by date
//         // This is very important! If we don't, we cannot guarantee the ordering
//         // when listing and then later on accepting debts by using simple indexes.
//         _.sortBy(toAccept, (debt) => debt.created);

//         if (toAccept.length > 0) {
//           final += 'Você tem dívidas pendentes para aceitar:\n';
//           final += '\n';

//           toAccept.forEach((debt, index) => {
//             final += (index + 1) + ') ';
//             final += this.formatDat$$Boyy(debt.ammount);
//             final += ' de ' + debt.nick_to + ': ';
//             final += '"' + debt.description + '"';
//             final += '\n';
//           });

//           final += '\n';
//           final += 'Digite `/ubot caixa2 aceitar <n>` para aceitar a(s) dívida(s) acima.\n';
//           final += '\n';
//         }

//         // fromUsers/toUsers are right now { '<nick>': Array<Debt>, '<nick2>': ... }
//         // Turn them into one dictionary as follow:
//         // debts =
//         //   {
//         //    '<nick>': {
//         //      'debtsFrom': Array<Debt>, // Debts from <nick> to user
//         //      'debtsTo': Array<Debt>,   // Debts from user to <nick>
//         //      'totalFrom': <total debts from <nick> to user>,
//         //      'totalTo': <total debts from user to to <nick>>,
//         //      'balance': <totalFrom> - <totalTo>
//         //     },
//         //     ...
//         //   }

//         var debts = {};

//         // Pre-populate first w/ empty values for all users that this user owes
//         // to and is owed from.
//         _.uniq(_.concat(_.keys(fromUsers), _.keys(toUsers))).forEach(nick => {
//           debts[nick] = {
//             'nick': nick, // We'll use this later when we 'array-fy' this dictionary
//             'debtsFrom': [],
//             'debtsTo': [],
//             'totalFrom': 0,
//             'totalTo': 0,
//             'balance': 0
//           };
//         });

//         _.forOwn(fromUsers, (debtsFrom, nick) => {
//           debts[nick].nick = debtsFrom[0].nick_from;
//           debts[nick].debtsFrom = debtsFrom;
//           debts[nick].totalFrom = this.calculateTotal(debtsFrom);
//           debts[nick].balance += debts[nick].totalFrom;
//         });

//         _.forOwn(toUsers, (debtsTo, nick) => {
//           debts[nick].nick = debtsTo[0].nick_to;
//           debts[nick].debtsTo = debtsTo;
//           debts[nick].totalTo = this.calculateTotal(debtsTo);
//           debts[nick].balance -= debts[nick].totalTo;
//         });

//         // Now, for printing, split the groups into two: One where balance > 0
//         // (meaning other users owe to us), and another where balance < 0 (meaning
//         // we owe them).
//         const owingUs = _.filter(debts, (value) => value.balance > 0);
//         const weOweTo = _.filter(debts, (value) => value.balance < 0);

//         if (owingUs.length > 0) {
//           let total = owingUs.reduce((total, debt) => total + debt['balance'], 0);

//           final += '**Devendo** para ';
//           final += message.member.displayName;
//           final += ' (total: ' + this.formatDat$$Boyy(total) + '):\n';

//           final += '\n';

//           owingUs.forEach(function (debt) {
//             const rem = this.returnUnpaidDebts(debt.debtsFrom, debt.debtsTo)[0];

//             final += this.formatDat$$Boyy(debt.balance);
//             final += ' de ';
//             final += '**' + debt.nick + '**: ';
//             final += this.getDebtBriefings(rem);
//             final += '\n';
//           }, this);

//           final += '\n';
//         }

//         if (weOweTo.length > 0) {
//           let total = weOweTo.reduce((total, debt) => total - debt['balance'], 0);

//           final += '**Dívidas** de ';
//           final += message.member.displayName;
//           final += ' (total: ' + this.formatDat$$Boyy(total) + '):\n';

//           final += '\n';

//           weOweTo.forEach(function (debt) {
//             const rem = this.returnUnpaidDebts(debt.debtsFrom, debt.debtsTo)[1];

//             final += this.formatDat$$Boyy(-debt.balance); // Negate to show as positive
//             final += ' para ';
//             final += '**' + debt.nick + '**: ';
//             final += this.getDebtBriefings(rem);
//             final += '\n';
//           }, this);
//         }

//         message.channel.send(final);
//       }).catch((error) => {
//         message.channel.send('Deu merda!');
//         console.log(error);
//       });
//   }

//   /**
//    * Resolves display names for the given debts against Discord.
//    * Promise returns the same debt objects, but with new keys 'nick_from' and
//    * 'nick_to' for the resolved display names.
//    *
//    * @param {Array<object>} debts
//    * @param {Discord.Guild} guild
//    * @returns {Promise<object>}
//    */
//   resolveDisplayNamesInDebts (debts, guild) {
//     var promises =
//       debts.map((debt) => {
//         const fromMember =
//           guild
//             .fetchMember(debt['from'])
//             .then((member) => member.displayName)
//             .catch(() => '<desconhecido>')
//             .then(name => {
//               debt['nick_from'] = name;
//               return debt;
//             });

//         const toMember =
//           guild.fetchMember(debt['to'])
//             .then((member) => member.displayName)
//             .catch(() => '<desconhecido>')
//             .then(name => {
//               debt['nick_to'] = name;
//               return debt;
//             });

//         return Promise.all([fromMember, toMember]).then(() => debt);
//       }, this);

//     return Promise.all(promises);
//   }

//   /**
//    * From an array of debts, returns the description of them all separated by
//    * commas and individually surrounded by quotes.
//    *
//    * E.g.:
//    *
//    *    "\"Debt 1\", \"Debt 2\"
//    *
//    * @param {Array<any>} debts
//    * @returns {string}
//    */
//   getDebtBriefings (debts) {
//     return debts
//       .map((debt) => '"' + debt['description'] + '"')
//       .join(', ');
//   }

//   /**
//    * Given two array of debts (between two users), returns a reduced set of debts
//    * such that only debts that where not compensated yet show up.
//    *
//    * The method uses the smallest total debt ammount between the two users and
//    * uses that to figure out which debts must have been paid already from the
//    * ammount that each user owes still.
//    *
//    * Ex (debts are automatically sorted by date, from earliest -> latest):
//    *
//    * ```
//    * [       100 debt        ][40 debt][10]  - User 1 debts to User 2 = 150 total
//    * [  50 debt  ][40 debt][ 20 ]            - User 2 debts to User 1 = 110 total
//    * ```
//    *
//    * The smallest debt total is from User 2 to User 1, 110, so all debts from the
//    * two arrays counting up to 110 are removed:
//    *
//    * ```
//    * [        110 smallest      ]
//    * [       100 debt        ][40 debt][10]
//    * [  50 debt  ][40 debt][ 20 ]
//    *                            ^
//    * ```
//    *  All debts that end left from here are cut out, leaving out:
//    *
//    * ```
//    * [40 debt][10] - User 1 debts to User 2: total 50
//    * None!         - User 2 debts to User 1: total 0!
//    * ```
//    *
//    * These are to be understood as the pending debts between the two users that
//    * have not yet been fully compensated, so user 1 has two uncompensated debts
//    * to user 2.
//    *
//    * Use this method to verify debts that are pending- for precise total of debts
//    * (which account for values instead of whole debts), use `getTotalSumOfDebts`.
//    *
//    * @param {Array<any>} inDebts
//    * @param {Array<any>} outDebts
//    * @param {Array<Array<any>>}
//    */
//   returnUnpaidDebts (inDebts, outDebts) {
//     // Special cases
//     // No debts at all
//     if (inDebts.length === 0 && outDebts.length === 0) {
//       return [[], []];
//     }
//     // User 1 has all debts to User 2
//     if (inDebts.length === 0) {
//       return [[], outDebts];
//     }
//     // User 2 has all debts to User 1
//     if (outDebts.length === 0) {
//       return [inDebts, []];
//     }

//     const total1 = this.calculateTotal(inDebts);
//     const total2 = this.calculateTotal(outDebts);

//     // Users are even!
//     if (total1 === total2) {
//       return [[], []];
//     }

//     /**
//      * @param {Array<any>} debts
//      * @param {Number} upTo
//      * @returns {Array<any>}
//      */
//     function allDebtsUpTo (debts, upTo) {
//       var total = 0;
//       for (var i = 0; i < debts.length; i++) {
//         var debt = debts[i];
//         if (total + debt.ammount > upTo) {
//           return debts.slice(i);
//         }
//         total += debt.ammount;
//       }
//       return debts; // All debts ammount to < upTo!
//     }

//     if (total1 > total2) {
//       // User 1 owes more to user 2
//       return [allDebtsUpTo(inDebts, total2), []];
//     } else {
//       // User 2 owes more to user 1
//       return [[], allDebtsUpTo(outDebts, total1)];
//     }
//   }

//   /**
//    * Returns a value that states the total debt that a given user has to another
//    * user.
//    *
//    * A positive value indicates `fromUser` owes `toUser` the value ammount, and
//    * a negative value indicates `toUser` owes `fromUser`.
//    *
//    * @param {string} user1
//    * @param {string} user2
//    * @returns {Promise<Number>}
//    */
//   getTotalDebtBetween (user1, user2) {
//     const queryOut =
//       datastore
//         .createQuery('Debt')
//         .filter('from', user1)
//         .filter('to', user2);

//     const queryIn =
//       datastore
//         .createQuery('Debt')
//         .filter('from', user2)
//         .filter('to', user1);

//     return Promise.all([datastore.runQuery(queryOut), datastore.runQuery(queryIn)])
//       .then((results) => {
//         return this.getTotalSumOfDebts(results[0][0], results[1][0]);
//       });
//   }

//   /**
//    * Returns a value that states the total debt that two sets of debts, one ingoing
//    * and one outgoing (both must be between two users!) represent.
//    *
//    * A positive value indicates a first user1 owes user2 the value ammount
//    * (assuming all debts from `debtsIn` are from user1 -> user2, and `debtsOut`
//    * are the inverse), and a negative value indicates user1 owes user2.
//    *
//    * @param {Array<any>} debtsIn
//    * @param {Array<any>} debtsOut
//    * @returns {Number}
//    */
//   getTotalSumOfDebts (debtsIn, debtsOut) {
//     const totalOut = this.calculateTotal(debtsOut);
//     const totalIn = this.calculateTotal(debtsIn);

//     return totalIn - totalOut;
//   }

//   /**
//    * For counting total sum of ammounts in arrays of debts.
//    *
//    * @param {Array<object>} debtsArray
//    * @returns Number
//    */
//   calculateTotal (debtsArray) {
//     return debtsArray.reduce((total, debt) => total + debt['ammount'], 0);
//   }

//   /**
//    * @param {string} user
//    * @returns {Promise<Array<any>>}
//    */
//   getDebtsGoingFrom (user) {
//     const query =
//       datastore
//         .createQuery('Debt')
//         .filter('from', user);

//     return datastore.runQuery(query);
//   }

//   /**
//    * @param {string} user
//    * @returns {Promise<Array<any>>}
//    */
//   getDebtsGoingTo (user) {
//     const query =
//       datastore
//         .createQuery('Debt')
//         .filter('to', user);

//     return datastore.runQuery(query);
//   }

//   /**
//    * Adds a new debt record.
//    * Automatically deals w/ total debt records.
//    *
//    * @param {string} from User ID that debt originates from.
//    * @param {string} to User ID that debt is owed to.
//    * @param {number} ammount Ammount of debt money.
//    * @param {string} description A textual description for the debt, used to quickly
//    * refer to the origin of a debt later on.
//    * @param {Booolean} accepted Whether the debt is accepted by the owing party.
//    * @returns {Promise<Void>}
//    */
//   recordDebt (from, to, ammount, description, accepted) {
//     const debt = {
//       'from': from,
//       'to': to,
//       'description': description,
//       'ammount': ammount,
//       'accepted': accepted,
//       'created': new Date()
//     };

//     const entity = {
//       'key': datastore.key('Debt'),
//       'data': debt
//     };

//     return datastore.insert(entity);
//   }

//   messagePendingDebtsToAccept (toAccept, message) {
//     var final = '';
//     final += 'Dívidas pendentes para aceitar:\n';
//     final += '\n';
//     toAccept.forEach((debt, index) => {
//       final += (index + 1) + ') ';
//       final += this.formatDat$$Boyy(debt.ammount);
//       final += ' de ' + debt.nick_to + ': ';
//       final += '"' + debt.description + '"';
//       final += '\n';
//     }, this);
//     final += '\n';
//     final += 'Digite `/ubot caixa2 aceitar/recusar <n>` para aceitar/recusar a(s) dívida(s) acima.\n';
//     final += '\n';

//     message.channel.send(final);
//   }

//   /**
//    * Formats a Number value into a R$ XX,XX string.
//    * @param {number} ammount
//    * @returns {string}
//    */
//   formatDat$$Boyy (ammount) {
//     return 'R$ ' + ammount.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+,)/g, '$1.');
//   }
// }

// module.exports = Caixa2Service;
