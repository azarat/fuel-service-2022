export interface CreateOrderDto {
  tickets: {
    volume: number;
    count: number;
    fuelId: number;
  }[];
  totalPrice: number;
}

export const createOrderSchema = {
  headers: {
    token: { type: 'string' },
  },
  body: {
    type: 'object',
    required: ['totalPrice'],
    properties: {
      tickets: {
        type: 'array',
        items: {
          type: 'object',
          required: ['volume', 'count', 'fuelId'],
          properties: {
            volume: { type: 'number' },
            count: { type: 'number' },
            fuelId: { type: 'number' },
          },
        },
        minItems: 1,
        collectionFormat: 'multi',
      },
      totalPrice: { type: 'number' },
    },
  },
};
