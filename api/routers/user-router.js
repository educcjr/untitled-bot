const express = require('express');

const UserService = require('./../services/user-service');

class UserRouter {
  constructor (userRepository) {
    this.userService = new UserService(userRepository);
  }

  router () {
    const router = express.Router();

    router.post('/', async (req, res) => {
      try {
        let { id: discordId, name } = req.body;

        if (!discordId || !name) {
          throw new Error('Nome do usuário ou discordId não foi enviado.');
        }

        let createOrUpdateResult = await this.userService.createOrUpdate(discordId, name);

        return res.send(createOrUpdateResult);
      } catch (err) {
        return res.sendError(err);
      }
    });

    router.get('/', async (req, res) => {
      try {
        let users = await this.userService.getAll();
        return res.send(users);
      } catch (err) {
        return res.sendError(err);
      }
    });

    router.delete('/:id', async (req, res) => {
      try {
        let key = await this.userService.delete(req.params.id);
        return res.send(key);
      } catch (err) {
        return res.sendError(err);
      }
    });

    return router;
  }
}

module.exports = UserRouter;
