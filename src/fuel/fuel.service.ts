import toplyvoRepository from '../toplyvo/toplyvo';
import { BalanceRefillDto } from './dto/balance-refill.dto';
import { MobistaRequest } from './dto/mobista-request.dto';

class FuelService {
  getFuels(uuid: string) {
    return toplyvoRepository.getFuels(uuid);
  }

  getFuelHistory(uuid: string) {
    return toplyvoRepository.getFuelHistory(uuid);
  }

  getBalance(uuid: string) {
    return toplyvoRepository.getBalance(uuid);
  }

  getBalanceRefillUrl(tokenMonobrand: string, refill: BalanceRefillDto) {
    return toplyvoRepository.getBalanceRefillUrl(tokenMonobrand, refill);
  }

  requestDelivery(data: MobistaRequest) {
    return toplyvoRepository.requestDelivery(data);
  }
}

export default new FuelService();
