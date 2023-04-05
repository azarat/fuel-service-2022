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

  getBalanceRefillUrl(refill: BalanceRefillDto) {
    return toplyvoRepository.getBalanceRefillUrl(refill);
  }
}

export default new FuelService();
