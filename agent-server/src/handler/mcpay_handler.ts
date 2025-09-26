import z from "zod";
import { createMcpPaidHandler } from "mcpay/handler";

const inputSchema = {
  input: z.string(),
  agentID: z.string(),
};

const outputSchema = {
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  metadata: z.record(z.any()).optional(),
};

export const mcpayHandler = createMcpPaidHandler(
  (server) => {
    console.log("SERVER", server);
    server.paidTool(
      "weather",
      "Paid tool",
      "$0.001",
      inputSchema,
      {},
      async ({ agentID, input }) => ({
        content: [{ type: "text", text: `The weather in is sunny ${agentID}` }],
      })
    );
    server.tool(
      "free_tool",
      "Free to use",
      inputSchema,
      async ({ agentID, input }) => ({
        content: [{ type: "text", text: `FREE ${agentID}` }],
      })
    );
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
    serverInfo: { name: "paid-mcp", version: "1.0.0" },
  }
);
