import { getUserById } from '@day-drive/user-sdk/lib/cjs';

import toplyvoRepository from '../toplyvo/toplyvo';
import tokenRepository from '../token/token.repository';
import orderRepository from './order.repository';
import config from '../config/config';
import { CreateOrderDto } from './dto/create-order.dto';
import { CallbackOrderDto } from './dto/callback-order.dto';
import { TokenService } from '../token/token.service';
import axios from 'axios';
import MockupQrData from '../mockups/qr.json'
import { GenerateQrDto } from './dto/generate-qr.dto';

class OrderService {
  private static STATUSES = {
    created: 'Создан',
    paid: 'Оплачен',
    fulfilled: 'Готов',
    written_off: 'Списан',
    written_off_partial: 'Списан частично',
  }

  private static TYPES = {
    paid: 'FUEL_PAID',
    fulfilled: 'FUEL_READY',
    written_off: 'WRITTEN_OFF',
    written_off_partial: 'WRITTEN_OFF_PARTIAL',
  }

  async getQrData(tokenMonobrand: string, qrData:GenerateQrDto) {
    // MOCKUP
    // const qrData = MockupQrData.data.card.qr

    const data = qrData;
    
    const reqConfig = {
      headers: { 
        'Apikey': config.monobrandApiKey, 
        'Content-Type': 'application/json',
        'User-Uuid': tokenMonobrand
      }
    }
    
    const response = await axios.post(`${config.monobrandUri}/card/qr`, data, reqConfig)

    console.log(response.data, "qr");
    


    return response.data.data.card.qr
  }

  getFuels(uuid: string) {
    return toplyvoRepository.getFuels(uuid);
  }

  async order(
    token: string,
    { tickets, totalPrice }: CreateOrderDto,
  ): Promise<string> {
    const { id } = await TokenService.verifyUser(token);
    const userToken = await tokenRepository.getTokenByUser(id);
    const { payUrl, id: orderId } = await toplyvoRepository.orderFuel(
      userToken,
      {
        tickets: tickets.map((ticket) => ({
          ...ticket,
          fuel_id: ticket.fuelId,
        })),
        price_total: totalPrice,
        payment_type: +config.paymentType,
      },
    );
    await orderRepository.createOrder(orderId, id);

    return payUrl;
  }

  async getOrders(token: string) {
    const { id } = await TokenService.verifyUser(token);
    try {
      const userToken = await tokenRepository.getTokenByUser(id);
      return toplyvoRepository.getTickets(userToken);
    } catch {
      return [];
    }
  }

  async callbackOrder({ old_status, new_status, order_id }: CallbackOrderDto): Promise<void> {
    const user = await orderRepository.getUserByOrderId(order_id);
    const { deviceToken } = await getUserById(
      config.userSdkUrl,
      config.userSdkSecret,
      user,
    );
    await axios.post(config.pushNotificationsUri,
      {
        tokens: deviceToken,
        notification: {
          title: 'Статус покупки топлива изменен',
          body: `Статус покупки изменен на c ${OrderService.STATUSES[old_status as keyof typeof OrderService.STATUSES]} на ${OrderService.STATUSES[new_status as keyof typeof OrderService.STATUSES]}`,
        },
        data: {
          orderId: `${order_id}`,
          type: OrderService.TYPES[old_status as keyof typeof OrderService.TYPES],
        },
      },
      {
        headers: {
          token: config.pushLambdaSecret,
        }
      }
    );
  }
}

export default new OrderService();
