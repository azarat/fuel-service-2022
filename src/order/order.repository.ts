import { OrderDocument, Order } from './schema/order.schema';

class OrderRepository {
  async createOrder(orderId: string, user: string): Promise<OrderDocument> {
    return Order.create({
      orderId,
      user,
    });
  }

  async getUserByOrderId(orderId: number): Promise<string> {
    const { user } = await Order.findOne({ orderId });
    return user;
  }
}

export default new OrderRepository();
