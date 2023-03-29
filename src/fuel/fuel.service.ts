import toplyvoRepository from '../toplyvo/toplyvo';

class FuelService {
  getFuels() {
    return toplyvoRepository.getFuels();
  }

  getFuelHistory() {
    return toplyvoRepository.getFuelHistory();
  }
}

export default new FuelService();
