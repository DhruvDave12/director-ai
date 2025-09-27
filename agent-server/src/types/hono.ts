import { Hono } from 'hono';

export type Variables = {
  requestId: string;
};

export type AppType = Hono<{ Variables: Variables }>;
