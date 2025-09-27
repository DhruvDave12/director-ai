import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { agentPayHandler } from "./handler/agent-pay-handler.js";
import { createWebScrapingAgent } from "./agents/main/web-scraping-agent.js";
import { agentRegistry } from "./core/agent-factory.js";

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

function initializeAgents() {
  console.log("Initializing agent registry...");

  // Register agent factories
  agentRegistry.registerFactory("web_scraper_agent", createWebScrapingAgent);

  console.log(
    "Agent factories registered:",
    agentRegistry.getRegisteredTypes()
  );

  // Optionally create default instances
  try {
    agentRegistry.createAgent("web_scraper_agent");
    console.log("Default agent instances created");
  } catch (error) {
    console.error("Failed to create default agents:", error);
  }
}

initializeAgents();

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
