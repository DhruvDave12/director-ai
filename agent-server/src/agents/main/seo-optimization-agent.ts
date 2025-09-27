import type {
  AgentConfig,
  AgentRequest,
  AgentResponse,
  AgentExecutionContext,
} from "../../types/agent.js";
import { BaseAgent } from "../../types/agent.js";
import { geminiUtil } from "../../utils/gemini-util.js";

export class SeoOptimizationAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      id: "seo_optimization_agent",
      name: "SEO Optimization Agent",
      description:
        "Analyzes website content and provides detailed SEO optimization recommendations using AI-powered analysis",
      version: "1.0.0",
      capabilities: [
        "seo-analysis",
        "content-optimization",
        "keyword-analysis",
        "meta-tag-suggestions",
        "performance-recommendations",
      ],
      metadata: {
        maxTimeout: 45000, // 45 seconds for comprehensive analysis
        analysisDepth: "comprehensive",
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
          error: "Missing required parameter: payload (website content/data)",
          metadata: { agentId: this.getId(), requestId: context.requestId },
        };
      }

      return this.handleSeoAnalysis(payload, context);
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
      console.error("SEO Optimization Agent health check failed:", error);
      return false;
    }
  }

  private async handleSeoAnalysis(
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
          error: "No content data provided for SEO analysis",
          metadata: { agentId: this.getId(), requestId: context.requestId },
        };
      }

      // Create comprehensive SEO analysis prompt
      const seoPrompt = this.createSeoAnalysisPrompt(contentData);

      // Generate SEO recommendations using Gemini
      const seoRecommendations = await geminiUtil.generateContent(seoPrompt);

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        data: seoRecommendations,
        metadata: {
          requestId: context.requestId,
          agentId: this.getId(),
          processingTime,
          contentAnalyzed: contentData.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `SEO analysis failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        metadata: {
          agentId: this.getId(),
          requestId: context.requestId,
        },
      };
    }
  }

  private createSeoAnalysisPrompt(contentData: string): string {
    return `You are an expert SEO consultant and digital marketing specialist. Your task is to analyze the provided website content and provide comprehensive, actionable SEO optimization recommendations.

Website Content/Data:
${contentData}

Please provide a detailed SEO analysis and optimization recommendations covering the following areas:

## 1. CONTENT ANALYSIS
- Analyze the content quality, relevance, and structure
- Identify the main topics and themes
- Assess content depth and comprehensiveness
- Check for content gaps or opportunities

## 2. KEYWORD OPTIMIZATION
- Identify primary and secondary keywords from the content
- Suggest additional relevant keywords to target
- Analyze keyword density and distribution
- Recommend long-tail keyword opportunities

## 3. ON-PAGE SEO ELEMENTS
- Title tag optimization suggestions
- Meta description recommendations
- Header structure (H1, H2, H3) analysis and improvements
- URL structure recommendations
- Internal linking opportunities

## 4. CONTENT STRUCTURE & FORMATTING
- Content organization and readability improvements
- Paragraph structure and length optimization
- Use of bullet points, lists, and formatting
- Content hierarchy and flow suggestions

## 5. TECHNICAL SEO CONSIDERATIONS
- Page loading speed optimization tips
- Mobile-friendliness recommendations
- Schema markup opportunities
- Image optimization suggestions (if images are present)

## 6. USER EXPERIENCE (UX) IMPROVEMENTS
- Content engagement optimization
- Call-to-action placement and effectiveness
- User intent alignment
- Content accessibility improvements

## 7. COMPETITIVE ADVANTAGE
- Unique value proposition enhancement
- Content differentiation strategies
- Authority building opportunities
- Trust signal improvements

## 8. ACTION PLAN
- Prioritized list of immediate improvements (high impact, low effort)
- Medium-term optimization strategies
- Long-term SEO goals and recommendations

For each recommendation, please provide:
- Specific actionable steps
- Expected impact level (High/Medium/Low)
- Implementation difficulty (Easy/Medium/Hard)
- Estimated timeframe for results

Format your response in clear, organized sections with actionable bullet points. Focus on practical, implementable suggestions that will have measurable SEO impact.`;
  }
}

export const createSeoOptimizationAgent = (): BaseAgent =>
  new SeoOptimizationAgent();
