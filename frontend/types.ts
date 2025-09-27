export interface IPlan {
  agentAddress: string;
  agentPrompt: string;
  cost: number;
  agentName: string;
  agentId: string;
  valid: boolean;
}

export interface IServerExecutionPlan {
  agentAddress: string;
  agentPrompt: string;
  agentDescription: string;
  agentImage: string;
  agentName: string;
  agentPrice: number;
  agentUrl: string;
}


export interface IOutput {
  agentAddress: string;
  response: string;
  prompt: string;
  attestationId: string;
  score: number;
  agentPrice: number;
}


export interface IAgentResult {
  agentAddress: string;
  agentName: string;
  executionCost: number;
  timestamp: string;
  status: string;
  result: {
    _meta?: {
      "x402/payment-response"?: {
        success: boolean;
        transaction: string;
        network: string;
        payer: string;
      };
    };
    content: Array<{
      type: string;
      text: string;
    }>;
  };
  inputPrompt: string;
}

export interface IExecutionSummary {
  totalAgents: number;
  successfulAgents: number;
  failedAgents: number;
  totalCost: number;
}

export interface IFinalOutput {
  jobId: string;
  status: string;
  timestamp: string;
  executionSummary: IExecutionSummary;
  results: IAgentResult[];
  txHash?: string;
}


export interface IAgent {
  name: string;
  description: string;
}