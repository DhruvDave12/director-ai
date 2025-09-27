import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { agentPayHandler } from "./handler/agent-pay-handler.js";

const app = new Hono();

// Health check endpoint
app.get("/health", (c) => {
  return c.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "director-ai-agent-server",
  });
});

// MCP handler for all other routes
app.use("*", (c) => agentPayHandler(c.req.raw));

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
