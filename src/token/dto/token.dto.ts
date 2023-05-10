export interface TokenHeadersDto {
  token: string;
}

export interface TokenUuidHeadersDto {
  token: string;
  'token-monobrand': string;
}

export const tokenSchema = {
  headers: {
    token: { type: 'string' },
  },
};

export const tokenUuidSchema = {
  headers: {
    'token-monobrand': { type: 'string' },
    token: { type: 'string' },
  },
};
