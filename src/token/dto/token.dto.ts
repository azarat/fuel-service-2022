export interface TokenHeadersDto {
  token: string;
}

export interface TokenUuidHeadersDto {
  token: string;
  tokenMonobrand: string;
}

export const tokenSchema = {
  headers: {
    token: { type: 'string' },
  },
};

export const tokenUuidSchema = {
  headers: {
    tokenMonobrand: { type: 'string' },
    token: { type: 'string' },
  },
};
