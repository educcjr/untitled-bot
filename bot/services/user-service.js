const request = require('request');

class UserService {
  constructor (apiPath) {
    this.apiPath = apiPath;
  }

  add (user) {
    request({
      method: 'POST',
      url: this.apiPath + '/user',
      json: user
    }, (error, response, body) => {
      if (error) {
        console.log('response: ' + response);
        console.log('error: ' + error);
      }
    });
  }
}

module.exports = UserService;
