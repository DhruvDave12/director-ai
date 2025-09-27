require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Redis } = require('@upstash/redis');
const { v4: uuidv4 } = require('uuid');

class AgentSequencerService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    
    // Initialize Redis with proper configuration
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      this.redis = Redis.fromEnv();
    } else if (process.env.REDIS_URL) {
      // Parse Redis URL for Upstash format: rediss://default:password@host:port
      const redisUrl = process.env.REDIS_URL;
      const url = new URL(redisUrl);
      const token = url.password;
      const restUrl = `https://${url.hostname}/`;
      
      this.redis = new Redis({
        url: restUrl,
        token: token
      });
    } else {
      throw new Error("Redis configuration not found. Set either UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN or REDIS_URL");
    }
  }

  /**
   * Get all agent data from Redis
   * @returns {Promise<Array>} Array of agent data objects
   */
  async getAllAgents() {
    try {
      console.log("🔍 Fetching all agents from Redis...");
      
      // Get all keys starting with AGENT_
      const keys = await this.redis.keys('AGENT_*');
      
      if (keys.length === 0) {
        console.warn("⚠️ No agents found in Redis. Make sure to populate agent data first.");
        return [];
      }

      // Fetch all agent data in parallel
      const agentPromises = keys.map(key => this.redis.get(key));
      const agentDataArray = await Promise.all(agentPromises);
      
      const agents = agentDataArray
        .filter(data => data !== null)
        .map(data => typeof data === 'string' ? JSON.parse(data) : data);

      console.log(`✅ Retrieved ${agents.length} agents from Redis`);
      return agents;
    } catch (error) {
      console.error("❌ Error fetching agents from Redis:", error);
      throw new Error(`Failed to fetch agents: ${error.message}`);
    }
  }

  /**
   * Calculate cost for agent execution
   * @param {string} input - The input prompt
   * @param {number} costPerOutputToken - Cost per output token for the agent
   * @returns {number} Calculated cost
   */
  calculateAgentCost(input, costPerOutputToken) {
    const inputLength = input.length;
    return inputLength * 10 * costPerOutputToken;
  }

  /**
   * Get agent sequence and cost estimation using Gemini
   * @param {string} prompt - The user prompt
   * @returns {Promise<Object>} Object containing agent sequence, costs, and metadata
   */
  async getAgentSequence(prompt) {
    try {
      console.log("🤖 Getting agent sequence for prompt...");
      
      // Fetch all available agents
      const agents = await this.getAllAgents();
      
      if (agents.length === 0) {
        throw new Error("No agents available in the system");
      }

      // Build the agent list string for Gemini
      const agentListString = agents
        .map((agent, index) => 
          `${index + 1}. agentAddress = ${agent.address} - ${agent.description}`
        )
        .join('\n');

      // Construct the prompt for Gemini
      const geminiPrompt = `
You are an intelligent agent orchestrator. Your task is to analyze a user request and select the most cost-effective combination of specialized agents to complete it.

OBJECTIVE: Decompose the user request into specific, actionable tasks and assign them to the most suitable agents.

CONSTRAINTS:
- Only select agents that are truly necessary for the request
- Break complex requests into smaller, distinct tasks 
- Avoid task duplication or overlap between agents
- Prioritize cost efficiency - use fewer agents when possible
- Each agent should have a clear, specific objective

USER REQUEST: "${prompt}"

AVAILABLE AGENTS:
${agentListString}

TASK ASSIGNMENT RULES:
1. Analyze what the user actually needs accomplished
2. Identify the minimum set of agents required
3. Create specific, actionable prompts for each selected agent
4. Ensure logical task sequencing and dependencies
5. Maximize value while minimizing cost

OUTPUT FORMAT: Return ONLY a valid JSON array. Each object must have this exact structure:
{ "agentAddress": "0x...", "agentPrompt": "specific task description" }

IMPORTANT: 
- agentAddress must match exactly from the available agents list
- agentPrompt should be a clear, actionable instruction for that specific agent
- Return empty array [] if no agents are needed for the request
- NO additional text, explanations, or formatting - just the JSON array
`;

      console.log("📤 Sending request to Gemini...");
      
      // Call Gemini API
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash", }); // has dynamic "thinking"
      const result = await model.generateContent(geminiPrompt);
      const response = await result.response;
      let geminiOutput = response.text().trim();

      console.log("📥 Received response from Gemini");

      // Clean up the response to ensure it's valid JSON
      if (geminiOutput.startsWith('```json')) {
        geminiOutput = geminiOutput.replace(/```json\n?/, '').replace(/```$/, '');
      } else if (geminiOutput.startsWith('```')) {
        geminiOutput = geminiOutput.replace(/```\n?/, '').replace(/```$/, '');
      }

      // Parse the Gemini response
        let agentSequence;
      try {
        agentSequence = JSON.parse(geminiOutput);
      } catch (parseError) {
        console.error("❌ Failed to parse Gemini response:", geminiOutput);
        throw new Error(`Invalid JSON response from Gemini: ${parseError.message}`);
      }

      if (!Array.isArray(agentSequence)) {
        throw new Error("Gemini response is not an array");
      }

      // Validate and enrich the agent sequence with cost calculations
      const enrichedAgentSequence = agentSequence.map(sequenceItem => {
        const agent = agents.find(a => a.address.toLowerCase() === sequenceItem.agentAddress.toLowerCase());
        
        if (!agent) {
          console.warn(`⚠️ Agent with address ${sequenceItem.agentAddress} not found`);
          return {
            ...sequenceItem,
            cost: 0,
            agentName: "Unknown Agent",
            valid: false
          };
        }

        const cost = this.calculateAgentCost(sequenceItem.agentPrompt, agent.costPerOutputToken);
        
        return {
          ...sequenceItem,
          cost: cost,
          agentName: agent.name,
          agentId: agent.id,
          valid: true
        };
      });

      // Filter out invalid agents
      const validAgentSequence = enrichedAgentSequence.filter(agentSequenceItem => agentSequenceItem.valid);
      const invalidCount = enrichedAgentSequence.length - validAgentSequence.length;
      
      if (invalidCount > 0) {
        console.warn(`⚠️ ${invalidCount} agents were invalid and filtered out`);
      }

      // Calculate total cost
      const totalCost = validAgentSequence.reduce((sum, agentSequenceItem) => sum + agentSequenceItem.cost, 0);

      const jobId = uuidv4();

      const jobProcessingSequence = {
        jobId: jobId,
        agentSequence: validAgentSequence,
        totalCost: totalCost,
        agentCount: validAgentSequence.length,
        originalPrompt: prompt,
        timestamp: new Date().toISOString()
      };

      console.log(`✅ Generated quote with ${validAgentSequence.length} agents, total cost: $${totalCost.toFixed(6)}`);
      
      return jobProcessingSequence;

    } catch (error) {
      console.error("❌ Error in getAgentSequence:", error);
      throw new Error(`Failed to generate agent sequence: ${error.message}`);
    }
  }
}

module.exports = new AgentSequencerService();