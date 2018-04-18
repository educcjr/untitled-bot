const request = require('request');

const post = (url, payload) => {
  return jsonRequest({
    method: 'POST',
    url,
    json: payload
  });
};

const get = (url) => {
  return jsonRequest({
    method: 'GET',
    url
  });
};

const jsonRequest = (configs) => {
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
};

module.exports = { get, post };
