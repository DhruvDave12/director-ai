import {
  arbitrum,
  arbitrumSepolia,
  baseSepolia,
  polygonAmoy,
  sepolia,
} from "viem/chains";
import { IAgent } from "../../types";

export const userStories = [
  {
    title: "Improve my website's SEO",
    examplePrompt:
      "Optimize my website https://akhileshmanda.github.io/Portfolio-SEO/ for SEO to increase organic traffic and improve search engine rankings, and create a github PR for the same on this repo: https://github.com/DhruvDave12/Portfolio-SEO",
  },
  {
    title: "Travel platform optimization analysis",
    examplePrompt:
      "Evaluate https://www.airbnb.co.in/ website for mobile performance and booking flow optimization. Research travel community discussions on Reddit to identify feature gaps and user needs in the Indian market. Provide recommendations for improving conversion rates and user satisfaction based on both technical analysis and community insights.",
  },
  {
    title: "Crisis management for brand reputation",
    examplePrompt:
      "Monitor Reddit and Farcaster for any negative mentions or complaints about Cred's services and categorize by issue severity. Analyze https://cred.club/ website to identify potential UX problems that might be driving user frustration. Develop a comprehensive response plan with both technical fixes and community engagement strategies.",
  },
  {
    title: "Technical SEO audit with user feedback",
    examplePrompt:
      "Perform a comprehensive SEO audit of https://www.airbnb.co.in/ to identify optimization opportunities. Cross-reference technical findings with user complaints from Reddit and Farcaster about booking experience issues. Create a prioritized improvement roadmap based on both technical metrics and user pain points.",
  },
  {
    title: "Analyze farcaster sentiment for Anime Website",
    examplePrompt:
      "I own https://onepace.net/en and want to improve its quality based on user feedback. First, analyze my website's technical performance, user experience, and identify areas needing improvement. Then, search Farcaster for any reviews or mentions of 'OnePace' to understand what users are saying about my platform. Combine both the website analysis and social sentiment data to give me actionable recommendations. Prioritize fixes that address both technical issues and negative user feedback for maximum impact.",
  },
];

export const FALLBACK_AGENTS: IAgent[] = [
  {
    name: "Content Generator",
    description:
      "Creates high-quality content including articles, blogs, and marketing copy with SEO optimization.",
  },
  {
    name: "Data Analyst",
    description:
      "Processes and analyzes large datasets, generates insights, and creates comprehensive reports.",
  },
  {
    name: "Image Creator",
    description:
      "Generates stunning visuals, logos, and artwork using advanced AI image generation models.",
  },
  {
    name: "Code Assistant",
    description:
      "Writes, reviews, and optimizes code across multiple programming languages and frameworks.",
  },
  {
    name: "Research Agent",
    description:
      "Conducts in-depth research on any topic and compiles detailed, fact-checked reports.",
  },
  {
    name: "Social Media Manager",
    description:
      "Creates engaging social media content, schedules posts, and manages online presence.",
  },
];

export function getTokenAddress(chainId: number | undefined) {
  switch (chainId) {
    case polygonAmoy.id: // polygon amoy
      return "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582"; // USDC
    case sepolia.id: // sepolia
      return "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9"; // USDC
    case baseSepolia.id: // base sepolia
      return "0x036CbD53842c5426634e7929541eC2318f3dCF7e"; // USDC
    case arbitrumSepolia.id: // arbitrum sepolia
      return "0xc6006A919685EA081697613373C50B6b46cd6F11"; // PyUSD
    default:
      return `0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582`;
  }
}

export const getTokenSymbol = (chainId: number | undefined) => {
  switch (chainId) {
    case arbitrumSepolia.id:
      return "PyUSD";
    default:
      return "USDC";
  }
};
