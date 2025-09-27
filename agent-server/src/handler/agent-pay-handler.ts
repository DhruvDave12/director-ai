import { createMcpPaidHandler } from "mcpay/handler";
import { config } from "dotenv";
import { registerAgentTools } from "../tools/agent-tools.js";
import { registerTestTools } from "../tools/test-tools.js";

config();

export const agentPayHandler = createMcpPaidHandler(
  async (server) => {
    console.log("🔄 Registering agent tools...");
    await registerAgentTools(server);
    registerTestTools(server);
  },
  {
    facilitator: {
      url: "https://facilitator.x402.rs",
    },
    recipient: {
      evm: {
        address: "0x3125c67180aBD9d59aCE1412c01B8d197306891d",
        isTestnet: true,
      },
    },
  },
  {
    serverInfo: { name: "director-ai-agent-server", version: "1.0.0" },
  }
);
