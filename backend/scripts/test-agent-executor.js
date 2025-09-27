require("dotenv").config();
const agentExecutor = require("../src/services/agent-executor.service");

/**
 * Test script for Agent Executor Service
 * Tests execution of individual agents and agent sequences
 */

// Sample agent sequence data (matches the structure from AgentSequencerService)
const sampleAgentSequence = [
    {
        agentAddress: "0x34D5a31c1b74ff7d2682743708a5C6Ac3CB30627",
        agentPrompt: "Scrape data from https://example.com and extract product information including prices and descriptions",
        cost: 0.000045,
        agentName: "web_scraper_agent",
        agentId: "550e8400-e29b-41d4-a716-446655440001",
        valid: true
    },
    {
        agentAddress: "0x53185299C535286c57e2338e35ebd8A56C9Ab2Dd",
        agentPrompt: "Analyze the scraped product data and identify pricing trends, popular categories, and market insights",
        cost: 0.000067,
        agentName: "data_analyzer_agent",
        agentId: "550e8400-e29b-41d4-a716-446655440002",
        valid: true
    },
    {
        agentAddress: "0x2f7D95566BfAF09Ee5CA41765486181bdC827583",
        agentPrompt: "Generate SEO optimization recommendations for the product pages based on the analyzed data",
        cost: 0.000089,
        agentName: "seo_optimization_agent",
        agentId: "550e8400-e29b-41d4-a716-446655440003",
        valid: true
    }
];

async function testSingleAgentExecution() {
    console.log("🧪 Testing single agent execution...");
    console.log("=".repeat(50));

    const singleAgent = sampleAgentSequence[0];

    try {
        const result = await agentExecutor.executeAgent(singleAgent);

        console.log("\n✅ Single agent execution result:");
        console.log(JSON.stringify(result, null, 2));

        return result;
    } catch (error) {
        console.error("❌ Single agent execution failed:", error);
        return null;
    }
}

async function testAgentSequenceExecution() {
    console.log("\n🧪 Testing agent sequence execution...");
    console.log("=".repeat(50));

    try {
        const results = await agentExecutor.executeAgentSequence(sampleAgentSequence);

        console.log("\n✅ Agent sequence execution results:");
        results.forEach((result, index) => {
            console.log(`\n--- Agent ${index + 1} Result ---`);
            console.log(`Agent: ${result.agentName}`);
            console.log(`Status: ${result.status}`);
            console.log(`Cost: $${result.executionCost.toFixed(6)}`);
            console.log(`Result Type: ${result.result?.type || 'N/A'}`);

            if (result.status === 'failed') {
                console.log(`Error: ${result.error}`);
            }
        });

        // Calculate total execution cost
        const totalCost = results.reduce((sum, result) => sum + result.executionCost, 0);
        console.log(`\n💰 Total Execution Cost: $${totalCost.toFixed(6)}`);

        return results;
    } catch (error) {
        console.error("❌ Agent sequence execution failed:", error);
        return null;
    }
}

async function testInvalidAgentHandling() {
    console.log("\n🧪 Testing invalid agent handling...");
    console.log("=".repeat(50));

    const invalidAgent = {
        agentAddress: "0xInvalidAddress",
        agentPrompt: "", // Empty prompt
        cost: 0.000001,
        agentName: "invalid_agent",
        agentId: "invalid-id",
        valid: false
    };

    try {
        const result = await agentExecutor.executeAgent(invalidAgent);

        console.log("\n✅ Invalid agent handling result:");
        console.log(`Status: ${result.status}`);
        console.log(`Error: ${result.error || 'No error'}`);

        return result;
    } catch (error) {
        console.error("❌ Invalid agent test failed:", error);
        return null;
    }
}

async function testDummyResponseGeneration() {
    console.log("\n🧪 Testing dummy response generation for all agent types...");
    console.log("=".repeat(50));

    const testAgents = [
        { agentName: "web_scraper_agent", agentAddress: "0x123", agentPrompt: "Test web scraping", cost: 0.001 },
        { agentName: "data_analyzer_agent", agentAddress: "0x456", agentPrompt: "Test data analysis", cost: 0.002 },
        { agentName: "seo_optimization_agent", agentAddress: "0x789", agentPrompt: "Test SEO optimization", cost: 0.003 },
        { agentName: "github_code_agent", agentAddress: "0xabc", agentPrompt: "Test code generation", cost: 0.004 },
        { agentName: "unknown_agent", agentAddress: "0xdef", agentPrompt: "Test unknown agent", cost: 0.005 }
    ];

    for (const agent of testAgents) {
        console.log(`\n--- Testing ${agent.agentName} ---`);
        const response = agentExecutor.generateDummyResponse(agent);
        console.log(`Response Type: ${response.result.type}`);
        console.log(`Status: ${response.status}`);
        console.log(`Has Data: ${!!response.result.data}`);
    }
}

async function runAllTests() {
    console.log("🚀 Starting Agent Executor Service Tests");
    console.log("=".repeat(60));

    try {
        // Test 1: Single agent execution
        await testSingleAgentExecution();

        // Test 2: Agent sequence execution
        await testAgentSequenceExecution();

        // Test 3: Invalid agent handling
        await testInvalidAgentHandling();

        // Test 4: Dummy response generation
        await testDummyResponseGeneration();

        console.log("\n🎉 All tests completed successfully!");

    } catch (error) {
        console.error("❌ Test suite error:", error);
    }
}

// Run the tests
runAllTests().catch(console.error); 