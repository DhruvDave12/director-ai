require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getClient } = require("./services/agent-payer.service");
const agentOrderer = require("./services/agent-sequencer.service");
const agentExecutor = require("./services/agent-executor.service");

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Jobs Router
const jobsRouter = express.Router();

// Get quote endpoint
jobsRouter.post("/quote", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    console.log(
      `📝 Generating quote for prompt: "${prompt.substring(0, 100)}${prompt.length > 100 ? "..." : ""
      }"`
    );

    // Use agent sequencer service to get execution plan and costs
    const quote = await agentOrderer.getAgentSequence(prompt);

    res.json({
      success: true,
      ...quote,
    });
  } catch (error) {
    console.error("❌ Error generating quote:", error);
    res.status(500).json({
      error: "Failed to generate quote",
      message: error.message,
    });
  }
});

// Execute job endpoint
jobsRouter.post("/execute", async (req, res) => {
  try {
    const { jobId, agentSequence, transferHash, initialPrompt } = req.body;

    if (!jobId || !agentSequence) {
      return res.status(400).json({
        error: "jobId and agentSequence are required",
      });
    }

    console.log(`🚀 Starting execution for job: ${jobId}`);
    console.log(`📋 Agent sequence contains ${agentSequence.length} agents`);

    // Validate agentSequence structure
    if (!Array.isArray(agentSequence) || agentSequence.length === 0) {
      return res.status(400).json({
        error: "Invalid agentSequence: must be a non-empty array",
        jobId: jobId
      });
    }

    // Execute the agent sequence
    const executionResults = await agentExecutor.executeAgentSequence(agentSequence);

    // Calculate execution summary
    const successfulAgents = executionResults.filter(result => result.status === 'completed');
    const failedAgents = executionResults.filter(result => result.status === 'failed');
    const totalCost = executionResults.reduce((sum, result) => sum + result.executionCost, 0);

    console.log(`✅ Execution completed: ${successfulAgents.length} successful, ${failedAgents.length} failed`);
    console.log(`💰 Total execution cost: $${totalCost.toFixed(6)}`);

    res.json({
      jobId: jobId,
      status: failedAgents.length === 0 ? "completed" : "partial_failure",
      timestamp: new Date().toISOString(),
      executionSummary: {
        totalAgents: agentSequence.length,
        successfulAgents: successfulAgents.length,
        failedAgents: failedAgents.length,
        totalCost: totalCost
      },
      results: executionResults
    });
  } catch (error) {
    console.error("❌ Error in execute endpoint:", error);
    res.status(500).json({
      error: "Execute endpoint error",
      message: error.message,
      jobId: req.body.jobId || null,
    });
  }
});

// Mount jobs router
app.use("/api/jobs", jobsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to see the API`);
});

module.exports = app;
