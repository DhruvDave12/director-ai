import { polygonAmoy, sepolia } from "viem/chains";



export const userStories = [
    {
        "title": "Improve my website's SEO",
        "examplePrompt": "Optimize my website abc.xyz for SEO to increase organic traffic and improve search engine rankings, and create a github PR for the same on this repo: https://github.com/abc/xyz"
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


export function getTokenAddress(chainId: number | undefined) {
    switch (chainId) {
        case polygonAmoy.id: // polygon amoy
            return '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582'; // MATIC
        case sepolia.id: // sepolia
            return '0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9'; // Sepolia ETH
        default:
            return `0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582`;
    }
}