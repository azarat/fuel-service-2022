import toplyvoRepository from '../toplyvo/toplyvo';

class FuelService {
  getFuels() {
    return toplyvoRepository.getFuels();
  }
}

export default new FuelService();
