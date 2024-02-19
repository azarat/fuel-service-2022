import { FastifyInstance } from 'fastify';

import { BalanceRefillDto } from '../fuel/dto/balance-refill.dto';
import { TokenHeadersDto, tokenSchema, TokenUuidHeadersDto, tokenUuidSchema } from '../token/dto/token.dto';
import { userGuard, userUuidGuard } from '../guards/user.guard';
import { Body, Headers } from '../types';

import fuelService from './fuel.service';
import { TokenService } from '../../src/token/token.service';
import { MobistaRequest, MobistaTokenUuidHeadersDto } from './dto/mobista-request.dto';

const fuelController = (server: FastifyInstance, _, done) => {
  server.get<Headers<TokenUuidHeadersDto>>('/', {
    schema: { ...tokenUuidSchema, tags: ['Fuels'] },
    preValidation: userUuidGuard,
    handler: async (req, res) => {
      const fuels = await fuelService.getFuels(req.headers['token-monobrand'])
      // console.log(JSON.stringify(fuels), "fuels");
      
      return res.status(200).send(fuels);
    },
  });

  server.get<Headers<TokenUuidHeadersDto>>('/history', {
    schema: { ...tokenUuidSchema, tags: ['Fuels'] },
    preValidation: userUuidGuard,
    handler: async (req, res) => {
      const fuelHistory = await fuelService.getFuelHistory(req.headers['token-monobrand'])
      // console.log(fuelHistory, "fuelHistory");
      
      return res.status(200).send(fuelHistory);
    },
  });

  server.get<Headers<TokenUuidHeadersDto>>('/balance', {
    schema: { ...tokenUuidSchema, tags: ['Fuels'] },
    preValidation: userUuidGuard,
    handler: async (req, res) => {      
      const balance = await fuelService.getBalance(req.headers['token-monobrand'])
      // console.log(balance.data, "balance");
      
      return res.status(200).send({balance});
    },
  });
  
  server.post<Headers<TokenUuidHeadersDto> & Body<BalanceRefillDto>>('/balance/refill', {
    schema: { ...tokenUuidSchema, tags: ['Fuels'] },
    preValidation: userUuidGuard,
    handler: async (req, res) => {
      const balanceRefillUrl = await fuelService.getBalanceRefillUrl(req.headers['token-monobrand'], req.body)
      // console.log(balanceRefillUrl, "balanceRefillUrl");
      
      return res.status(200).send({uri: balanceRefillUrl});
    },
  });

  server.post<Headers<MobistaTokenUuidHeadersDto> & Body<MobistaRequest>>('/mobista/request', {
    schema: { ...tokenUuidSchema, tags: ['Fuels'] },
    preValidation: userUuidGuard,
    handler: async (req, res) => {
      const requestDelivery = await fuelService.requestDelivery(req.body)
      
      return res.status(200).send({status: "ok"});
    },
  });

  server.get<Headers<MobistaTokenUuidHeadersDto>>('/mobista/fuels', {
    schema: { ...tokenUuidSchema, tags: ['Fuels'] },
    preValidation: userUuidGuard,
    handler: async (req, res) => {
      const mobistaFuels = await fuelService.getMobistaFuels()
      
      return res.status(200).send({status: "ok", fuels: mobistaFuels});
    },
  });

  done();
};

export default fuelController;
