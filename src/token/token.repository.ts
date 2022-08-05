import HttpError from '../errors/HttpError';
import { Token, TokenDocument } from './schema/token.schema';

class TokenRepository {
  async createToken(id: string, token: string): Promise<TokenDocument> {
    await Token.deleteOne({
      user: id,
    });
    return Token.create({
      user: id,
      token,
    });
  }

  async getTokenByUser(user: string): Promise<string> {
    const data = await Token.findOne({ user });
    if (!data) {
      throw new HttpError(403, 'Forbidden to orders before registration')
    }

    return data.token;
  }

  async existTokenByUser(id: string): Promise<boolean> {
    return Token.exists({ user: id });
  }

  async getDeviceTokenByPhone(phone: string): Promise<string> {
    const { deviceToken } = await Token.findOne({ phone });
    return deviceToken;
  }
}

export default new TokenRepository();
