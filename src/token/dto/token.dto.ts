export interface TokenHeadersDto {
  token: string;
}

export const tokenSchema = {
  headers: {
    token: { type: 'string' },
  },
};
