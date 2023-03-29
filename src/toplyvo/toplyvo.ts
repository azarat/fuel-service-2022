import config from '../config/config';
import MockupPrices from '../mockups/prices.json';
import MockupHistoryIn from '../mockups/historyIn.json';
import MockupHistoryOut from '../mockups/historyOut.json';
import MockupBalance from '../mockups/balance.json';
import axios, { AxiosInstance } from 'axios';

import { LoginBodyDto, LoginResponse } from './dto/login.dto';
import { CreateCodeBody } from './dto/create-code.dto';
import { TransactionDto } from './dto/transasction.dto';
import { OrderDto } from './dto/order.dto';
import { tokenAviabilityEnum } from './enums/ticket-aviability.enum';
import { transactionTypeEnum } from './enums/transaction-type.enum';

class HttpClient {
  private static client: AxiosInstance;

  private constructor() {}

  static get httpClient() {
    if (!HttpClient.client) {
      HttpClient.client = axios.create({
        baseURL: config.toplyvoUri,
        // headers: {
        //   'X-Partner-Token': config.partnerToken,
        // },
      });
    }

    return HttpClient.client;
  }
}

class Toplyvo {
  private static ORDER_PAGE = 1;
  private static ORDER_ITEMS_PER_PAGE = -1; //  -1 is not paginated result

  async createCode(body: CreateCodeBody) {
    await HttpClient.httpClient.post(`/partner/v1/client/create_code`, body);
  }

  async login(body: LoginBodyDto): Promise<LoginResponse> {
    const {
      data: { data },
    } = await HttpClient.httpClient.post(`/partner/v1/client/login`, body);

    return {
      token: data.token,
      phone: data.client.phone,
    };
  }

  async getBalance() {
    // MOCKUP
    const balance = MockupBalance.data.user.balance

    return balance
  }

  async getFuelHistory() {
    // MOCKUP
    const historyOut = MockupHistoryOut.data.card.transactions.map(t=>({...t, type: transactionTypeEnum.OUT}))
    const historyIn = MockupHistoryIn.data.balance.transactions.map(t=>({
      ...t, 
      type: transactionTypeEnum.IN,
      discount: null,
      fuel_type: null,
      station: null
    }))
    const historyAll = [...historyIn, ...historyOut]

    let history:TransactionDto[] = historyAll.map((transaction) => ({
      type: transaction.type,
      amount: transaction.amount,
      date: transaction.date,
      user_uuid: transaction.user_uuid,
      id: transaction.id,

      discount: transaction.discount,
      fuel_type: transaction.fuel_type,
      station_id: transaction.station,
      fuel_icon: transaction.fuel_type ? "https://apprecs.org/gp/images/app-icons/300/51/ua.wog.jpg" : null,
      station_icon: transaction.fuel_type ? "https://apprecs.org/gp/images/app-icons/300/51/ua.wog.jpg" : null
    }))

    function compare( a, b ) {
      if ( a.date < b.date ){
        return -1;
      }
      if ( a.date > b.date ){
        return 1;
      }
      return 0;
    }
    
    history = history.sort( compare )

    return history
  }

  async getFuels() {
    // const {
    //   data: { 
    //     data: { 
    //       card: { prices } 
    //     } 
    //   },
    // } = await HttpClient.httpClient.get(`/card/prices`);

    // MOCKUP
    const discounts = MockupPrices.data.card.discounts
    const prices = MockupPrices.data.card.prices.map((n, ni)=>({
      ...Object.values(n)[0],
      id: Object.keys(n)[0],
      icon: "https://apprecs.org/gp/images/app-icons/300/51/ua.wog.jpg",
      fuels: Object.values(n)[0].fuels.map((f, fi)=>{
        const fuelObj:any = Object.values(f)[0]

        let currentDiscount = 0
        if (discounts['discount_group_1'][Object.keys(n)[0]]) {
          if (discounts['discount_group_1'][Object.keys(n)[0]][Object.keys(f)[0]]) {
            currentDiscount = discounts['discount_group_1'][Object.keys(n)[0]][Object.keys(f)[0]]
          }
        }

        return {
          type: Object.keys(f)[0],
          ...fuelObj,
          price_at_network: fuelObj.price,
          price: fuelObj.price - currentDiscount,
          icon: "https://apprecs.org/gp/images/app-icons/300/51/ua.wog.jpg",
          fixed_ticket_volumes: [5000, 10000, 20000]
        }
      })
    }))

    return prices;
  }

  async orderFuel(
    token: string,
    body: OrderDto,
  ): Promise<{ payUrl: string; id: string }> {
    const {
      data: { data },
    } = await HttpClient.httpClient.post(`/partner/v1/client/orders`, body, {
      headers: {
        'X-Client-Token': token,
      },
    });
    const {
      data: { data: orderData },
    } = await HttpClient.httpClient.post(
      `/partner/v1/orders/${data.id}/payment/liqpay/create_payment_params`,
      {},
      {
        headers: {
          'X-Client-Token': token,
        },
      },
    );

    return {
      payUrl: `https://www.liqpay.ua/api/3/checkout?data=${orderData.data}&signature=${orderData.signature}`,
      id: data.id,
    };
  }

  async getTickets(token: string) {
    const aviableTickets = this.getTicketsRequest(
      tokenAviabilityEnum.aviable,
      token,
    );
    const notAviableTickets = this.getTicketsRequest(
      tokenAviabilityEnum.notAviable,
      token,
    );
    const res = await Promise.allSettled([aviableTickets, notAviableTickets]);
    return res.reduce((acc, item) => {
      if (item.status === 'fulfilled') {
        const {
          value: {
            data: {
              data: { items },
            },
          },
        } = item;
        return [...acc, ...items];
      }
      return acc;
    }, []);
  }

  private getTicketsRequest(aviability: tokenAviabilityEnum, token: string) {
    return HttpClient.httpClient.get(
      `/partner/v1/client/tickets?page=${Toplyvo.ORDER_PAGE}&itemsPerPage=${Toplyvo.ORDER_ITEMS_PER_PAGE}&isActive=${aviability}&orderBy=updatedAt&orderMode=DESC`,
      {
        headers: {
          'X-Client-Token': token,
        },
      },
    );
  }
}

export default new Toplyvo();
