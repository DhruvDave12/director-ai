export interface AgentConfig {
  id: string;
  name: string;
  description?: string;
  version: string;
  capabilities: string[];
  metadata?: Record<string, any>;
}

export interface AgentRequest {
  payload?: any;
  context?: Record<string, any>;
}

export interface AgentResponse {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: Record<string, any>;
}

export interface AgentExecutionContext {
  requestId: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

export abstract class BaseAgent {
  protected config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  abstract execute(
    request: AgentRequest,
    context: AgentExecutionContext
  ): Promise<AgentResponse>;

  abstract healthCheck(): Promise<boolean>;

  getConfig(): AgentConfig {
    return { ...this.config };
  }

  getId(): string {
    return this.config.id;
  }

  getName(): string {
    return this.config.name;
  }

  getCapabilities(): string[] {
    return [...this.config.capabilities];
  }
}

export type AgentFactory = () => BaseAgent;
