const _ = require('lodash');

function commandMatches(command, group) {
    if (_.isString(group)) {
        return group == command;
    }
    // Match any in array
    if (_.isArray(group)) {
        return group.indexOf(command) != -1;
    }

    console.log('Expected group to be either string or array, received ' + typeof (group) + ' instead.');

    return false;
}

module.exports = { commandMatches: commandMatches }
