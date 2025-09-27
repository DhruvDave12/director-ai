import z from "zod";

const testInputSchema = {
  prompt: z.string(),
  city: z.string().optional(),
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
    async ({ city, prompt, agentID }: { city?: string; prompt: string; agentID?: string }) => ({
      content: [{
        type: "text",
        text: `🌤️ [TEST] Weather in ${city || "Unknown"}: Sunny, 72°F\nPrompt: ${prompt}\nAgent ID: ${agentID || "N/A"}`,
      }],
    })
  );

  // [TEST] Free tool
  server.tool(
    "test_free_tool",
    "[TEST] Free development tool",
    testInputSchema,
    async ({ prompt, agentID }: { prompt: string; agentID?: string }) => ({
      content: [{
        type: "text",
        text: `🆓 [TEST] Free tool response\nPrompt: ${prompt}\nAgent ID: ${agentID || "N/A"}`,
      }],
    })
  );

  console.log("✅ Test tools registered");
}
