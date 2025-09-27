import type {
  AgentConfig,
  AgentRequest,
  AgentResponse,
  AgentExecutionContext,
} from "../../types/agent.js";
import { BaseAgent } from "../../types/agent.js";
import { GoogleGenAI } from "@google/genai";
import * as cheerio from "cheerio";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

export class WebScrapingAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      id: "web_scraper_agent",
      name: "Web Scraping Agent",
      description:
        "Scrapes web content from URLs and returns AI-processed, readable summary using Gemini",
      version: "1.0.0",
      capabilities: [
        "web-scraping",
        "text-extraction",
        "ai-summarization",
        "content-cleaning",
      ],
      metadata: {
        maxTimeout: 30000, // 30 seconds
        userAgent: "WebScrapingAgent/1.0",
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

      return this.handleScrape(payload, context);
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
      // Test with a simple HTML endpoint
      const testUrl = "https://httpbin.org/html";
      const response = await fetch(testUrl);
      return response.ok;
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  }

  private async processContentWithGemini(
    htmlContent: string,
    url: string
  ): Promise<string> {
    try {
      // Check if Gemini API key is available
      const geminiApiKey = process.env.GOOGLE_API_KEY;
      if (!geminiApiKey || geminiApiKey === "your_GOOGLE_API_KEY_here") {
        throw new Error("GOOGLE_API_KEY not found or not set");
      }

      // Initialize Gemini AI
      const genAI = new GoogleGenAI({ apiKey: geminiApiKey });

      // Create a comprehensive prompt for content cleaning and summarization
      const prompt = `You are an expert content analyst. Your task is to analyze the HTML content from a webpage and provide a clean, readable summary.

URL: ${url}

HTML Content:
${htmlContent}

Instructions:
1. Extract ONLY the main content from this webpage
2. Remove all navigation menus, headers, footers, advertisements, and UI elements
3. Focus on the actual informational content that users came to read
4. Organize the content in a logical, readable format with proper paragraphs
5. Include important details like:
   - Main headings and topics
   - Key information, facts, and data
   - Names, dates, numbers, and specific details
   - Product information, descriptions, or services mentioned
   - Any important links or references mentioned in the content
6. DO NOT add any information that is not present in the HTML
7. DO NOT make assumptions or add your own interpretations
8. If there are multiple sections, organize them clearly
9. Keep the original meaning and context intact
10. Return a well-structured, readable summary that captures what this webpage is actually about

Provide a clean, detailed summary of what is on this webpage:`;

      // Generate content using Gemini
      const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      const processedText = result.text;

      if (!processedText || processedText.trim().length === 0) {
        throw new Error("Gemini returned empty response");
      }

      return processedText.trim();
    } catch (error) {
      console.error("Gemini processing failed:", error);
      // Fallback to basic HTML cleaning if Gemini fails
      return this.basicHtmlClean(htmlContent);
    }
  }

  private basicHtmlClean(htmlContent: string): string {
    // Fallback method to clean HTML when Gemini is not available
    return (
      htmlContent
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove scripts
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "") // Remove styles
        .replace(/<[^>]*>/g, " ") // Remove HTML tags
        .replace(/\s+/g, " ") // Normalize whitespace
        .replace(/&nbsp;/g, " ") // Replace HTML entities
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .trim()
        .substring(0, 2000) + "..."
    ); // Limit length
  }

  private async handleScrape(
    payload: any,
    context: AgentExecutionContext
  ): Promise<AgentResponse> {
    const url = payload;

    if (!url) {
      return {
        success: false,
        error: "Missing required parameter: input (URL)",
        metadata: { agentId: this.getId(), requestId: context.requestId },
      };
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      return {
        success: false,
        error: `Invalid URL format: ${url}`,
        metadata: { agentId: this.getId(), requestId: context.requestId },
      };
    }

    try {
      const startTime = Date.now();

      // Fetch the HTML content directly
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          metadata: { agentId: this.getId(), requestId: context.requestId },
        };
      }

      // Get the raw HTML content
      const htmlContent = await response.text();

      if (!htmlContent || htmlContent.trim().length === 0) {
        return {
          success: false,
          error: "No readable content found at the provided URL",
          metadata: { agentId: this.getId(), requestId: context.requestId },
        };
      }

      // Use cheerio to parse and extract text content
      const $ = cheerio.load(htmlContent);

      // Remove script and style elements
      $("script, style").remove();

      // Extract the main text content
      const textContent = $("body").text().trim();

      if (!textContent || textContent.length === 0) {
        return {
          success: false,
          error: "No text content found after parsing HTML",
          metadata: { agentId: this.getId(), requestId: context.requestId },
        };
      }

      // Process the HTML content with Gemini to get a clean, readable summary
      const processedContent = await this.processContentWithGemini(
        htmlContent,
        url
      );

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        data: processedContent,
        metadata: {
          requestId: context.requestId,
          agentId: this.getId(),
          processingTime,
          originalHtmlLength: htmlContent.length,
          processedContentLength: processedContent.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to scrape URL: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        metadata: {
          agentId: this.getId(),
          requestId: context.requestId,
          url,
        },
      };
    }
  }
}

export const createWebScrapingAgent = (): BaseAgent => new WebScrapingAgent();
