var express = require('express');
var router = express.Router();

const apiPath = 'https://api.opendota.com/api';

router.get('/:accountId/mean/kda', (req, res) => {
  let date = req.query.date ? `date=${req.query.date}` : '';

  let urlParams = `?${date}`;
  urlParams = urlParams.length > 1 ? urlParams : '';

  req.requestService.get(`${apiPath}/players/${req.params.accountId}/histograms/kda${urlParams}`)
    .then(result => {
      result = result.filter(r => r.games > 0);
      let sum = 0;
      let length = 0;
      result.map(r => {
        sum += (r.games * r.x);
        length += r.games;
      });
      let mean = sum / length;
      res.send(mean.toString());
    })
    .catch(err => res.status(500).send(err));
});

module.exports = router;
