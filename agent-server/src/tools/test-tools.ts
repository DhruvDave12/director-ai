import z from "zod";
import { agentService } from "../agents/service.js";
import { v4 as uuidv4 } from "uuid";

const testInputSchema = {
  prompt: z.string(),
  agentID: z.string().optional(),
};

export function registerTestTools(server: any) {
  // [TEST] Paid tool
  server.paidTool(
    "test_weather",
    "[TEST] Weather tool - development testing",
    "$0.001",
    testInputSchema,
    {},
    async ({
      city,
      prompt,
      agentID,
    }: {
      city?: string;
      prompt: string;
      agentID?: string;
    }) => ({
      content: [
        {
          type: "text",
          text: `🌤️ [TEST] Weather in ${
            city || "Unknown"
          }: Sunny, 72°F\nPrompt: ${prompt}\nAgent ID: ${agentID || "N/A"}`,
        },
      ],
    })
  );

  // [TEST] Free tool
  server.tool(
    "test_free_tool",
    "[TEST] Free development tool",
    testInputSchema,
    async ({ prompt, agentID }: { prompt: string; agentID?: string }) => {
      if (!agentID) {
        return {
          content: [
            {
              type: "text",
              text: "Agent ID is required",
            },
          ],
        };
      }
      const response = await agentService.executeAgent(
        agentID,
        {
          payload: prompt,
        },
        {
          requestId: uuidv4(),
          timestamp: new Date(),
          userId: "system-user",
          sessionId: "system-sesh",
        }
      );

      console.log("🔍 Response:", response);
      return {
        content: [
          {
            type: "text",
            text: response.data,
          },
        ],
      };
    }
  );

  console.log("✅ Test tools registered");
}
