import type {
  AgentConfig,
  AgentRequest,
  AgentResponse,
  AgentExecutionContext,
} from "../../types/agent.js";
import { BaseAgent } from "../../types/agent.js";
import { Octokit } from "@octokit/rest";
import * as dotenv from "dotenv";
import { geminiUtil } from "../../utils/gemini-util.js";
import { randomUUID } from "crypto";

// Load environment variables
dotenv.config();

// Legacy interface for reference - GitHub agent now only handles SEO optimization via string payload
interface GitHubPayload {
  action: "seo_optimize";
  repo_url?: string;
  file_path?: string;
  content?: string;
  seo_context?: string;
}

export class GitHubAgent extends BaseAgent {
  private octokit: Octokit;
  private githubToken: string;

  constructor() {
    const config: AgentConfig = {
      id: "github_code_agent",
      name: "GitHub Agent",
      description:
        "Performs SEO optimization by generating AI-powered HTML and creating GitHub PRs with unique branch names",
      version: "2.0.0",
      capabilities: [
        "seo-optimization",
        "ai-html-generation",
        "repository-management",
        "pull-request-creation",
        "branch-management",
      ],
      metadata: {
        maxTimeout: 60000, // 60 seconds for GitHub API operations
        payloadFormat: "string", // Expects string payload containing SEO context with repo URL
        supportedActions: ["seo_optimize"],
      },
    };
    super(config);

    this.githubToken = process.env.GITHUB_TOKEN || "";
    if (!this.githubToken) {
      throw new Error("GITHUB_TOKEN environment variable is required");
    }

    this.octokit = new Octokit({
      auth: this.githubToken,
    });
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
          error: "Missing required parameter: payload",
          metadata: { agentId: this.getId(), requestId: context.requestId },
        };
      }

      // Parse payload - always expect string
      if (typeof payload !== "string") {
        return {
          success: false,
          error: "Payload must be a string",
          metadata: { agentId: this.getId(), requestId: context.requestId },
        };
      }

      // For GitHub agent, we assume the payload is SEO context containing repo URL
      // No JSON parsing needed - treat the entire string as SEO context
      return this.handleSeoOptimizationFromContext(payload, context);
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
      // Test GitHub API connection by getting authenticated user
      await this.octokit.rest.users.getAuthenticated();

      // Test Gemini API connection
      const geminiHealthy = await geminiUtil.healthCheck();

      return geminiHealthy;
    } catch (error) {
      console.error("GitHub Agent health check failed:", error);
      return false;
    }
  }

  private parseRepoUrl(repo_url: string): { owner: string; repo: string } {
    const parts = repo_url.split("/").slice(-2);
    if (parts.length !== 2) {
      throw new Error(
        "Invalid repository URL format. Expected: owner/repo or full GitHub URL"
      );
    }
    return { owner: parts[0], repo: parts[1] };
  }

  private extractRepoUrlFromContext(context: string): string | null {
    // Try to extract GitHub repository URL from the context
    const githubUrlRegex = /github\.com\/([^\/\s]+\/[^\/\s]+)/i;
    const match = context.match(githubUrlRegex);

    if (match && match[1]) {
      const cleanUrl = match[1].replace(/[^\w\/-]/g, "");
      return cleanUrl; // Returns cleaned "owner/repo" format
    }

    // Try to find "owner/repo" pattern directly
    const ownerRepoRegex = /([a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+)/;
    const directMatch = context.match(ownerRepoRegex);

    if (directMatch && directMatch[1] && directMatch[1].includes("/")) {
      return directMatch[1];
    }

    return null;
  }

  private async handleSeoOptimizationFromContext(
    seoContext: string,
    context: AgentExecutionContext
  ): Promise<AgentResponse> {
    const startTime = Date.now();

    try {
      // Extract repository URL from context
      const repo_url = this.extractRepoUrlFromContext(seoContext);

      if (!repo_url) {
        return {
          success: false,
          error: "Could not extract repository URL from the provided context",
          metadata: {
            agentId: this.getId(),
            requestId: context.requestId,
            processingTime: Date.now() - startTime,
          },
        };
      }

      console.log("Extracted repository URL:", repo_url);

      // Generate SEO-optimized HTML using Gemini
      const seoPrompt = this.createSeoHtmlPrompt(seoContext);
      const optimizedHtml = await geminiUtil.generateContent(seoPrompt);
      console.log("Generated optimized HTML length:", optimizedHtml.length);

      // Generate unique branch name
      const branchName = `director-ai-${randomUUID()}`;

      console.log("Generated branch name:", branchName);

      const { owner, repo } = this.parseRepoUrl(repo_url);
      const baseBranchName = "main";
      const filePath = "index.html";

      // Create a new branch
      const { data: refData } = await this.octokit.request(
        "GET /repos/{owner}/{repo}/git/refs/heads/{branch}",
        {
          owner,
          repo,
          branch: baseBranchName,
        }
      );

      await this.octokit.request("POST /repos/{owner}/{repo}/git/refs", {
        owner,
        repo,
        ref: `refs/heads/${branchName}`,
        sha: refData.object.sha,
      });

      console.log("New branch created successfully:", branchName);

      // Get current file SHA if it exists
      let currentSha: string | undefined;
      try {
        const currentFile = await this.octokit.request(
          "GET /repos/{owner}/{repo}/contents/{path}",
          {
            owner,
            repo,
            path: filePath,
          }
        );

        // Type guard to ensure we have file content
        if (!Array.isArray(currentFile.data) && "sha" in currentFile.data) {
          currentSha = currentFile.data.sha;
          console.log("Found existing file SHA:", currentSha);
        }
      } catch (error) {
        // File doesn't exist, that's okay for creating new files
        console.log("File doesn't exist, creating new file");
      }

      // Encode the optimized HTML content
      const encodedContent = Buffer.from(optimizedHtml, "utf-8").toString(
        "base64"
      );

      // Prepare commit payload
      const commitPayload: any = {
        owner,
        repo,
        path: filePath,
        message: `SEO optimization by director-ai - ${branchName}`,
        content: encodedContent,
        branch: branchName,
      };

      // Include SHA only if file exists
      if (currentSha) {
        commitPayload.sha = currentSha;
      }

      // Commit the changes to the new branch
      await this.octokit.request(
        "PUT /repos/{owner}/{repo}/contents/{path}",
        commitPayload
      );

      console.log("SEO optimized content committed successfully");

      // Create a pull request
      await this.octokit.request("POST /repos/{owner}/{repo}/pulls", {
        owner,
        repo,
        title: `SEO Optimization - ${branchName}`,
        head: branchName,
        base: baseBranchName,
        body: `This PR contains SEO-optimized HTML generated by director-ai.\n\nBranch: ${branchName}\n\nOptimizations include:\n- Improved meta tags\n- Better semantic HTML structure\n- Enhanced content organization\n- SEO-friendly formatting`,
      });

      console.log("Pull request created successfully for SEO optimization");

      const processingTime = Date.now() - startTime;

      let githubURL = "";
      if (repo_url) {
        githubURL = `https://github.com/${repo_url}`;
      }

      return {
        success: true,
        data: githubURL,
        metadata: {
          requestId: context.requestId,
          agentId: this.getId(),
          processingTime,
          action: "seo_optimize",
          repository: repo_url,
          branchName,
        },
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      return {
        success: false,
        error: `SEO optimization failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        metadata: {
          agentId: this.getId(),
          requestId: context.requestId,
          processingTime,
          action: "seo_optimize",
        },
      };
    }
  }

  private createSeoHtmlPrompt(context: string): string {
    return `You are an expert web developer and SEO specialist. Based on the following context about a website, generate a complete, SEO-optimized HTML page.

Context:
${context}

Requirements:
1. Generate a complete HTML5 document with proper DOCTYPE
2. Include comprehensive SEO meta tags:
   - Title tag (compelling and keyword-rich)
   - Meta description (155 characters max)
   - Meta keywords

3. Use semantic HTML structure:
   - Proper heading hierarchy (H1, H2, H3, etc.)
   - Semantic elements (header, nav, main, section, article, aside, footer)

4. Content optimization:
   - Create engaging, informative content based on the context
   - Use relevant keywords naturally throughout the content
   - Include proper internal linking structure
   - Add structured data (JSON-LD) where appropriate

5. Technical SEO:
   - Clean, valid HTML code
   - Proper indentation and formatting

Generate a complete, production-ready HTML page that would rank well in search engines and provide excellent user experience. The content should be relevant to the context provided and include all necessary SEO elements. Try to complete the task under 30 seconds keep short HTML if needed

Return only the HTML code, no explanations or additional text.`;
  }
}

export const createGitHubAgent = (): BaseAgent => new GitHubAgent();
