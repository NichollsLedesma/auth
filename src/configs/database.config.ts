import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  mongoUrl: process.env.MONGO_URL,
}));
