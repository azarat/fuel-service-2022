import { FastifyInstance } from 'fastify';
import { userGuard } from '../guards/user.guard';

import { TokenHeadersDto, tokenSchema } from '../token/dto/token.dto';
import { GenerateQrDto } from '../order/dto/generate-qr.dto';
import { Body, Headers } from '../types';
import {
  CallbackOrderDto,
} from './dto/callback-order.dto';
import { CreateOrderDto, createOrderSchema } from './dto/create-order.dto';
import orderService from './order.service';

const orderController = (server: FastifyInstance, _, done) => {
  server.post<Headers<TokenHeadersDto> & Body<GenerateQrDto>>('/qr', {
    schema: { tags: ['Order'] },
    // preValidation: userGuard,
    handler: async (req, res) => {
      const qr = await orderService.getQrData(req.body)
      console.log(qr, "qr");
      
      return res.status(200).send(qr);
    },
  });

  // NOT CHECKED
  // DEPRECATED
  server.post<Headers<TokenHeadersDto> & Body<CreateOrderDto>>('/', {
    schema: { ...createOrderSchema, tags: ['Order'] },
    preValidation: userGuard,
    handler: (req) => orderService.order(req.headers.token, req.body),
  });

  // NOT CHECKED
  // DEPRECATED
  server.get<Headers<TokenHeadersDto>>('/', {
    schema: { ...tokenSchema, tags: ['Order'] },
    preValidation: userGuard,
    handler: (req) => orderService.getOrders(req.headers.token),
  });

  // NOT CHECKED
  // DEPRECATED
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
