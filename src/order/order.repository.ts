import { OrderDocument, Order } from './schema/order.schema';
import { MbprofileDocument, Mbprofile } from './schema/mbprofile.schema';

class OrderRepository {
  async upsertUuid(uuid: string, user: string): Promise<MbprofileDocument> {
    console.log("testme");
    
    return Mbprofile.findOneAndUpdate({user}, {
      user,
      uuid,
    }, {upsert: true});
  }

  async upsertTitle(user: string, uuid: string, title: string): Promise<MbprofileDocument> {
    return Mbprofile.findOneAndUpdate({user}, {
      user,
      uuid,
      title
    }, {upsert: true});
  }

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
