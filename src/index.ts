import fastify from 'fastify';
import mongoose from 'mongoose';
import swagger from 'fastify-swagger';

import tokenController from './token/token.controller';
import config from './config/config';
import fuelController from './fuel/fuel.controller';
import orderController from './order/order.controller';
import HttpError from './errors/HttpError';

const app = fastify({
  logger: true,
});

app.get(`/${config.apiEnv}/FuelService/health`, async () => 'Hello World');
app.register(swagger, {
  exposeRoute: true,
  routePrefix: '/docs',
  swagger: {
    host: config.apiHost,
    info: {
      title: 'Fuel service API',
      version: 'v1',
    },
  },
});
app.setErrorHandler((err, _, res) => {
  console.log(err);
  if (err instanceof HttpError) {
    res.status(err.code).send(err.message);
  } else {
    res.status(500).send(err.message);
  }
});
app.register(tokenController, { prefix: `/${config.apiEnv}/FuelService/login` });
app.register(fuelController, { prefix: `/${config.apiEnv}/FuelService/fuels` });
app.register(orderController, { prefix: `/${config.apiEnv}/FuelService/orders` });

const start = async () => {
  try {
    await config.init();
    await mongoose.connect(config.mongoUri);
    await app.listen(config.port, '0.0.0.0');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();

export default app;
