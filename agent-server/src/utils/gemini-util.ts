import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

export class GeminiUtil {
  private genAI: GoogleGenAI;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY || "";
    if (!this.apiKey || this.apiKey === "your_GOOGLE_API_KEY_here") {
      throw new Error("GOOGLE_API_KEY not found or not set");
    }
    this.genAI = new GoogleGenAI({ apiKey: this.apiKey });
  }

  /**
   * Generate content using Gemini AI with the specified model
   */
  async generateContent(
    prompt: string,
    model: string = "gemini-2.5-flash"
  ): Promise<string> {
    try {
      const result = await this.genAI.models.generateContent({
        model,
        contents: prompt,
      });

      const responseText = result.text;

      if (!responseText || responseText.trim().length === 0) {
        throw new Error("Gemini returned empty response");
      }

      return responseText.trim();
    } catch (error) {
      console.error("Gemini generation failed:", error);
      throw error;
    }
  }

  /**
   * Check if Gemini API is available and working
   */
  async healthCheck(): Promise<boolean> {
    try {
      const testPrompt = "Respond with 'OK' if you can read this message.";
      const response = await this.generateContent(testPrompt);
      return response.toLowerCase().includes("ok");
    } catch (error) {
      console.error("Gemini health check failed:", error);
      return false;
    }
  }

  /**
   * Get the configured API key status
   */
  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey !== "your_GOOGLE_API_KEY_here";
  }
}

// Create and export a singleton instance
export const geminiUtil = new GeminiUtil();
