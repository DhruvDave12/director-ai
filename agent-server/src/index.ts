import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { mcpayHandler } from "./handler/mcpay_handler.js";

const app = new Hono();

app.use("*", (c) => mcpayHandler(c.req.raw));

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
