// import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

class Config {
  // private static readonly secrets = new AWS.SecretsManager({
  //   region: process.env.REGION,
  // });

  // private static readonly getSecret = async (secretName: string) => {
  //   const { SecretString } = await Config.secrets
  //     .getSecretValue({
  //       SecretId: process.env.SECRET_ID,
  //     })
  //     .promise();
  //   const secrets = JSON.parse(SecretString);
  //   return secrets[secretName];
  // };

  apiHost: string;
  apiEnv: string;
  partnerToken: string;
  mongoUri: string;
  port: string;
  toplyvoUri: string;
  monobrandUri: string;
  monobrandApiKey: string;
  paymentType: string;
  userSdkUrl: string;
  userSdkSecret: string;
  pushLambdaSecret: string;
  pushNotificationsUri: string;

  constructor() {
    // this.monobrandApiKey = process.env.MONOBRAND_API_KEY;
    // this.monobrandUri = process.env.MONOBRAND_URI;
    this.port = process.env.PORT;
    this.apiEnv = process.env.API_ENV;
    this.apiHost = process.env.API_HOST;
    this.userSdkUrl = process.env.USER_SDK_URL

    this.monobrandApiKey = process.env.MONOBRAND_API_KEY
    this.monobrandUri = process.env.MONOBRAND_URI
    this.mongoUri = process.env.MONGO_URI
    this.toplyvoUri = process.env.TOPLYVO_URI
    this.paymentType = process.env.PAYMENT_TYPE
    this.partnerToken = process.env.PARTNER_TOKEN
    this.userSdkSecret = process.env.USER_SDK_SECRET
    this.pushLambdaSecret = process.env.PUSH_LAMBDA_SECRET
    this.pushNotificationsUri = process.env.PUSH_NOTIFICATIONS_URI
  }

  async init() {
    // this.monobrandApiKey = await Config.getSecret('MONOBRAND_API_KEY');
    // this.monobrandUri = await Config.getSecret('MONOBRAND_URI');
    // this.mongoUri = await Config.getSecret('MONGO_URI');
    // this.partnerToken = await Config.getSecret('PARTNER_TOKEN');
    // this.toplyvoUri = await Config.getSecret('TOPLYVO_URI');
    // this.paymentType = await Config.getSecret('PAYMENT_TYPE');
    // this.userSdkSecret = await Config.getSecret('USER_SDK_SECRET');
    // this.pushLambdaSecret = await Config.getSecret('PUSH_LAMBDA_SECRET');
    // this.pushNotificationsUri = await Config.getSecret('PUSH_NOTIFICATIONS_URI');
  }
}

export default new Config();
