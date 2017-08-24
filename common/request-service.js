const request = require('request');

class RequestService {
  post (path, payload) {
    return this.request({
      method: 'POST',
      url: path,
      json: payload
    });
  }

  get (path) {
    return this.request({
      method: 'GET',
      url: path
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

module.exports = RequestService;
