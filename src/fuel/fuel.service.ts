import toplyvoRepository from '../toplyvo/toplyvo';

class FuelService {
  getFuels() {
    return toplyvoRepository.getFuels();
  }

  getFuelHistory() {
    return toplyvoRepository.getFuelHistory();
  }

  getBalance() {
    return toplyvoRepository.getBalance();
  }
}

export default new FuelService();
