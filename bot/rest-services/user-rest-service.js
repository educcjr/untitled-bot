const requestHelper = require('./../../common/request-helper');

class UserService {
  constructor (apiPath) {
    this.url = apiPath + '/user';
  }

  create (id, name) {
    return requestHelper.post(this.url, { id, name });
  }

  list () {
    return requestHelper.get(this.url);
  }
}

module.exports = UserService;
