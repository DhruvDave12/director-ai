import { analyzeContentForICP } from "./redditGeminiService.js";
import { mapICPToRedditSignals } from "./redditSignalService.js";

export interface AnalysisResult {
  analysis: string;
  redditSignals?: string;
  timestamp: string;
}

/**
 * Complete analysis workflow: scrape website, analyze for ICP, and map to Reddit signals
 */
export async function analyzeWebsite(content: string): Promise<AnalysisResult> {
  try {
    let redditSignals: string | undefined;
    try {
      redditSignals = await mapICPToRedditSignals(content);
    } catch (error) {
      console.error("Failed to generate Reddit signals:", error);
      // Continue without Reddit signals if this fails
    }

    const result: AnalysisResult = {
      analysis: content,
      redditSignals,
      timestamp: new Date().toISOString(),
    };

    return result;
  } catch (error) {
    console.error(`Error analyzing website:`, error);
    throw error;
  }
}
