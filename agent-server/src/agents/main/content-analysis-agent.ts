import type {
  AgentConfig,
  AgentRequest,
  AgentResponse,
  AgentExecutionContext,
} from "../../types/agent.js";
import { BaseAgent } from "../../types/agent.js";
import { geminiUtil } from "../../utils/gemini-util.js";

export class ContentAnalysisAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      id: "content_analysis_agent",
      name: "Content Analysis Agent",
      description:
        "Performs comprehensive content analysis using AI-powered insights including sentiment, themes, structure, and actionable recommendations",
      version: "1.0.0",
      capabilities: [
        "content-analysis",
        "sentiment-analysis",
        "theme-extraction",
        "structure-analysis",
        "readability-assessment",
        "keyword-analysis",
        "tone-analysis",
        "audience-analysis",
        "competitive-analysis",
        "content-optimization",
      ],
      metadata: {
        maxTimeout: 120000, // 120 seconds for comprehensive analysis
        analysisDepth: "comprehensive",
        analysisType: "multi-dimensional",
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
            "Missing required parameter: payload (content data for analysis)",
          metadata: { agentId: this.getId(), requestId: context.requestId },
        };
      }

      return this.handleContentAnalysis(payload, context);
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
      console.error("Content Analysis Agent health check failed:", error);
      return false;
    }
  }

  private async handleContentAnalysis(
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
          error: "No content data provided for analysis",
          metadata: { agentId: this.getId(), requestId: context.requestId },
        };
      }

      console.log("📊 Starting comprehensive content analysis");
      console.log("📄 Content length:", contentData.length);

      // Create comprehensive content analysis prompt
      const analysisPrompt = this.createContentAnalysisPrompt(contentData);

      // Generate content analysis using Gemini
      const contentAnalysis = await geminiUtil.generateContent(analysisPrompt);

      const processingTime = Date.now() - startTime;

      console.log("✅ Content analysis completed");
      console.log("⏱️ Processing time:", processingTime, "ms");

      return {
        success: true,
        data: contentAnalysis,
        metadata: {
          requestId: context.requestId,
          agentId: this.getId(),
          processingTime,
          contentLength: contentData.length,
          analysisType: "comprehensive",
          wordCount: this.estimateWordCount(contentData),
        },
      };
    } catch (error) {
      console.error("Content analysis failed:", error);
      return {
        success: false,
        error: `Content analysis failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        metadata: {
          agentId: this.getId(),
          requestId: context.requestId,
        },
      };
    }
  }

  private createContentAnalysisPrompt(contentData: string): string {
    return `You are an expert content analyst. Analyze the following content comprehensively:

CONTENT:
${contentData}

Provide analysis covering:

## 1. OVERVIEW
- Content type, purpose, target audience
- Structure and length assessment

## 2. SENTIMENT & TONE
- Overall sentiment (Positive/Negative/Neutral/Mixed + confidence score)
- Tone characteristics and consistency

## 3. THEMES & TOPICS
- Main themes and subtopics
- Topic coherence and flow

## 4. STRUCTURE & STYLE
- Organization and logical flow
- Writing style and vocabulary complexity
- Readability level

## 6. AUDIENCE & ENGAGEMENT
- Target audience alignment
- Engagement and shareability potential

## 7. QUALITY & CREDIBILITY
- Accuracy and authority indicators
- Completeness assessment

## 8. RECOMMENDATIONS
### High Priority:
- Critical improvements needed

### Medium Priority:
- Structural/style enhancements

### Low Priority:
- Long-term optimization opportunities

## 9. ACTIONABLE INSIGHTS
- Top 3 strengths to leverage
- Top 3 weaknesses to address
- Implementation recommendations

Provide specific examples, confidence levels, and practical insights for content improvement and strategic decision-making.`;
  }

  private estimateWordCount(content: string): number {
    // Simple word count estimation
    return content.trim().split(/\s+/).length;
  }
}

export const createContentAnalysisAgent = (): BaseAgent =>
  new ContentAnalysisAgent();
