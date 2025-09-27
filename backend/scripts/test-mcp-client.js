require("dotenv").config();

const { getClient } = require("../src/services/agent-payer.service");

/**
 * MCP Client Test Script
 * Tests connection to the agent server and calls available tools
 */

async function listAvailableTools(client) {
  console.log("\n📋 Listing available tools...");

  try {
    const tools = await client.listTools();
    console.log("🔧 Available tools:");

    tools.tools.forEach((tool, index) => {
      console.log(`  ${index + 1}. ${tool.name}`);
      console.log(`     Description: ${tool.description}`);
      if (tool.inputSchema?.properties) {
        const params = Object.keys(tool.inputSchema.properties);
        console.log(`     Parameters: ${params.join(', ')}`);
      }
      console.log('');
    });

    return tools.tools;
  } catch (error) {
    console.error("❌ Error listing tools:", error);
    return [];
  }
}
async function testSEOAdvisorChain(client) {
  console.log("🆓 Testing SEO advisor chain...");

  try {
    const scraperResponse = await client.callTool({
      name: "test_free_tool",
      arguments: {
        prompt: "https://thielfellowship.org/",
        agentID: "web_scraper_agent"
      },
    });
    console.log("Web scraping agent completed task ✅")
    const seoResponse = await client.callTool({
      name: "test_free_tool",
      arguments: {
        prompt: scraperResponse.content[0].text,
        agentID: "seo_optimization_agent"
      },
    })
    console.log("SEO Advisor Agent completed task ✅")

    const GITHUB_TEST_URL = "https://github.com/DhruvDave12/Portfolio-SEO"
    const githubResponse = await client.callTool({
      name: "test_free_tool",
      arguments: {
        prompt: `${seoResponse.content[0].text}\n ${GITHUB_TEST_URL}`,
        agentID: "github_code_agent"
      }
    })

    console.log("Github Agent completed task ✅")
    console.log("✅ Free tool response:", JSON.stringify(githubResponse, null, 2));
    return githubResponse;
  } catch (error) {
    console.error("❌ Error calling free tool:", error);
    return null;
  }
}
async function testImageGenerationAgent(client) {
  console.log("🆓 Testing image generation agent...");

  try {
    const response = await client.callTool({
      name: "image_generation_agent",
      arguments: {
        prompt: "Generate a greek demigod named dhruv dave",
        agentID: "image_generation_agent"
      },
    });

    console.log("✅ Image generation agent response:", JSON.stringify(response, null, 2));
    return response;
  } catch (error) {
    console.error("❌ Error calling image generation agent:", error);
    return null;
  }
}

async function testCreativeEmailMarketerAgent(client) {
  console.log("🆓 Testing Email Agent Chain...");

  try {
    const scraperResponse = await client.callTool({
      name: "test_free_tool",
      arguments: {
        prompt: "https://cred.club/",
        agentID: "web_scraper_agent"
      },
    });
    console.log("Web scraping agent completed task ✅")

    const redditResponse = await client.callTool({
      name: "test_free_tool",
      arguments: {
        prompt: scraperResponse.content[0].text,
        agentID: "reddit_sentiment_agent"
      },
    })
    console.log("Reddit sentiment agent completed task ✅")

    console.log("✅ Free tool response:", JSON.stringify(redditResponse, null, 2));
    return redditResponse;
  } catch (error) {
    console.error("❌ Error calling free tool:", error);
    return null;
  }
}

async function testFreeTool(client) {
  console.log("🆓 Testing free tool...");

  try {
    const response = await client.callTool({
      name: "test_free_tool",
      arguments: {
        prompt: "https://thielfellowtip.org/",
        agentID: "web_scraper_agent"
      },
    });


    console.log("✅ Free tool response:", JSON.stringify(response, null, 2));
    return response;
  } catch (error) {
    console.error("❌ Error calling free tool:", error);
    return null;
  }
}

async function testPaidTool(client) {
  console.log("💰 Testing paid weather tool...");

  try {
    const response = await client.callTool({
      name: "test_weather",
      arguments: {
        prompt: "What's the weather like?",
        city: "San Francisco",
        agentID: "test-client-001"
      },
    });

    console.log("✅ Paid tool response:", JSON.stringify(response, null, 2));
    return response;
  } catch (error) {
    console.error("❌ Error calling paid tool:", error);
    return null;
  }
}

async function runTests() {
  console.log("🧪 Starting MCP Client Tests");
  console.log("=".repeat(50));

  let client;

  try {
    // Connect to MCP server
    client = await getClient();

    // List available tools
    const tools = await listAvailableTools(client);

    if (tools.length === 0) {
      console.log("❌ No tools available. Make sure the agent server is running.");
      return;
    }

    // Test free tool
    // await testFreeTool(client);
    // await testSEOAdvisorChain(client);

    await testImageGenerationAgent(client);

    // Test paid tool
    // await testPaidTool(client);

    console.log("\n🎉 All tests completed!");

  } catch (error) {
    console.error("❌ Test error:", error);

    if (error.code === 'ECONNREFUSED') {
      console.error("💡 Make sure the agent server is running:");
      console.error("   cd agent-server && npm run dev");
    }

    if (error.message.includes('EVM_PRIVATE_KEY')) {
      console.error("💡 Make sure EVM_PRIVATE_KEY is set in your .env file");
    }

  } finally {
    if (client) {
      try {
        await client.close();
        console.log("🔌 Client connection closed");
      } catch (error) {
        console.error("Error closing client:", error);
      }
    }
  }
}

// Run the tests
runTests().catch(console.error);
