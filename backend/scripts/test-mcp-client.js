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

async function testFreeTool(client) {
  console.log("🆓 Testing free tool...");
  
  try {
    const response = await client.callTool({
      name: "test_free_tool",
      arguments: {
        prompt: "Hello from MCP client test!",
        agentID: "test-client-001"
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
  console.log("=" .repeat(50));

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
    await testFreeTool(client);
    
    // Test paid tool
    await testPaidTool(client);
    
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
