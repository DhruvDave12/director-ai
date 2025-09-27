import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
import type {
    AgentConfig,
    AgentRequest,
    AgentResponse,
    AgentExecutionContext,
} from "../../types/agent.js";
import { BaseAgent } from "../../types/agent.js";

dotenv.config();

export class ImageGenerationAgent extends BaseAgent {
    private genAI: GoogleGenAI | null = null;
    private apiKey: string | undefined;

    constructor() {
        const config: AgentConfig = {
            id: "image_generation_agent",
            name: "Image Generation Agent",
            description:
                "Generates images from text prompts using Gemini (nano banana). Returns base64-encoded PNG.",
            version: "1.0.0",
            capabilities: ["image_generation"],
            metadata: {
                model: "gemini-2.5-flash-image-preview",
            },
        };
        super(config);

        this.apiKey = process.env.GOOGLE_API_KEY;
        if (this.apiKey && this.apiKey !== "your_GOOGLE_API_KEY_here") {
            this.genAI = new GoogleGenAI({ apiKey: this.apiKey });
        }
    }

    async execute(
        request: AgentRequest,
        context: AgentExecutionContext
    ): Promise<AgentResponse> {
        try {
            const { payload } = request;

            if (!payload || typeof payload !== "string") {
                return {
                    success: false,
                    error: "Missing required parameter: payload (string prompt)",
                    metadata: { agentId: this.getId(), requestId: context.requestId },
                };
            }

            if (!this.genAI) {
                return {
                    success: false,
                    error: "GOOGLE_API_KEY not found or not set",
                    metadata: { agentId: this.getId(), requestId: context.requestId },
                };
            }

            const modelName =
                (this.getConfig().metadata?.model as string) ||
                "gemini-2.5-flash-image-preview";

            const result = await this.genAI.models.generateContent({
                model: modelName,
                contents: payload,
            });

            // Collect any inline image data parts
            const images: { data: string; mimeType: string }[] = [];
            const texts: string[] = [];

            const firstCandidate = result?.candidates?.[0];
            const parts = firstCandidate?.content?.parts ?? [];

            for (const part of parts as any[]) {
                if (part?.text) {
                    texts.push(part.text);
                } else if (part?.inlineData?.data) {
                    images.push({
                        data: part.inlineData.data as string,
                        mimeType: part.inlineData.mimeType || "image/png",
                    });
                }
            }

            if (images.length === 0 && texts.length === 0) {
                return {
                    success: false,
                    error: "No content returned by model",
                    metadata: { agentId: this.getId(), requestId: context.requestId },
                };
            }

            // Prefer returning the first image as base64; include any generated text
            const primaryImage = images[0];

            return {
                success: true,
                data: primaryImage?.data || "",
                metadata: {
                    agentId: this.getId(),
                    requestId: context.requestId,
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred",
                metadata: { agentId: this.getId(), requestId: context.requestId },
            };
        }
    }

    async healthCheck(): Promise<boolean> {
        try {
            if (!this.genAI) return false;
            // Lightweight ping by attempting a trivial prompt (no image generation)
            const result = await this.genAI.models.generateContent({
                model: "gemini-2.5-flash",
                contents: "Respond with OK",
            });
            const text = (result as any)?.text || "";
            return typeof text === "string" && text.toLowerCase().includes("ok");
        } catch {
            return false;
        }
    }
}

export const createImageGenerationAgent = (): BaseAgent =>
    new ImageGenerationAgent(); 