import z from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Redis } from "@upstash/redis";

interface Agent {
  id: string;
  name: string;
  description: string;
  address: string;
  costPerOutputToken: number;
}

// Initialize Redis
let redis: Redis;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
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
      .map((data) => typeof data === "string" ? JSON.parse(data) : data) as Agent[];
  } catch (error) {
    console.error("❌ Error fetching agents:", error);
    return [];
  }
}

function calculateAgentCost(prompt: string, costPerOutputToken: number): number {
  return prompt.length * 10 * costPerOutputToken;
}

function createAgentPrice(costPerOutputToken: number): string {
  const basePrice = Math.max(0.001, costPerOutputToken * 1000);
  return `$${basePrice.toFixed(6)}`;
}

export async function registerAgentTools(server: any) {
  const agents = await getAllAgents();
  
  if (agents.length === 0) {
    console.warn("⚠️ No agents found in Redis. Run: node backend/scripts/setup-agents.js setup");
    return;
  }

  for (const agent of agents) {
    const toolName = `agent_${agent.address.toLowerCase()}`;
    
    server.paidTool(
      toolName,
      agent.description,
      createAgentPrice(agent.costPerOutputToken),
      agentInputSchema,
      {},
      async ({ prompt, agentID }: { prompt: string; agentID?: string }) => {
        const actualCost = calculateAgentCost(prompt, agent.costPerOutputToken);

        // TODO: Add actual agent response here
        
        return {
          content: [{
            type: "object",
            data: {
              name: agent.name,
              address: agent.address,
              inputLength: prompt.length,
              actualCost: actualCost.toFixed(6),
              costPerToken: agent.costPerOutputToken,
              prompt: prompt.substring(0, 300) + (prompt.length > 300 ? "..." : ""),
              // TODO: Add actual agent response here
            },
          }],
        };
      }
    );
  }

  console.log(`✅ Registered ${agents.length} agent tools`);
}
