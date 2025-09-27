require("dotenv").config();
const { getClient } = require("./agent-payer.service");

/**
 * Agent Executor Service
 * Handles execution of individual agents from the agentSequence
 */
class AgentExecutorService {
    constructor() {
        this.client = null;
    }

    /**
     * Initialize MCP client connection
     * @returns {Promise<void>}
     */
    async initializeClient() {
        if (!this.client) {
            try {
                console.log("🔌 Initializing MCP client connection...");
                this.client = await getClient();
                console.log("✅ MCP client connected successfully");
            } catch (error) {
                console.error("❌ Failed to initialize MCP client:", error);
                throw new Error(`MCP client initialization failed: ${error.message}`);
            }
        }
    }

    /**
     * Close MCP client connection
     * @returns {Promise<void>}
     */
    async closeClient() {
        if (this.client) {
            try {
                await this.client.close();
                this.client = null;
                console.log("🔌 MCP client connection closed");
            } catch (error) {
                console.error("❌ Error closing MCP client:", error);
            }
        }
    }

    /**
     * Generate dummy response based on agent type
     * @param {Object} agentItem - Single agent from agentSequence
     * @returns {Object} Dummy response object
     */
    generateDummyResponse(agentItem) {
        const { agentName, agentPrompt, agentAddress, cost } = agentItem;

        const baseResponse = {
            agentAddress,
            agentName,
            executionCost: cost,
            timestamp: new Date().toISOString(),
            status: "completed",
            inputPrompt: agentPrompt
        };

        // Generate different dummy responses based on agent type
        switch (agentName) {
            case "web_scraper_agent":
                return {
                    ...baseResponse,
                    result: {
                        type: "web_scraping",
                        data: {
                            url: "https://example.com",
                            title: "Example Website",
                            content: "Scraped content from the website...",
                            metadata: {
                                scrapedAt: new Date().toISOString(),
                                contentLength: 1250,
                                links: ["https://example.com/page1", "https://example.com/page2"]
                            }
                        }
                    }
                };

            case "data_analyzer_agent":
                return {
                    ...baseResponse,
                    result: {
                        type: "data_analysis",
                        data: {
                            insights: [
                                "Key trend identified in the data",
                                "Statistical significance found in metrics",
                                "Anomaly detected in recent patterns"
                            ],
                            metrics: {
                                totalRecords: 1500,
                                accuracy: 0.94,
                                confidence: 0.87
                            },
                            summary: "Analysis completed successfully with high confidence"
                        }
                    }
                };

            case "seo_optimization_agent":
                return {
                    ...baseResponse,
                    result: {
                        type: "seo_optimization",
                        data: {
                            recommendations: [
                                "Optimize meta descriptions for better CTR",
                                "Improve page loading speed",
                                "Add structured data markup"
                            ],
                            seoScore: 78,
                            improvements: {
                                titleTags: "optimized",
                                headings: "improved",
                                keywords: "enhanced"
                            }
                        }
                    }
                };

            case "github_code_agent":
                return {
                    ...baseResponse,
                    result: {
                        type: "code_generation",
                        data: {
                            repository: "example/project",
                            pullRequest: "https://github.com/example/project/pull/123",
                            filesModified: ["src/components/Button.tsx", "src/utils/helpers.js"],
                            linesAdded: 45,
                            linesRemoved: 12,
                            status: "PR created successfully"
                        }
                    }
                };

            default:
                return {
                    ...baseResponse,
                    result: {
                        type: "generic",
                        data: {
                            message: "Agent executed successfully",
                            output: "Generic agent response"
                        }
                    }
                };
        }
    }

    /**
     * Execute a single agent from the agentSequence
     * @param {Object} agentItem - Single agent object from agentSequence
     * @returns {Promise<Object>} Agent execution result
     */
    async executeAgent(agentItem) {
        try {
            console.log(`🤖 Executing agent: ${agentItem.agentName} (${agentItem.agentAddress})`);
            console.log(`📝 Task: ${agentItem.agentPrompt.substring(0, 100)}${agentItem.agentPrompt.length > 100 ? '...' : ''}`);

            // Validate agent item structure
            if (!agentItem.agentAddress || !agentItem.agentPrompt || !agentItem.agentName) {
                throw new Error("Invalid agent item: missing required fields");
            }

            // For now, return dummy response
            // TODO: Replace with actual MCP tool calls when ready
            const dummyResponse = this.generateDummyResponse(agentItem);

            console.log(`✅ Agent ${agentItem.agentName} executed successfully`);
            console.log(`💰 Cost: $${agentItem.cost.toFixed(6)}`);

            return dummyResponse;

        } catch (error) {
            console.error(`❌ Error executing agent ${agentItem.agentName}:`, error);

            return {
                agentAddress: agentItem.agentAddress,
                agentName: agentItem.agentName,
                executionCost: agentItem.cost,
                timestamp: new Date().toISOString(),
                status: "failed",
                error: error.message,
                inputPrompt: agentItem.agentPrompt
            };
        }
    }

    /**
     * Execute multiple agents in sequence
     * @param {Array} agentSequence - Array of agent objects
     * @returns {Promise<Array>} Array of execution results
     */
    async executeAgentSequence(agentSequence) {
        console.log(`🚀 Starting execution of ${agentSequence.length} agents...`);

        const results = [];

        for (let i = 0; i < agentSequence.length; i++) {
            const agent = agentSequence[i];
            console.log(`\n📍 Executing agent ${i + 1}/${agentSequence.length}`);

            const result = await this.executeAgent(agent);
            results.push(result);

            // Add small delay between agents to simulate real execution
            if (i < agentSequence.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        console.log(`\n🎉 Completed execution of all ${agentSequence.length} agents`);
        return results;
    }

    /**
     * Execute agents with real MCP calls (future implementation)
     * @param {Object} agentItem - Single agent object
     * @returns {Promise<Object>} Real execution result
     */
    async executeAgentWithMCP(agentItem) {
        // TODO: Implement actual MCP tool calls
        // This will be similar to the test-mcp-client.js functions

        await this.initializeClient();

        try {
            // Convert agent address to tool name format
            const toolName = `agent_${agentItem.agentAddress.toLowerCase()}`;

            const response = await this.client.callTool({
                name: toolName,
                arguments: {
                    prompt: agentItem.agentPrompt,
                    agentID: agentItem.agentId
                }
            });

            return {
                agentAddress: agentItem.agentAddress,
                agentName: agentItem.agentName,
                executionCost: agentItem.cost,
                timestamp: new Date().toISOString(),
                status: "completed",
                result: response,
                inputPrompt: agentItem.agentPrompt
            };

        } catch (error) {
            console.error(`❌ MCP execution failed for ${agentItem.agentName}:`, error);
            throw error;
        }
    }
}

module.exports = new AgentExecutorService();
