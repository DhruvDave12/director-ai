import z from "zod";
import { createMcpPaidHandler } from "mcpay/handler";

const inputSchema = {
  input: z.string().url(),
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
      outputSchema,
      async ({ agentID, input }) => ({
        content: [{ type: "text", text: `The weather in is sunny ${agentID}` }],
      })
    );
    server.tool(
      "free_tool",
      "Free to use",
      inputSchema,
      outputSchema,
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
        address: "0xc9343113c791cB5108112CFADa453Eef89a2E2A2",
        isTestnet: true,
      },
      svm: {
        address: "4VQeAqyPxR9pELndskj38AprNj1btSgtaCrUci8N4Mdg",
        isTestnet: true,
      },
    },
  },
  {
    serverInfo: { name: "paid-mcp", version: "1.0.0" },
  }
);
