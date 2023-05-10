import { FastifyInstance } from 'fastify';

import tokenService from './token.service';
import { Body, Headers } from '../types';
import { TokenHeadersDto, tokenSchema } from './dto/token.dto';
import { LoginDto, LoginHeadersDto, loginSchema } from './dto/login-code.dto';
import { userGuard } from '../guards/user.guard';

const tokenController = (server: FastifyInstance, _, done) => {
  // CHECKING
  // DEPRECATED
  server.post<Headers<TokenHeadersDto>>('/code', {
    schema: { ...tokenSchema, tags: ['Login'] },
    preValidation: userGuard,
    handler: async (req, res) => {
      await tokenService.createCode(req.headers.token);
      return res.status(200).send();
    },
  });

  // CHECKING 
  // DEPRECATED
  server.get<Headers<TokenHeadersDto>>('/exist', {
    schema: { ...tokenSchema, tags: ['Login'] },
    preValidation: userGuard,
    handler: async (req, res) => {
      const isExist = await tokenService.tokenExist(req.headers.token);
      if (isExist) {
        return res.status(200).send();
      }

      return res.status(404).send();
    },
  });

  // CHECKED
  server.post<Headers<TokenHeadersDto>>('/', {
    schema: { ...tokenSchema, tags: ['Login'] },
    preValidation: userGuard,
    handler: async (req, res) => {
      const uuid = await tokenService.login(req.headers.token);
      return res.status(200).send({uuid});
    },
  });

  done();
};

export default tokenController;
