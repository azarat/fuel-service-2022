import { TokenHeadersDto } from './token.dto';

export interface LoginDto {
  code: string;
}

export interface LoginHeadersDto extends TokenHeadersDto {
  devicetoken: string;
}

export const loginSchema = {
  headers: {
    token: { type: 'string' },
  },
  body: {
    type: 'object',
    required: ['code'],
    properties: {
      code: { type: 'string' },
    },
  },
};
