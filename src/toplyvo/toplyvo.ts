import config from '../config/config';
import MockupPrices from '../mockups/prices.json';
import MockupHistoryIn from '../mockups/historyIn.json';
import MockupHistoryOut from '../mockups/historyOut.json';
import MockupBalance from '../mockups/balance.json';
import MockupLogin from '../mockups/login.json';
import MockupBalanceRefill from '../mockups/balanceRefill.json';
import axios, { AxiosInstance } from 'axios';

import { LoginBodyDto, LoginResponse } from './dto/login.dto';
import { CreateCodeBody } from './dto/create-code.dto';
import { TransactionDto } from './dto/transasction.dto';
import { OrderDto } from './dto/order.dto';
import { tokenAviabilityEnum } from './enums/ticket-aviability.enum';
import { transactionTypeEnum } from './enums/transaction-type.enum';
import { BalanceRefillDto } from '../fuel/dto/balance-refill.dto';

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
    // MOCKUP
    // const uuid = MockupLogin.data.user.uuid

    // console.log(body, "user id");

    const data = {
      "user": {
        "id": body.id
      }
    };
    
    const reqConfig = {
      headers: { 
        'Apikey': config.monobrandApiKey, 
        'Content-Type': 'application/json'
      }
    }
    
    const response = await axios.post(`${config.monobrandUri}/auth/create`, data, reqConfig)

    // console.log(response.data.data.user.uuid, "user id -> uuid");

    return {
      token: response.data.data.user.uuid,
    };
  }

  async getBalanceRefillUrl(tokenMonobrand: string, refill:BalanceRefillDto) {
    // MOCKUP
    // const balanceRefillUrl = MockupBalanceRefill.data.balance.refill_link

    const data = refill;
   
    console.log(data, "data refill");
    

    const reqConfig = {
      headers: { 
        'Apikey': config.monobrandApiKey, 
        'Content-Type': 'application/json',
        'User-Uuid': tokenMonobrand
      }
    }

    const response = await axios.post(`${config.monobrandUri}/balance/refill`, data, reqConfig)

    console.log(response.data);
    

    return response.data.data.balance.refill_link
  }

  async getBalance(uuid: string) {
    // MOCKUP
    // const balance = MockupBalance.data.user.balance

    let balance = 0

    const reqConfig = {
      headers: { 
        'Apikey': config.monobrandApiKey, 
        'Content-Type': 'application/json',
        'User-Uuid': uuid
      }
    }

    // console.log(uuid, "balance uuid");
   
    try {
      const response = await axios.get(`${config.monobrandUri}/balance`, reqConfig)
      balance = response.data.data.user.balance
      // console.log(response.data, "response.data balance");
    } catch (error) {
      console.log(error, "balance error");
    }
    
    return balance
  }

  async getFuelHistory(uuid: string) {
    // MOCKUP
    // MockupHistoryOut
    // MockupHistoryIn

    const reqConfig = {
      headers: { 
        'Apikey': config.monobrandApiKey, 
        'Content-Type': 'application/json',
        'User-Uuid': uuid
      }
    }
    
    const historyOutResp = await axios.get(`${config.monobrandUri}/card/transactions/0`, reqConfig)
    const historyInResp = await axios.get(`${config.monobrandUri}/balance/transactions/0`, reqConfig)

    const historyOut = historyOutResp.data.data.card.transactions.map(t=>({...t, type: transactionTypeEnum.OUT}))
    const historyIn = historyInResp.data.data.balance.transactions.map(t=>({
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

  async getFuels(uuid: string) {
    // MOCKUP
    // MockupPrices

    const reqConfig = {
      headers: { 
        'Apikey': config.monobrandApiKey, 
        'Content-Type': 'application/json',
        'User-Uuid': uuid
      }
    }
    
    const pricesResp = await axios.get(`${config.monobrandUri}/card/prices`, reqConfig)

    const discounts = pricesResp.data.data.card.discounts
    let prices = pricesResp.data.data.card.prices.map((n:object, ni)=>{
      let fuels = Object.values(n)[0].fuels.map((f, fi)=>{
        const fuelObj:any = Object.values(f)[0]

        let currentDiscount = 0
        if (discounts['discount_group_1'][Object.keys(n)[0]]) {
          if (discounts['discount_group_1'][Object.keys(n)[0]][Object.keys(f)[0]]) {
            currentDiscount = discounts['discount_group_1'][Object.keys(n)[0]][Object.keys(f)[0]]
          }
        }

        if (currentDiscount == 0) return null

        let fuelIcon = 'https://apprecs.org/gp/images/app-icons/300/51/ua.wog.jpg'

        console.log(Object.values(n)[0].title + "-" + Object.keys(f)[0]);
        

        switch (Object.values(n)[0].title + "-" + Object.keys(f)[0]) {
          case 'Wog-lpg':
            fuelIcon = 'http://157.230.99.45:8001/storage/uploads/2023/04/07/Wog-lpg_uid_643082a145183.jpg'
            break;
          case 'Wog-dpplus':
            fuelIcon = 'http://157.230.99.45:8001/storage/uploads/2023/04/07/Wog-dpplus_uid_643082a1746c8.jpg'
            break;
          case 'Wog-95plus':
            fuelIcon = 'http://157.230.99.45:8001/storage/uploads/2023/04/07/Wog-95plus_uid_643082a053c70.jpg'
            break;
          case 'Wog-98':
            fuelIcon = 'http://157.230.99.45:8001/storage/uploads/2023/04/07/Wog-98_uid_643082a089f9f.jpg'
            break;
          case 'Wog-dp':
            fuelIcon = 'http://157.230.99.45:8001/storage/uploads/2023/04/07/Wog-dp_uid_643082a0c14be.jpg'
            break;
          case 'Wog-95':
            fuelIcon = 'http://157.230.99.45:8001/storage/uploads/2023/04/07/Wog-95_uid_643082981c805.jpg'
            break;
          default:
            break;
        }
  
        return {
          type: Object.keys(f)[0],
          ...fuelObj,
          price_at_network: fuelObj.price,
          price: fuelObj.price - currentDiscount,
          icon: fuelIcon,
          fixed_ticket_volumes: [5000, 10000, 20000]
        }
      })

      fuels = fuels.filter(f => f != null)

      if (fuels.length == 0) return null

      let azsIcon = 'https://apprecs.org/gp/images/app-icons/300/51/ua.wog.jpg'

      switch (Object.values(n)[0].title) {
        case 'Wog':
          azsIcon = 'http://157.230.99.45:8001/storage/uploads/2023/04/07/Wog_uid_643082a1c427f.jpg'
          break;
        case 'Chipo':
          azsIcon = 'http://157.230.99.45:8001/storage/uploads/2023/04/07/Chipo_uid_643082a19158e.jpg'
          break;
        default:
          break;
      }

      return {
      ...Object.values(n)[0],
      id: Object.keys(n)[0],
      icon: azsIcon,
      fuels
    }})

    prices = prices.filter(p => p != null)

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
