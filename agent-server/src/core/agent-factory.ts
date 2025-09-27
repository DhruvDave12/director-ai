import type { BaseAgent, AgentFactory, AgentConfig } from "../types/agent.js";

export class AgentFactoryRegistry {
  private factories: Map<string, AgentFactory> = new Map();
  private instances: Map<string, BaseAgent> = new Map();

  /**
   * Register an agent factory
   */
  registerFactory(agentType: string, factory: AgentFactory): void {
    this.factories.set(agentType, factory);
  }

  /**
   * Create an agent instance using factory pattern
   */
  createAgent(agentType: string): BaseAgent {
    const factory = this.factories.get(agentType);
    if (!factory) {
      throw new Error(`Agent factory not found for type: ${agentType}`);
    }

    const agent = factory();
    this.instances.set(agent.getId(), agent);
    return agent;
  }

  /**
   * Get an existing agent instance
   */
  getAgent(agentId: string): BaseAgent | undefined {
    return this.instances.get(agentId);
  }

  /**
   * Get all registered agent types
   */
  getRegisteredTypes(): string[] {
    return Array.from(this.factories.keys());
  }

  /**
   * Get all active agent instances
   */
  getActiveAgents(): BaseAgent[] {
    return Array.from(this.instances.values());
  }

  /**
   * Remove an agent instance
   */
  removeAgent(agentId: string): boolean {
    return this.instances.delete(agentId);
  }

  /**
   * Clear all instances (factories remain registered)
   */
  clearInstances(): void {
    this.instances.clear();
  }
}

// Singleton instance
export const agentRegistry = new AgentFactoryRegistry();
