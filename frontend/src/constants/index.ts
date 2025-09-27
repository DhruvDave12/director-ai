import { arbitrum, arbitrumSepolia, baseSepolia, polygonAmoy, sepolia } from "viem/chains";
import { IAgent } from "../../types";



export const userStories = [
    {
        "title": "Improve my website's SEO",
        "examplePrompt": "Optimize my website https://akhileshmanda.github.io/Portfolio-SEO/ for SEO to increase organic traffic and improve search engine rankings, and create a github PR for the same on this repo: https://github.com/DhruvDave12/Portfolio-SEO"
    },
    {
        "title": "Generate a marketing report",
        "examplePrompt": "Generate a comprehensive marketing report for my company, including analysis of current strategies, competitor analysis, and recommendations for improvement"
    },
    {
        "title": "Create a content calendar",
        "examplePrompt": "Create a content calendar for my blog that includes topics, publication dates, and distribution channels for the next three months"
    },
    {
        "title": "Analyze customer feedback",
        "examplePrompt": "Analyze customer feedback from surveys and reviews to identify common themes, areas for improvement, and actionable insights"
    },
    {
        "title": "Build a sales dashboard",
        "examplePrompt": "Build a sales dashboard that visualizes key metrics such as revenue, conversion rates, and customer acquisition costs using data from my CRM system"
    }
]

export const FALLBACK_AGENTS: IAgent[] = [
  {
    name: "Content Generator",
    description: "Creates high-quality content including articles, blogs, and marketing copy with SEO optimization."
  },
  {
    name: "Data Analyst",
    description: "Processes and analyzes large datasets, generates insights, and creates comprehensive reports."
  },
  {
    name: "Image Creator",
    description: "Generates stunning visuals, logos, and artwork using advanced AI image generation models."
  },
  {
    name: "Code Assistant",
    description: "Writes, reviews, and optimizes code across multiple programming languages and frameworks."
  },
  {
    name: "Research Agent",
    description: "Conducts in-depth research on any topic and compiles detailed, fact-checked reports."
  },
  {
    name: "Social Media Manager",
    description: "Creates engaging social media content, schedules posts, and manages online presence."
  }
];



export function getTokenAddress(chainId: number | undefined) {
    switch (chainId) {
        case polygonAmoy.id: // polygon amoy
            return '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582'; // USDC
        case sepolia.id: // sepolia
            return '0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9'; // USDC
        case baseSepolia.id: // base sepolia
            return '0x036CbD53842c5426634e7929541eC2318f3dCF7e'; // USDC
        case arbitrumSepolia.id: // arbitrum sepolia
            return '0xc6006A919685EA081697613373C50B6b46cd6F11' // PyUSD
        default:
            return `0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582`;
    }
}


export const getTokenSymbol = (chainId: number | undefined) => {
    switch (chainId) {
        case arbitrumSepolia.id:
            return 'PyUSD';
        default:
            return 'USDC';
    }
}