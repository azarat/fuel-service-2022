import { FastifyInstance } from 'fastify';

import { tokenSchema } from '../token/dto/token.dto';
import { userGuard } from '../guards/user.guard';

import fuelService from './fuel.service';

const fuelController = (server: FastifyInstance, _, done) => {
  // CHECKING
  server.get('/', {
    schema: { ...tokenSchema, tags: ['Fuels'] },
    preValidation: userGuard,
    handler: async (req, res) => {
      const fuels = await fuelService.getFuels()
      console.log(fuels[0].fuels, "fuels");
      
      return res.status(200).send(fuels);
    },
  });

  server.get('/history', {
    schema: { ...tokenSchema, tags: ['Fuels'] },
    preValidation: userGuard,
    handler: async (req, res) => {
      const fuelHistory = await fuelService.getFuelHistory()
      console.log(fuelHistory, "fuelHistory");
      
      return res.status(200).send(fuelHistory);
    },
  });

  server.get('/balance', {
    schema: { ...tokenSchema, tags: ['Fuels'] },
    preValidation: userGuard,
    handler: async (req, res) => {
      const balance = await fuelService.getBalance()
      console.log(balance, "balance");
      
      return res.status(200).send(balance);
    },
  });

  done();
};

export default fuelController;
