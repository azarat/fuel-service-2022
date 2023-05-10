import { FastifyReply, FastifyRequest } from 'fastify';
import HttpError from '../errors/HttpError';
import { TokenService } from '../token/token.service';

export const userGuard = async (req: FastifyRequest, _: FastifyReply) => {
  const { token } = req.headers;
  if (!token) {
    throw new HttpError(403, 'Provide a token');
  }

  try {
    await TokenService.verifyUser(req.headers.token as string);
  } catch (err) {
    throw new HttpError(401, 'Token is invalid');
  }
};

export const userUuidGuard = async (req: FastifyRequest, _: FastifyReply) => {
  const { token, 'token-monobrand': tokenMonobrand } = req.headers;
  
  if (!token) {
    throw new HttpError(403, 'Provide a token');
  }

  if (!tokenMonobrand) {
    throw new HttpError(403, 'Provide a tokenMonobrand');
  }

  try {
    await TokenService.verifyUser(req.headers.token as string);
  } catch (err) {
    throw new HttpError(401, 'Token is invalid');
  }
};
