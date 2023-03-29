import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

class Config {
  private static readonly secrets = new AWS.SecretsManager({
    region: process.env.REGION,
  });

  private static readonly getSecret = async (secretName: string) => {
    const { SecretString } = await Config.secrets
      .getSecretValue({
        SecretId: process.env.SECRET_ID,
      })
      .promise();
    const secrets = JSON.parse(SecretString);
    return secrets[secretName];
  };

  apiHost: string;
  apiEnv: string;
  partnerToken: string;
  mongoUri: string;
  port: string;
  toplyvoUri: string;
  paymentType: string;
  userSdkUrl: string;
  userSdkSecret: string;
  pushLambdaSecret: string;
  pushNotificationsUri: string;

  constructor() {
    this.port = process.env.PORT;
    this.apiHost = process.env.API_HOST;
    this.apiEnv = process.env.API_ENV;
    this.userSdkUrl = process.env.USER_SDK_URL
  }

  async init() {
    this.mongoUri = await Config.getSecret('MONGO_URI');
    this.partnerToken = await Config.getSecret('PARTNER_TOKEN');
    this.toplyvoUri = await Config.getSecret('TOPLYVO_URI');
    this.paymentType = await Config.getSecret('PAYMENT_TYPE');
    this.userSdkSecret = await Config.getSecret('USER_SDK_SECRET');
    this.pushLambdaSecret = await Config.getSecret('PUSH_LAMBDA_SECRET');
    this.pushNotificationsUri = await Config.getSecret('PUSH_NOTIFICATIONS_URI');
  }
}

export default new Config();
