import { FastifyInstance } from 'fastify';

import { tokenSchema } from '../token/dto/token.dto';
import { userGuard } from '../guards/user.guard';

import fuelService from './fuel.service';

const fuelController = (server: FastifyInstance, _, done) => {
  server.get('/', {
    schema: { ...tokenSchema, tags: ['Fuels'] },
    preValidation: userGuard,
    handler: () => fuelService.getFuels(),
  });

  done();
};

export default fuelController;
