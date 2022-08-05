import config from '../config/config';
import axios, { AxiosInstance } from 'axios';

import { LoginBodyDto, LoginResponse } from './dto/login.dto';
import { CreateCodeBody } from './dto/create-code.dto';
import { OrderDto } from './dto/order.dto';
import { tokenAviabilityEnum } from './enums/ticket-aviability.enum';

class HttpClient {
  private static client: AxiosInstance;

  private constructor() {}

  static get httpClient() {
    if (!HttpClient.client) {
      HttpClient.client = axios.create({
        baseURL: config.toplyvoUri,
        headers: {
          'X-Partner-Token': config.partnerToken,
        },
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

  async getFuels() {
    const {
      data: { data },
    } = await HttpClient.httpClient.get(`/partner/v1/networks`);

    return data;
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
