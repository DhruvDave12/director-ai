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
    try {
      console.log("🔌 Initializing MCP client connection...");
      this.client = await getClient();
      console.log("✅ MCP client connected successfully");
    } catch (error) {
      console.error("❌ Failed to initialize MCP client:", error);
      throw new Error(`MCP client initialization failed: ${error.message}`);
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
   * Execute multiple agents in sequence
   * @param {Array} agentSequence - Array of agent objects
   * @returns {Promise<Array>} Array of execution results
   */
  async executeAgentSequence(agentSequence) {
    console.log(`🚀 Starting execution of ${agentSequence.length} agents...`);

    const results = [];

    for (let i = 0; i < agentSequence.length; i++) {
      await this.initializeClient();
      const agent = agentSequence[i];
      console.log(`\n📍 Executing agent ${i + 1}/${agentSequence.length}`);

      console.log("[AGENT EXECUTOR] 🔍 RESULTS: ", results);

      const previousResponse =
        i === 0 ? null : results[i - 1].result.content[0].text;

      const result = await this.executeAgentWithMCP(agent, previousResponse);
      results.push(result);

      // Add small delay between agents to simulate real execution
      if (i < agentSequence.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    console.log(
      `\n🎉 Completed execution of all ${agentSequence.length} agents`
    );
    return results;
  }

  /**
   * Execute agents with real MCP calls (future implementation)
   * @param {Object} agentItem - Single agent object
   * @returns {Promise<Object>} Real execution result
   */
  async executeAgentWithMCP(agentItem, prevResponse) {
    // TODO: Implement actual MCP tool calls
    // This will be similar to the test-mcp-client.js functions

    try {
      console.log("[AGENT EXECUTOR] 🔍 Executing agent: ", agentItem);

      const isWebScraper = agentItem.agentName === "web_scraper_agent";
      let finalPrompt = prevResponse
        ? `Context: ${prevResponse} \n User Prompt: ${agentItem.agentPrompt}`
        : agentItem.agentPrompt;

      if (isWebScraper) {
        // Extract URL from the prompt for web scraper - improved regex with error handling
        const urlMatch = agentItem.agentPrompt.match(
          /https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*)?(?:\?[^#\s]*)?(?:#[^\s]*)?/i
        );
        if (urlMatch) {
          finalPrompt = urlMatch[0];
          console.log(
            "[AGENT EXECUTOR] 🌐 Extracted URL for web scraper:",
            finalPrompt
          );
        } else {
          console.warn(
            "[AGENT EXECUTOR] ⚠️  No valid URL found in web scraper prompt:",
            agentItem.agentPrompt
          );
          // Fallback: try simple URL pattern
          const simpleUrlMatch =
            agentItem.agentPrompt.match(/https?:\/\/[^\s]+/);
          if (simpleUrlMatch) {
            finalPrompt = simpleUrlMatch[0];
            console.log(
              "[AGENT EXECUTOR] 🌐 Extracted URL with fallback regex:",
              finalPrompt
            );
          }
        }
      }

      console.log("[AGENT EXECUTOR] 🔍 Sending callTool():", {
        name: agentItem.agentName,
        arguments: {
          prompt: finalPrompt,
          agentID: agentItem.agentName,
        },
      });

      const response = await this.client.callTool({
        name: agentItem.agentName,
        arguments: {
          prompt: finalPrompt,
          agentID: agentItem.agentName,
        },
      });

      console.log(
        "[AGENT EXECUTOR] 🔍 Name: ",
        agentItem.agentName,
        " Response:",
        response
      );

      return {
        agentAddress: agentItem.agentAddress,
        agentName: agentItem.agentName,
        executionCost: agentItem.cost,
        timestamp: new Date().toISOString(),
        status: "completed",
        result: response,
        inputPrompt: agentItem.agentPrompt,
      };
    } catch (error) {
      console.error(
        `❌ MCP execution failed for ${agentItem.agentName}:`,
        error
      );
      throw error;
    }
  }
}

module.exports = new AgentExecutorService();
