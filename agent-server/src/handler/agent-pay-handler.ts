import { createMcpPaidHandler } from "mcpay/handler";
import { config } from "dotenv";
import { registerAgentTools } from "../tools/agent-tools.js";
import { registerTestTools } from "../tools/test-tools.js";

config();

const agentFacilitatorUrl = process.env
  .AGENT_FACILITATOR_URL as `${string}://${string}`;
if (!agentFacilitatorUrl) {
  throw new Error("AGENT_FACILITATOR_URL is not set");
}

export const agentPayHandler = createMcpPaidHandler(
  async (server) => {
    console.log("🔄 Registering agent tools...");
    await registerAgentTools(server);
    registerTestTools(server);
  },
  {
    facilitator: {
      url: agentFacilitatorUrl,
    },
    recipient: {
      "polygon-amoy": "0x3125c67180aBD9d59aCE1412c01B8d197306891d",
    },
  },
  {
    serverInfo: { name: "director-ai-agent-server", version: "1.0.0" },
  },
  {
    maxDuration: 800000000,
  }
);
