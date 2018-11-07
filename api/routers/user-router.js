const express = require('express');

class UserRouter {
  constructor (userService) {
    this.userService = userService;
  }

  router () {
    const router = express.Router();

    router.get('/', async (req, res) => {
      try {
        res.send(await this.userService.getAll());
      } catch (err) {
        res.sendError(err);
      }
    });

    router.post('/', async (req, res) => {
      try {
        let { discordId, name } = req.body;

        if (!discordId || !name) {
          throw new Error('Nome do usuário ou discordId não foi enviado.');
        }

        res.send(await this.userService.createOrUpdate({ discordId, name }));
      } catch (err) {
        res.sendError(err);
      }
    });

    router.delete('/:discordId', async (req, res) => {
      try {
        res.send(await this.userService.delete(req.params.discordId));
      } catch (err) {
        res.sendError(err);
      }
    });

    return router;
  }
}

module.exports = UserRouter;
