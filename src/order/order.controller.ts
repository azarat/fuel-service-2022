import { FastifyInstance } from 'fastify';
import { userGuard } from '../guards/user.guard';

import { TokenHeadersDto, tokenSchema } from '../token/dto/token.dto';
import { Body, Headers } from '../types';
import {
  CallbackOrderDto,
} from './dto/callback-order.dto';
import { CreateOrderDto, createOrderSchema } from './dto/create-order.dto';
import orderService from './order.service';

const orderController = (server: FastifyInstance, _, done) => {
  server.post<Headers<TokenHeadersDto> & Body<CreateOrderDto>>('/', {
    schema: { ...createOrderSchema, tags: ['Order'] },
    preValidation: userGuard,
    handler: (req) => orderService.order(req.headers.token, req.body),
  });

  server.get<Headers<TokenHeadersDto>>('/', {
    schema: { ...tokenSchema, tags: ['Order'] },
    preValidation: userGuard,
    handler: (req) => orderService.getOrders(req.headers.token),
  });

  server.post<Body<CallbackOrderDto>>('/callback', {
    schema: { hide: true },
    handler: (req, res) => {
      orderService.callbackOrder(req.body);
      res.status(200).send();
    },
  });

  done();
};

export default orderController;
