import { agentRegistry } from "../core/agent-factory.js";
import type {
  AgentRequest,
  AgentExecutionContext,
  AgentResponse,
} from "../types/agent.js";

/**
 * Agent Service Class
 * Handles all agent-related business logic and operations
 */
export class AgentService {
  /**
   * Execute an agent with the given request and context
   */
  async executeAgent(
    agentId: string,
    request: AgentRequest,
    context: AgentExecutionContext
  ): Promise<AgentResponse> {
    // Get the agent from registry
    const agent = agentRegistry.getAgent(agentId);

    if (!agent) {
      return {
        success: false,
        error: `Agent not found: ${agentId}`,
        metadata: {
          agentId,
          requestId: context.requestId,
        },
      };
    }

    try {
      // Execute the agent
      const response = await agent.execute(request, context);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Execution failed",
        metadata: {
          agentId,
          requestId: context.requestId,
        },
      };
    }
  }

  /**
   * Check if an agent exists
   */
  agentExists(agentId: string): boolean {
    return agentRegistry.getAgent(agentId) !== null;
  }

  /**
   * Get agent information
   */
  getAgentInfo(agentId: string) {
    const agent = agentRegistry.getAgent(agentId);

    if (!agent) {
      return null;
    }

    return {
      id: agent.getId(),
      name: agent.getName(),
      capabilities: agent.getCapabilities(),
      config: agent.getConfig(),
    };
  }

  /**
   * Check agent health
   */
  async checkAgentHealth(agentId: string): Promise<{
    healthy: boolean;
    error?: string;
  }> {
    const agent = agentRegistry.getAgent(agentId);

    if (!agent) {
      return {
        healthy: false,
        error: `Agent not found: ${agentId}`,
      };
    }

    try {
      const isHealthy = await agent.healthCheck();
      return { healthy: isHealthy };
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : "Health check failed",
      };
    }
  }

  /**
   * Create execution context from request headers and metadata
   */
  createExecutionContext(
    requestId: string,
    userId?: string,
    sessionId?: string
  ): AgentExecutionContext {
    return {
      requestId,
      timestamp: new Date(),
      userId,
      sessionId,
    };
  }
}

// Create and export a singleton instance
export const agentService = new AgentService();
