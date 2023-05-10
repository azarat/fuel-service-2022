import { verifyUser } from '@day-drive/user-sdk/lib/cjs';

import { LoginDto } from './dto/login-code.dto';
import toplyvoRepository from '../toplyvo/toplyvo';
import tokenRepository from './token.repository';
import config from '../config/config';

class TokenService {
  static async verifyUser(token: string) {
    return verifyUser(
      config.userSdkUrl,
      config.userSdkSecret,
      token,
    );
  }
  async createCode(token: string) {
    const { phone } = await TokenService.verifyUser(token);
    await toplyvoRepository.createCode({ phone });
  }

  async login(token: string) {
    const { id } = await TokenService.verifyUser(token);
    const { token: userToken } = await toplyvoRepository.login({ id });
    await tokenRepository.createToken(id, userToken);
    return userToken
  }

  async tokenExist(token: string): Promise<boolean> {
    const { id } = await TokenService.verifyUser(token);
    return tokenRepository.existTokenByUser(id);
  }
}
export { TokenService };
export default new TokenService();
