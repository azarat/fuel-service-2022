import toplyvoRepository from '../toplyvo/toplyvo';
import { BalanceRefillDto } from './dto/balance-refill.dto';

class FuelService {
  getFuels() {
    return toplyvoRepository.getFuels();
  }

  getFuelHistory() {
    return toplyvoRepository.getFuelHistory();
  }

  getBalance(uuid: string) {
    return toplyvoRepository.getBalance(uuid);
  }

  getBalanceRefillUrl(tokenMonobrand: string, refill: BalanceRefillDto) {
    return toplyvoRepository.getBalanceRefillUrl(tokenMonobrand, refill);
  }
}

export default new FuelService();
