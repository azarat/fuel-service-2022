export interface OrderDto {
  tickets: {
    volume: number;
    count: number;
    fuel_id: number;
  }[];
  price_total: number;
  payment_type: number;
}
