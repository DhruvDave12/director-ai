require("dotenv").config();
const { Redis } = require('@upstash/redis');
const { v4: uuidv4 } = require('uuid');

/**
 * Script to populate Redis with initial agent data
 * This script sets up the 4 core agents for the orchestrator system
 */

// Initialize Redis with proper configuration
let redis;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = Redis.fromEnv();
} else if (process.env.REDIS_URL) {
  // Parse Redis URL for Upstash format: rediss://default:password@host:port
  const redisUrl = process.env.REDIS_URL;
  const url = new URL(redisUrl);
  const token = url.password;
  const restUrl = `https://${url.hostname}/`;

  redis = new Redis({
    url: restUrl,
    token: token
  });
} else {
  throw new Error("Redis configuration not found. Set either UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN or REDIS_URL");
}

const agents = [
  {
    id: uuidv4(),
    name: "web_scraper_agent",
    description: "Specialises in scraping data from websites",
    address: "0x34D5a31c1b74ff7d2682743708a5C6Ac3CB30627",
    costPerOutputToken: 0.000001, // $0.000001 per output token
  },
  {
    id: uuidv4(),
    name: "seo_optimization_agent",
    description: "Specialises in suggesting seo optimisations",
    address: "0x2f7D95566BfAF09Ee5CA41765486181bdC827583",
    costPerOutputToken: 0.000003, // $0.000003 per output token
  },
  {
    id: uuidv4(),
    name: "github_code_agent",
    description:
      "Specialises in writing and pushing code to a github repository via pull requests",
    address: "0xBe53bed7B566b5c5a11361664cf9eaE5bB18Ed9a",
    costPerOutputToken: 0.000005, // $0.000005 per output token
  },
  {
    id: uuidv4(),
    name: "reddit_sentiment_agent",
    description:
      "Specialises in analysing reddit sentiment and generating a gtm strategy",
    address: "0x44D44273687060902990E6015D64632180529626",
    costPerOutputToken: 0.000001, // $0.000001 per output token
  },
  {
    id: uuidv4(),
    name: "image_generation_agent",
    description: "Specialises in generating images from text prompts",
    address: "0x93b0963E157359E77381270361692589062b162D",
    costPerOutputToken: 0.000001, // $0.000001 per output token
  },
  {
    id: uuidv4(),
    name: "content_analysis_agent",
    description: "Specialises in analysing content and providing insights",
    address: "0x1734424505540188195351964754846154681093",
    costPerOutputToken: 0.000002, // $0.000001 per output token
  },
  {
    id: uuidv4(),
    name: "farcaster_sentiment_agent",
    description: "Specialises in analysing farcaster sentiment and generating a gtm strategy",
    address: "0x70181B550073B296D50b843b134440270B275050",
    costPerOutputToken: 0.000003, // $0.000001 per output token
  },
];

async function setupAgents() {
  try {
    console.log("🚀 Setting up agents in Redis...");
    console.log("📊 Redis URL:", process.env.REDIS_URL ? "✅ Configured" : "❌ Missing");

    // Test Redis connection
    await redis.ping();
    console.log("🔗 Redis connection successful");

    // Clear existing agent data
    console.log("🧹 Clearing existing agent data...");
    const existingKeys = await redis.keys('AGENT_*');
    if (existingKeys.length > 0) {
      await Promise.all(existingKeys.map(key => redis.del(key)));
      console.log(`🗑️ Cleared ${existingKeys.length} existing agent entries`);
    }

    // Insert new agent data
    console.log("📝 Inserting agent data...");
    const insertPromises = agents.map(async (agent) => {
      const key = `AGENT_${agent.id}`;
      await redis.set(key, JSON.stringify(agent));
      console.log(`   ✅ ${agent.name} (${agent.address})`);
      return key;
    });

    await Promise.all(insertPromises);

    console.log(`\n🎉 Successfully set up ${agents.length} agents in Redis!`);
    console.log("\n📋 Agent Summary:");
    agents.forEach((agent, index) => {
      console.log(`   ${index + 1}. ${agent.name}`);
      console.log(`      Address: ${agent.address}`);
      console.log(`      Cost/Token: $${agent.costPerOutputToken}`);
      console.log(`      ID: ${agent.id}\n`);
    });

    // Verify the data was stored correctly
    console.log("🔍 Verifying stored data...");
    const verifyKeys = await redis.keys('AGENT_*');
    console.log(`✅ Found ${verifyKeys.length} agent entries in Redis`);

    const sampleAgent = await redis.get(verifyKeys[0]);
    const agentData = typeof sampleAgent === 'string' ? JSON.parse(sampleAgent) : sampleAgent;
    console.log("📄 Sample agent data:", agentData);

    console.log("\n✅ Agent setup completed successfully!");

  } catch (error) {
    console.error("❌ Error setting up agents:", error);
    console.error("💡 Make sure your REDIS_URL environment variable is set correctly");
    console.error("💡 Check your .env file in the backend directory");
    process.exit(1);
  }
}

// Helper function to list all agents
async function listAgents() {
  try {
    console.log("📋 Listing all agents from Redis...");
    const keys = await redis.keys('AGENT_*');

    if (keys.length === 0) {
      console.log("❌ No agents found. Run setup first.");
      return;
    }

    const agentPromises = keys.map(key => redis.get(key));
    const agentDataArray = await Promise.all(agentPromises);

    const agents = agentDataArray
      .filter(data => data !== null)
      .map(data => typeof data === 'string' ? JSON.parse(data) : data);

    console.log(`\n🤖 Found ${agents.length} agents:\n`);
    agents.forEach((agent, index) => {
      console.log(`${index + 1}. ${agent.name}`);
      console.log(`   Address: ${agent.address}`);
      console.log(`   Description: ${agent.description}`);
      console.log(`   Cost/Token: $${agent.costPerOutputToken}`);
      console.log(`   ID: ${agent.id}\n`);
    });

  } catch (error) {
    console.error("❌ Error listing agents:", error);
  }
}

// Check command line arguments
const command = process.argv[2];

if (command === 'list') {
  listAgents();
} else if (command === 'setup' || !command) {
  setupAgents();
} else {
  console.log("Usage:");
  console.log("  node scripts/setup-agents.js setup  # Set up initial agents");
  console.log("  node scripts/setup-agents.js list   # List all agents");
}
