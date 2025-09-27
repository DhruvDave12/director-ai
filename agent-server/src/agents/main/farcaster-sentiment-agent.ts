import type {
  AgentConfig,
  AgentRequest,
  AgentResponse,
  AgentExecutionContext,
} from "../../types/agent.js";
import { BaseAgent } from "../../types/agent.js";
import { geminiUtil } from "../../utils/gemini-util.js";

interface BuoySearchResponse {
  filteredHits: Array<{
    _source: {
      text: string;
      [key: string]: any;
    };
  }>;
}

export class FarcasterSentimentAgent extends BaseAgent {
  private readonly buoyApiKey = "5e907fd8-a645-427f-a6a7-bb9519e50b84";
  private readonly buoyApiUrl = "https://api.buoy.club/v2/search";

  constructor() {
    const config: AgentConfig = {
      id: "farcaster_sentiment_agent",
      name: "Farcaster Sentiment Analysis Agent",
      description:
        "Analyzes Farcaster community sentiment about topics using Buoy API and AI-powered sentiment analysis",
      version: "1.0.0",
      capabilities: [
        "farcaster-analysis",
        "sentiment-analysis",
        "social-listening",
        "keyword-extraction",
        "community-sentiment",
        "cast-analysis",
      ],
      metadata: {
        maxTimeout: 90000, // 90 seconds for API calls and analysis
        analysisDepth: "focused",
        socialPlatform: "farcaster",
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
            "Missing required parameter: payload (content for sentiment analysis)",
          metadata: { agentId: this.getId(), requestId: context.requestId },
        };
      }

      return this.handleFarcasterSentimentAnalysis(payload, context);
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
      console.error("Farcaster Sentiment Agent health check failed:", error);
      return false;
    }
  }

  private async handleFarcasterSentimentAnalysis(
    payload: any,
    context: AgentExecutionContext
  ): Promise<AgentResponse> {
    try {
      const startTime = Date.now();

      // Convert payload to string if it's not already
      const contentData =
        typeof payload === "string" ? payload : JSON.stringify(payload);

      if (!contentData || contentData.trim().length === 0) {
        return {
          success: false,
          error: "No content data provided for Farcaster sentiment analysis",
          metadata: { agentId: this.getId(), requestId: context.requestId },
        };
      }

      console.log("🟣 Starting Farcaster sentiment analysis workflow");
      console.log("📄 Content length:", contentData.length);

      // Step 1: Extract keywords from content using Gemini
      const keywords = await this.extractKeywords(contentData);
      console.log("🔑 Extracted keywords:", keywords);

      // Step 2: Search Farcaster casts using Buoy API
      const casts = await this.searchFarcasterCasts(keywords);
      console.log("📱 Found casts:", casts.length);

      // Step 3: Analyze sentiment of top 5 casts using Gemini
      const sentimentReport = await this.analyzeCastsSentiment(
        casts,
        keywords.join(" ")
      );

      const processingTime = Date.now() - startTime;

      console.log("✅ Farcaster sentiment analysis completed");
      console.log("⏱️ Processing time:", processingTime, "ms");

      return {
        success: true,
        data: sentimentReport,
        metadata: {
          requestId: context.requestId,
          agentId: this.getId(),
          processingTime,
          contentLength: contentData.length,
          platform: "farcaster",
          keywordsUsed: keywords.join(", "),
          castsAnalyzed: casts.length,
        },
      };
    } catch (error) {
      console.error("Farcaster sentiment analysis failed:", error);
      return {
        success: false,
        error: `Farcaster sentiment analysis failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        metadata: {
          agentId: this.getId(),
          requestId: context.requestId,
        },
      };
    }
  }

  private async extractKeywords(content: string): Promise<string[]> {
    const keywordPrompt = `Extract 3-4 most important keywords from this content for social media search. Return only the keywords separated by spaces, no explanation:

${content}`;

    try {
      const keywords = await geminiUtil.generateContent(keywordPrompt);
      return keywords
        .trim()
        .split(/\s+/)
        .filter((keyword) => keyword.length > 0);
    } catch (error) {
      console.error("Failed to extract keywords:", error);
      // Fallback: use first few words from content
      return content
        .split(" ")
        .slice(0, 3)
        .filter((word) => word.length > 0);
    }
  }

  private async searchFarcasterCasts(keywords: string[]): Promise<string[]> {
    const allCasts: string[] = [];

    try {
      // Search with each keyword individually
      for (const keyword of keywords) {
        console.log(`🔍 Searching for keyword: "${keyword}"`);

        const searchPayload = {
          text: keyword,
          page: 0,
          pageSize: 10,
          sortBy: "date,desc",
          timespan: "1M",
        };

        const response = await fetch(this.buoyApiUrl, {
          method: "POST",
          headers: {
            Authorization: `Basic ${this.buoyApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(searchPayload),
        });

        if (!response.ok) {
          console.error(
            `Buoy API error for keyword "${keyword}": ${response.status} ${response.statusText}`
          );
          continue; // Skip this keyword and continue with others
        }

        const data: BuoySearchResponse = await response.json();

        // Extract text from casts for this keyword
        const keywordCasts = data.filteredHits
          .map((hit) => hit._source.text)
          .filter((text) => text && text.trim().length > 0);

        allCasts.push(...keywordCasts);
        console.log(`📱 Found ${keywordCasts.length} casts for "${keyword}"`);
      }

      // Remove duplicates and get top 5 unique casts
      const uniqueCasts = [...new Set(allCasts)].slice(0, 5);

      return uniqueCasts;
    } catch (error) {
      console.error("Failed to search Farcaster casts:", error);
      return [];
    }
  }

  private async analyzeCastsSentiment(
    casts: string[],
    keywords: string
  ): Promise<string> {
    if (casts.length === 0) {
      return `🟣 Farcaster Sentiment Analysis

**Keywords Searched:** ${keywords}

**Result:** No recent casts found for these keywords on Farcaster.

**Recommendation:** Try broader or different keywords, or check if the topic is actively discussed on Farcaster.`;
    }

    const castsText = casts.join("\n\n---\n\n");

    const sentimentPrompt = `Analyze the sentiment of these Farcaster casts about "${keywords}". Provide a brief, readable report:

CASTS:
${castsText}

Provide:
1. Overall sentiment (Positive/Negative/Neutral)
2. Key themes mentioned
3. Community mood summary
4. Notable insights

Keep it concise and actionable.`;

    try {
      const analysis = await geminiUtil.generateContent(sentimentPrompt);

      return `🟣 Farcaster Sentiment Analysis

**Keywords Searched:** ${keywords}
**Casts Analyzed:** ${casts.length}

${analysis}

**Data Source:** Recent Farcaster casts from the past month`;
    } catch (error) {
      console.error("Failed to analyze sentiment:", error);
      return `🟣 Farcaster Sentiment Analysis

**Keywords Searched:** ${keywords}
**Casts Found:** ${casts.length}

**Analysis Error:** Could not complete sentiment analysis, but found ${
        casts.length
      } recent casts discussing these topics on Farcaster.

**Raw Casts Preview:**
${casts.slice(0, 2).join("\n\n")}`;
    }
  }
}

export const createFarcasterSentimentAgent = (): BaseAgent =>
  new FarcasterSentimentAgent();
