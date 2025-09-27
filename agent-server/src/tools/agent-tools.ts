import z from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";
import { agentService } from "../agents/service.js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

interface Agent {
  id: string;
  name: string;
  description: string;
  address: string;
  costPerOutputToken: number;
}

// Initialize Redis
let redis: Redis;
if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  redis = Redis.fromEnv();
} else if (process.env.REDIS_URL) {
  const redisUrl = process.env.REDIS_URL;
  const url = new URL(redisUrl);
  const token = url.password;
  const restUrl = `https://${url.hostname}/`;

  redis = new Redis({
    url: restUrl,
    token: token,
  });
}

const agentInputSchema = {
  prompt: z.string().min(1, "Prompt is required"),
  agentID: z.string().optional(),
};

async function getAllAgents(): Promise<Agent[]> {
  if (!redis) return [];

  try {
    const keys = await redis.keys("AGENT_*");
    if (keys.length === 0) return [];

    const agentPromises = keys.map((key) => redis.get(key));
    const agentDataArray = await Promise.all(agentPromises);

    return agentDataArray
      .filter((data) => data !== null)
      .map((data) =>
        typeof data === "string" ? JSON.parse(data) : data
      ) as Agent[];
  } catch (error) {
    console.error("❌ Error fetching agents:", error);
    return [];
  }
}

function calculateAgentCost(costPerOutputToken: number): number {
  return 1000 * costPerOutputToken;
}

function createAgentPrice(costPerOutputToken: number): string {
  const basePrice = Math.max(0.001, costPerOutputToken * 1000);
  return `$${basePrice.toFixed(6)}`;
}

export async function registerAgentTools(server: any) {
  const agents = await getAllAgents();
  console.log("🤖 Agents: ", agents);

  if (agents.length === 0) {
    console.warn(
      "⚠️ No agents found in Redis. Run: node backend/scripts/setup-agents.js setup"
    );
    return;
  }

  console.log("[AGENT SERVER] 🔍 Registering agents: ", agents);

  for (const agent of agents) {
    // Note: This should be specifically the name
    const toolName = agent.name;

    server.paidTool(
      toolName,
      agent.description,
      // For now agent price is static
      createAgentPrice(agent.costPerOutputToken),
      agentInputSchema,
      {},
      async ({ prompt, agentID }: { prompt: string; agentID?: string }) => {
        const actualCost = calculateAgentCost(agent.costPerOutputToken);
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
        console.log("[AGENT SERVER] 🔍 Executing agent: ", agentID);
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
            // {
            //   type: "object",
            //   data: {
            //     name: agent.name,
            //     address: agent.address,
            //     inputLength: prompt.length,
            //     actualCost: actualCost.toFixed(6),
            //     costPerToken: agent.costPerOutputToken,
            //     prompt:
            //       prompt.substring(0, 300) + (prompt.length > 300 ? "..." : ""),
            //     response: response.data,
            //   },
            // },
            {
              type: "text",
              text: response.data,
            },
          ],
        };
      }
    );
  }

  console.log(`✅ Registered ${agents.length} agent tools`);
}
