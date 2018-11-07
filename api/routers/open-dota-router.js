const express = require('express');

class OpenDotaRouter {
  constructor (openDotaService) {
    this.openDotaService = openDotaService;
  }

  router () {
    const router = express.Router();

    router.get('/:accountId/mean/kda', async (req, res) => {
      try {
        let accountId = req.params.accountId;

        let date = req.query.date ? `date=${req.query.date}` : '';

        let urlParams = `?${date}`;
        urlParams = urlParams.length > 1 ? urlParams : '';

        res.send(await this.openDotaService.kdaMean(accountId, urlParams));
      } catch (err) {
        res.sendError(err);
      }
    });

    return router;
  }
}

module.exports = OpenDotaRouter;
