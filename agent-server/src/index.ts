import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { agentPayHandler } from "./handler/agent-pay-handler.js";
import { createWebScrapingAgent } from "./agents/main/web-scraping-agent.js";
import { createSeoOptimizationAgent } from "./agents/main/seo-optimization-agent.js";
import { createGitHubAgent } from "./agents/main/github-agent.js";
import { createRedditSentimentAgent } from "./agents/main/reddit-sentiment-agent.js";
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
  agentRegistry.registerFactory(
    "seo_optimization_agent",
    createSeoOptimizationAgent
  );
  agentRegistry.registerFactory("github_code_agent", createGitHubAgent);
  agentRegistry.registerFactory(
    "reddit_sentiment_agent",
    createRedditSentimentAgent
  );

  console.log(
    "Agent factories registered:",
    agentRegistry.getRegisteredTypes()
  );

  // Optionally create default instances
  try {
    agentRegistry.createAgent("web_scraper_agent");
    agentRegistry.createAgent("seo_optimization_agent");
    agentRegistry.createAgent("github_code_agent");
    agentRegistry.createAgent("reddit_sentiment_agent");
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
