const request = require('request');

class UserService {
  constructor (apiPath) {
    this.apiPath = apiPath;
  }

  add (user) {
    return this.request({
      method: 'POST',
      url: this.apiPath + '/user',
      json: user
    });
  }

  list () {
    return this.request({
      method: 'GET',
      url: this.apiPath + '/user'
    });
  }

  request (configs) {
    configs.json = configs.json ? configs.json : true;
    return new Promise((resolve, reject) => {
      request(configs, (error, response, body) => {
        if (!error) {
          if (response.statusCode === 200) {
            resolve(body);
          } else {
            reject(response);
          }
        } else {
          reject(error);
        }
      });
    });
  }
}

module.exports = UserService;
