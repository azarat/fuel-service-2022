import { FastifyInstance } from 'fastify';

import { BalanceRefillDto } from '../fuel/dto/balance-refill.dto';
import { TokenHeadersDto, tokenSchema, TokenUuidHeadersDto, tokenUuidSchema } from '../token/dto/token.dto';
import { userGuard, userUuidGuard } from '../guards/user.guard';
import { Body, Headers } from '../types';

import fuelService from './fuel.service';

const fuelController = (server: FastifyInstance, _, done) => {
  server.get<Headers<TokenHeadersDto>>('/', {
    schema: { ...tokenSchema, tags: ['Fuels'] },
    preValidation: userGuard,
    handler: async (req, res) => {
      const fuels = await fuelService.getFuels()
      console.log(fuels[0].fuels, "fuels");
      
      return res.status(200).send(fuels);
    },
  });

  server.get<Headers<TokenUuidHeadersDto>>('/history', {
    schema: { ...tokenUuidSchema, tags: ['Fuels'] },
    preValidation: userUuidGuard,
    handler: async (req, res) => {
      const fuelHistory = await fuelService.getFuelHistory(req.headers['token-monobrand'])
      console.log(fuelHistory, "fuelHistory");
      
      return res.status(200).send(fuelHistory);
    },
  });

  server.get<Headers<TokenUuidHeadersDto>>('/balance', {
    schema: { ...tokenUuidSchema, tags: ['Fuels'] },
    preValidation: userUuidGuard,
    handler: async (req, res) => {
      const balance = await fuelService.getBalance(req.headers['token-monobrand'])
      console.log(balance, "balance");
      
      return res.status(200).send({balance});
    },
  });
  
  server.post<Headers<TokenUuidHeadersDto> & Body<BalanceRefillDto>>('/balance/refill', {
    schema: { ...tokenUuidSchema, tags: ['Fuels'] },
    preValidation: userUuidGuard,
    handler: async (req, res) => {
      const balanceRefillUrl = await fuelService.getBalanceRefillUrl(req.headers['token-monobrand'], req.body)
      console.log(balanceRefillUrl, "balanceRefillUrl");
      
      return res.status(200).send({uri: balanceRefillUrl});
    },
  });

  done();
};

export default fuelController;
