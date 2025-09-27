import type {
  AgentConfig,
  AgentRequest,
  AgentResponse,
  AgentExecutionContext,
} from "../../types/agent.js";
import { BaseAgent } from "../../types/agent.js";
import { geminiUtil } from "../../utils/gemini-util.js";
import { analyzeWebsite } from "../../external/reddit/analysisService.js";
import { triggerRedditExternalService } from "../../external/reddit/sentimentService.js";
import type { RedditSignals } from "../../external/reddit/redditSignalService.js";

export class RedditSentimentAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      id: "reddit_sentiment_agent",
      name: "Reddit Sentiment Analysis Agent",
      description:
        "Analyzes Reddit discussions and community sentiment about companies or topics using AI-powered sentiment analysis",
      version: "1.0.0",
      capabilities: [
        "sentiment-analysis",
        "reddit-analysis",
        "community-sentiment",
        "opinion-mining",
        "social-listening",
        "brand-perception",
      ],
      metadata: {
        maxTimeout: 600000, // 600 seconds for comprehensive sentiment analysis
        analysisDepth: "comprehensive",
        socialPlatform: "reddit",
      },
    };
    super(config);
  }

  async execute(
    request: AgentRequest,
    context: AgentExecutionContext
  ): Promise<AgentResponse> {
    try {
      const { payload } = request;

      if (!payload) {
        return {
          success: false,
          error:
            "Missing required parameter: payload (website context with company information)",
          metadata: { agentId: this.getId(), requestId: context.requestId },
        };
      }

      return this.handleRedditSentimentAnalysis(payload, context);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        metadata: { agentId: this.getId(), requestId: context.requestId },
      };
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Test Gemini utility health
      return await geminiUtil.healthCheck();
    } catch (error) {
      console.error("Reddit Sentiment Agent health check failed:", error);
      return false;
    }
  }

  private async handleRedditSentimentAnalysis(
    payload: any,
    context: AgentExecutionContext
  ): Promise<AgentResponse> {
    try {
      const startTime = Date.now();

      // Convert payload to string if it's not already
      const contextData =
        typeof payload === "string" ? payload : JSON.stringify(payload);

      if (!contextData || contextData.trim().length === 0) {
        return {
          success: false,
          error: "No context data provided for Reddit sentiment analysis",
          metadata: { agentId: this.getId(), requestId: context.requestId },
        };
      }

      console.log("🔍 Starting Reddit sentiment analysis workflow");
      console.log("📄 Content length:", contextData.length);

      // Step 1: Analyze website content for ICP and generate Reddit signals
      const analysisResult = await analyzeWebsite(contextData);
      console.log("✅ ICP Analysis completed");
      console.log("📊 Analysis result:", {
        hasAnalysis: !!analysisResult.analysis,
        hasRedditSignals: !!analysisResult.redditSignals,
        timestamp: analysisResult.timestamp,
      });
      analysisResult.redditSignals =
        analysisResult.redditSignals?.replace(/```json\n|\n```/g, "") || "{}";
      console.log(
        "📊 Reddit Signals:",
        JSON.parse(analysisResult.redditSignals || "{}")
      );

      // Step 2: Parse Reddit signals and trigger external service
      let gtmStrategy: string;
      if (analysisResult.redditSignals) {
        try {
          // Parse the Reddit signals from string to object
          const redditSignalsObj: RedditSignals = JSON.parse(
            analysisResult.redditSignals
          );
          console.log("🎯 Reddit signals parsed successfully");

          // Trigger external Reddit service to generate GTM strategy
          const externalResult = await triggerRedditExternalService(
            redditSignalsObj
          );
          gtmStrategy = externalResult.response;
          console.log("📧 GTM strategy generated successfully");
        } catch (parseError) {
          console.error("Failed to parse Reddit signals:", parseError);
          // Fallback: use the ICP analysis as the response
          gtmStrategy = `Reddit Sentiment Analysis Based on ICP Analysis:

${analysisResult.analysis}

Note: Reddit signals could not be processed, but the above ICP analysis provides insights into the target audience and market positioning.`;
        }
      } else {
        // Fallback: use just the ICP analysis
        gtmStrategy = `Reddit Sentiment Analysis Based on Content Analysis:

${analysisResult.analysis}

Note: Reddit signals were not generated, but the above analysis provides insights into potential Reddit community reception.`;
      }

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        data: gtmStrategy,
        metadata: {
          requestId: context.requestId,
          agentId: this.getId(),
          processingTime,
          contextAnalyzed: contextData.length,
          platform: "reddit",
          hasRedditSignals: !!analysisResult.redditSignals,
          analysisTimestamp: analysisResult.timestamp,
        },
      };
    } catch (error) {
      console.error("Reddit sentiment analysis failed:", error);
      return {
        success: false,
        error: `Reddit sentiment analysis failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        metadata: {
          agentId: this.getId(),
          requestId: context.requestId,
        },
      };
    }
  }
}

export const createRedditSentimentAgent = (): BaseAgent =>
  new RedditSentimentAgent();
