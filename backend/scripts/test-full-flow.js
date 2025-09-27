require("dotenv").config();
const axios = require("axios");

/**
 * Full Flow Test Script
 * Tests the complete workflow: Quote → Execute
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const API_BASE = `${BASE_URL}/api/jobs`;

// Test prompts for different scenarios
const testPrompts = [
    {
        name: "E-commerce Analysis",
        prompt: "I need to analyze competitor pricing for my e-commerce store. Please scrape data from major competitors, analyze pricing trends, and provide SEO recommendations for my product pages."
    },
    {
        name: "Simple Web Scraping",
        prompt: "Scrape product information from https://example.com"
    },
    {
        name: "Code Repository Task",
        prompt: "Create a new React component for user authentication and push it to my GitHub repository"
    }
];

async function testQuoteGeneration(prompt) {
    console.log(`📝 Testing quote generation for: "${prompt.substring(0, 50)}..."`);

    try {
        const response = await axios.post(`${API_BASE}/quote`, {
            prompt: prompt
        });

        if (response.data.success) {
            console.log("✅ Quote generated successfully");
            console.log(`   Job ID: ${response.data.jobId}`);
            console.log(`   Agents: ${response.data.agentCount}`);
            console.log(`   Total Cost: $${response.data.totalCost.toFixed(6)}`);

            // Log agent sequence details
            response.data.agentSequence.forEach((agent, index) => {
                console.log(`   ${index + 1}. ${agent.agentName} - $${agent.cost.toFixed(6)}`);
            });

            return response.data;
        } else {
            console.error("❌ Quote generation failed:", response.data);
            return null;
        }
    } catch (error) {
        console.error("❌ Quote request failed:", error.response?.data || error.message);
        return null;
    }
}

async function testJobExecution(jobId, agentSequence) {
    console.log(`🚀 Testing job execution for: ${jobId}`);

    try {
        const response = await axios.post(`${API_BASE}/execute`, {
            jobId: jobId,
            agentSequence: agentSequence
        });

        console.log("✅ Job execution completed");
        console.log(`   Status: ${response.data.status}`);
        console.log(`   Total Agents: ${response.data.executionSummary.totalAgents}`);
        console.log(`   Successful: ${response.data.executionSummary.successfulAgents}`);
        console.log(`   Failed: ${response.data.executionSummary.failedAgents}`);
        console.log(`   Total Cost: $${response.data.executionSummary.totalCost.toFixed(6)}`);

        // Log individual agent results
        response.data.results.forEach((result, index) => {
            console.log(`   ${index + 1}. ${result.agentName}: ${result.status} (${result.result?.type || 'N/A'})`);
        });

        return response.data;
    } catch (error) {
        console.error("❌ Job execution failed:", error.response?.data || error.message);
        return null;
    }
}

async function testFullWorkflow(testCase) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`🧪 Testing: ${testCase.name}`);
    console.log(`${"=".repeat(60)}`);

    try {
        // Step 1: Generate quote
        const quote = await testQuoteGeneration(testCase.prompt);
        if (!quote) {
            console.error("❌ Cannot proceed without quote");
            return false;
        }

        console.log("\n⏳ Waiting 1 second before execution...");
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Step 2: Execute job
        const execution = await testJobExecution(quote.jobId, quote.agentSequence);
        if (!execution) {
            console.error("❌ Job execution failed");
            return false;
        }

        console.log(`\n✅ Full workflow completed for: ${testCase.name}`);
        return true;
    } catch (error) {
        console.error(`❌ Workflow error for ${testCase.name}:`, error);
        return false;
    }
}

async function testErrorHandling() {
    console.log(`\n${"=".repeat(60)}`);
    console.log("🧪 Testing Error Handling");
    console.log(`${"=".repeat(60)}`);

    // Test 1: Empty prompt
    console.log("\n--- Testing empty prompt ---");
    try {
        await axios.post(`${API_BASE}/quote`, { prompt: "" });
    } catch (error) {
        console.log("✅ Empty prompt correctly rejected:", error.response?.status);
    }

    // Test 2: Missing jobId in execute
    console.log("\n--- Testing missing jobId ---");
    try {
        await axios.post(`${API_BASE}/execute`, { agentSequence: [] });
    } catch (error) {
        console.log("✅ Missing jobId correctly rejected:", error.response?.status);
    }

    // Test 3: Empty agentSequence
    console.log("\n--- Testing empty agentSequence ---");
    try {
        await axios.post(`${API_BASE}/execute`, {
            jobId: "test-job-id",
            agentSequence: []
        });
    } catch (error) {
        console.log("✅ Empty agentSequence correctly rejected:", error.response?.status);
    }
}

async function checkServerHealth() {
    console.log("🏥 Checking server health...");

    try {
        const response = await axios.get(`${BASE_URL}/health`);
        console.log("✅ Server is healthy");
        console.log(`   Uptime: ${response.data.uptime.toFixed(2)}s`);
        return true;
    } catch (error) {
        console.error("❌ Server health check failed:", error.message);
        console.error("💡 Make sure the server is running: npm run dev");
        return false;
    }
}

async function runAllTests() {
    console.log("🚀 Starting Full Flow Tests");
    console.log(`🌐 Testing against: ${BASE_URL}`);
    console.log(`${"=".repeat(80)}`);

    // Check server health first
    const serverHealthy = await checkServerHealth();
    if (!serverHealthy) {
        console.error("❌ Cannot run tests - server is not healthy");
        return;
    }

    let successCount = 0;
    let totalTests = testPrompts.length;

    // Test each workflow
    for (const testCase of testPrompts) {
        const success = await testFullWorkflow(testCase);
        if (success) successCount++;
    }

    // Test error handling
    await testErrorHandling();

    // Summary
    console.log(`\n${"=".repeat(80)}`);
    console.log("📊 Test Summary");
    console.log(`${"=".repeat(80)}`);
    console.log(`✅ Successful workflows: ${successCount}/${totalTests}`);
    console.log(`❌ Failed workflows: ${totalTests - successCount}/${totalTests}`);

    if (successCount === totalTests) {
        console.log("🎉 All tests passed!");
    } else {
        console.log("⚠️ Some tests failed. Check the logs above.");
    }
}

// Check if axios is available
if (!axios) {
    console.error("❌ axios is required. Install it with: npm install axios");
    process.exit(1);
}

// Run the tests
runAllTests().catch(console.error); 