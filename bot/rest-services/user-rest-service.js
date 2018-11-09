const requestHelper = require('./../../common/request-helper');

const appConfigs = require('./../../app-configs');

const USER_API_URL = `${appConfigs.API_PATH}/user`;

class UserService {
  create (discordId, name) {
    return requestHelper.post(USER_API_URL, { discordId, name });
  }

  list () {
    return requestHelper.get(USER_API_URL);
  }
}

module.exports = UserService;
