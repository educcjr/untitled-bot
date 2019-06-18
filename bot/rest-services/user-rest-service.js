const requestHelper = require('./../../common/request-helper');

const USER_API_URL = `${process.env.API_PATH}/user`;

class UserService {
  create (discordId, name) {
    return requestHelper.post(USER_API_URL, { discordId, name });
  }

  list () {
    return requestHelper.get(USER_API_URL);
  }
}

module.exports = UserService;
