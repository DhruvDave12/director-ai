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
