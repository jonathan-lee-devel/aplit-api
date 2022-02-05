import cors from 'cors';

export const corsConfig = () => {
  return cors({
    credentials: true,
    origin: process.env.FRONT_END_URL,
  });
};
