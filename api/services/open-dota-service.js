const requestHelper = require('./../../common/request-helper');

const API_PATH = 'https://api.opendota.com/api';

class OpenDotaService {
  async kdaMean (accountId, urlParams) {
    let result = await requestHelper.get(`${API_PATH}/players/${accountId}/histograms/kda${urlParams}`);

    let sum = 0;
    let length = 0;

    result
      .filter(r => r.games > 0)
      .map(r => {
        sum += (r.games * r.x);
        length += r.games;
      });

    let mean = sum / length;

    return mean.toString();
  }
}

module.exports = OpenDotaService;
