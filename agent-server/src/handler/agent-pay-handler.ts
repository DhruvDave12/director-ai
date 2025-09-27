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

// Get blockchain chain from environment variable, default to "base-sepolia"
const blockchainChain = (process.env.BLOCKCHAIN_CHAIN || "base-sepolia") as "base-sepolia" | "polygon-amoy";

// Validate the chain value
if (!["base-sepolia", "polygon-amoy"].includes(blockchainChain)) {
  throw new Error(`Invalid BLOCKCHAIN_CHAIN value: ${blockchainChain}. Must be "base-sepolia" or "polygon-amoy"`);
}

// Configure recipient addresses for different chains
const recipientConfig = {
  "base-sepolia": "0x3125c67180aBD9d59aCE1412c01B8d197306891d",
  "polygon-amoy": "0x3125c67180aBD9d59aCE1412c01B8d197306891d", // TODO: Update with correct polygon-amoy address
};

export const agentPayHandler = createMcpPaidHandler(
  async (server) => {
    console.log("🔄 Registering agent tools...");
    console.log(`🔗 Using blockchain chain: ${blockchainChain}`);
    await registerAgentTools(server);
    registerTestTools(server);
  },
  {
    facilitator: {
      url: agentFacilitatorUrl,
    },
    recipient: {
      [blockchainChain]: recipientConfig[blockchainChain],
    },
  },
  {
    serverInfo: { name: "director-ai-agent-server", version: "1.0.0" },
  },
  {
    maxDuration: 800000000,
  }
);
