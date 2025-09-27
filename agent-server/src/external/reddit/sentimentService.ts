import { geminiUtil } from "../../utils/gemini-util.js";
import type { RedditSignals } from "./redditSignalService.js";

/**
 * Extract keywords from Reddit signals for n8n payload
 */
function extractKeywordsFromSignals(redditSignals: RedditSignals): string {
  const allKeywords: string[] = [];

  // Extract keywords from keyword clusters
  if (
    redditSignals.keyword_clusters &&
    Array.isArray(redditSignals.keyword_clusters)
  ) {
    redditSignals.keyword_clusters.forEach((cluster) => {
      if (cluster.keywords) {
        const keywords = cluster.keywords.split("; ").map((k) => k.trim());
        allKeywords.push(...keywords);
      }
    });
  }

  // Create boolean search query from keywords
  if (allKeywords.length > 0) {
    const quotedKeywords = allKeywords.map((keyword) => `"${keyword}"`);
    return `(${quotedKeywords.join(" OR ")})`;
  }

  // Fallback to boolean search query if available
  return redditSignals.boolean_search_query || "";
}

/**
 * Extract subreddit names from Reddit signals
 */
function extractSubredditsFromSignals(redditSignals: RedditSignals): string[] {
  if (redditSignals.subreddits && Array.isArray(redditSignals.subreddits)) {
    const subredditNames = redditSignals.subreddits.map((sub) => {
      // Remove 'r/' prefix if present
      return sub.name.replace(/^r\//, "");
    });
    const finalSubreddits = [];
    for (const subreddit of subredditNames) {
      finalSubreddits.push(
        `https://oauth.reddit.com/${subreddit}/top?t=all&limit=5`
      );
    }
    return finalSubreddits;
  }

  // Fallback to reddit_search_url if available
  return [];
}

/**
 * Download n8n response as JSON file
 */
export function downloadN8nResponse(responseData: string, url: string): void {
  const hostname = new URL(url).hostname;
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `n8n_reddit_results_${hostname.replace(
    /\./g,
    "_"
  )}_${timestamp}.json`;

  // Try to parse the response as JSON for better formatting
  let formattedData: string;
  try {
    const parsed = JSON.parse(responseData);
    formattedData = JSON.stringify(parsed, null, 2);
  } catch {
    // If not JSON, use as-is
    formattedData = responseData;
  }

  const dataBlob = new Blob([formattedData], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(dataBlob);
  link.download = filename;
  link.click();

  // Clean up
  URL.revokeObjectURL(link.href);
}

export function generateGtmStrategyPrompt(
  keywords: string,
  subcommunities: string
): string {
  return `
  You are a world-class GTM strategist tasked with analyzing Reddit data to inform our go-to-market strategy.

  Based on the following Reddit data:
  - Target subreddits: ${subcommunities}
  - Key discussion topics: ${keywords}

  Please draft a strategic email that includes:

  1. Key market insights and trends identified from Reddit discussions
  2. Recommendations for positioning and messaging that resonates with our target audience
  3. Suggested tactical next steps to capitalize on these insights
  4. Potential risks or challenges to address

  Format the response as a professional email with:
  - Clear subject line
  - Executive summary
  - Detailed analysis sections
  - Specific action items
  - Data-backed recommendations

  Keep the tone professional but conversational, and ensure all insights are directly tied to the Reddit data provided.
  `;
}
/**
 * Trigger n8n Reddit search workflow with dynamic data from Reddit signals
 */
export async function triggerRedditExternalService(
  redditSignals?: RedditSignals
): Promise<{ message: string; response: string; payload: any }> {
  let keywords: string;
  let subcommunities: string[];
  if (!redditSignals) {
    return {
      message: "No Reddit signals provided",
      response: "No Reddit signals provided",
      payload: {},
    };
  }
  // Use dynamic data from Reddit signals
  keywords = extractKeywordsFromSignals(redditSignals);
  subcommunities = extractSubredditsFromSignals(redditSignals);

  //   use the access token we have in .env file, and make a request to the reddit subcommunities url and get the data from it
  // Fetch data for each subreddit and extract titles
  let contextualSubreddits = "";
  if (redditSignals?.reddit_search_url) {
    try {
      const response = await fetch(redditSignals.reddit_search_url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.REDDIT_ACCESS_TOKEN}`,
        },
      });
      let data = await response.json();
      data = data?.data;
      if (data?.children?.length) {
        const titles = data.children
          .filter((child: any) => child?.data?.title)
          .map((child: any) => child.data.title);
        contextualSubreddits = titles.join(", ");
      }
    } catch (error) {
      console.error("Error fetching Reddit search data:", error);
      contextualSubreddits = subcommunities.join(", "); // Fallback to raw subreddit names
    }
  } else {
    contextualSubreddits = subcommunities.join(", "); // Fallback if no search URL
  }

  console.log("🔍 Reddit Subcommunities Data:", contextualSubreddits);

  const payload = {
    keywords: keywords,
    subcommunities: contextualSubreddits,
  };

  const gtmStrategyPrompt = generateGtmStrategyPrompt(
    keywords,
    contextualSubreddits
  );
  const gtmStrategy = await geminiUtil.generateContent(gtmStrategyPrompt);

  return {
    message: "Successfully triggered n8n workflow with dynamic Reddit signals.",
    response: gtmStrategy,
    payload: payload,
  };
}
