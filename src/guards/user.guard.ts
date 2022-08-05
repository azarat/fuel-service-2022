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
