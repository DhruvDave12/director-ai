"use client";
import TypeWriterComponent from "typewriter-effect";
import { Button } from "./ui/button";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Bot,
  Star,
  Users,
  Shield,
  Network,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import Link from "next/link";
import { IAgent } from "../../types";
import { FALLBACK_AGENTS } from "@/constants";

export default function LandingHero() {
  const { open } = useAppKit();
  const router = useRouter();

  const { isConnected } = useAccount();

  const [animationData, setAnimationData] = useState<any | null>(null);
  const [agents, setAgents] = useState<IAgent[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [showAllAgents, setShowAllAgents] = useState(false);
  const [initialAgentsCount] = useState(3); // Show first 3 initially

  useEffect(() => {
    if (isConnected) {
      router.push("/chat");
    }
  }, [isConnected]);

  useEffect(() => {
    let isMounted = true;
    fetch("lottie_2.json")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setAnimationData(data);
      })
      .catch(() => {
        // Silently ignore load errors; fallback UI will remain
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setAgentsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/agents`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch agents");
      }

      const data = await response.json();
      setAgents(data); // Get all agents
    } catch (err) {
      console.error("Failed to fetch agents:", err);
      setAgents(FALLBACK_AGENTS); // Get all fallback agents
    } finally {
      setAgentsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-gray-950 via-slate-950 to-black flex items-center py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/3 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-8 lg:px-12 xl:px-16 z-10">
        <div className="relative">
          {/* Main Content */}
          <div
            className="text-left space-y-8 max-w-3xl relative z-20 lg:max-w-2xl xl:max-w-3xl"
            style={{ paddingLeft: "15px" }}
          >
            {/* Logo */}
            <div className="flex justify-start mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
                  <Bot className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-full px-4 py-2 text-sm font-medium text-purple-300 mb-8">
              <Sparkles className="w-4 h-4" />
              <span>
                Architecting the Economic Infrastructure for the AI Era
              </span>
              <Star className="w-4 h-4 text-yellow-400" />
            </div>

            {/* Main heading */}
            <div className="space-y-8 mb-12">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
                  DIRECTR.AI
                </span>
                <span className="block text-white text-2xl sm:text-3xl md:text-4xl lg:text-6xl mt-4 font-semibold tracking-normal">
                  Orchestrating AI Brilliance
                </span>
              </h1>

              <div className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-medium text-gray-200 leading-relaxed">
                <span>Deploy autonomous agent pipelines </span>
                <br />
                <div className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  <TypeWriterComponent
                    options={{
                      strings: [
                        "for SEO optimization",
                        "for market sentiment analysis",
                        "for competitor research",
                        "for content generation",
                        "for code deployment",
                        "for Reddit insights",
                        "for trustless payments",
                      ],
                      autoStart: true,
                      loop: true,
                      delay: 50,
                      deleteSpeed: 30,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="max-w-2xl lg:max-w-xl xl:max-w-2xl mb-12">
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
                Enabling AI agents to form{" "}
                <span className="font-semibold text-purple-400">
                  dynamic networks
                </span>{" "}
                and collaborate on complex challenges with{" "}
                <span className="font-semibold text-pink-400">
                  seamless coordination
                </span>{" "}
                and{" "}
                <span className="font-semibold text-blue-400">
                  trustless blockchain payments
                </span>
                .
              </p>
            </div>

            {/* Core Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <Network className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Scalable Workflows</div>
                  <div className="text-xs text-gray-500">
                    Multi-Agent Systems
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="p-2 bg-pink-600/20 rounded-lg">
                  <Wallet className="w-5 h-5 text-pink-400" />
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Transparent Payments</div>
                  <div className="text-xs text-gray-500">
                    Blockchain Secured
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-sm">
                  <div className="font-semibold">Economic Coordination</div>
                  <div className="text-xs text-gray-500">Autonomous Value</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-6 mb-20 mt-13">
              <Button
                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl px-16 py-8 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 border-0 min-w-[280px] hover:scale-105"
                onClick={() => open()}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Zap className="w-6 h-6" />
                  Enter App
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </div>

            {/* Live Agents Section */}
            <div className="space-y-6 mb-16 max-w-4xl lg:max-w-5xl xl:max-w-6xl">
              <div className="flex items-center gap-4">
                <h3 className="text-3xl font-bold text-white">Live Agents</h3>
                <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-300 font-medium">
                    {agents.length} Active
                  </span>
                </div>
              </div>

              {agentsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="bg-gray-800/30 rounded-xl p-7 animate-pulse"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                          <div className="h-4 bg-gray-700 rounded w-20"></div>
                        </div>
                        <div className="w-5 h-5 bg-gray-700 rounded"></div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="h-3 bg-gray-700 rounded"></div>
                        <div className="h-3 bg-gray-700 rounded"></div>
                        <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="h-2 bg-gray-700 rounded w-16"></div>
                        <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 w-[60vw]">
                    {(showAllAgents
                      ? agents
                      : agents.slice(0, initialAgentsCount)
                    ).map((agent, index) => (
                      <div
                        key={index}
                        className="group bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-7 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 hover:bg-gray-800/50"
                        style={{
                          animation:
                            showAllAgents && index >= initialAgentsCount
                              ? "slideIn 0.5s ease-out forwards"
                              : undefined,
                          animationDelay:
                            showAllAgents && index >= initialAgentsCount
                              ? `${(index - initialAgentsCount) * 100}ms`
                              : undefined,
                        }}
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                              <h4 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors duration-200">
                                {agent.name.split("_").join(" ")}
                              </h4>
                            </div>
                            <Bot className="w-5 h-5 text-purple-400 group-hover:text-pink-400 transition-colors duration-200" />
                          </div>

                          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                            {agent.description}
                          </p>

                          <div className="flex items-center justify-between pt-2">
                            <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                              AI Agent
                            </span>
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 flex items-center justify-center group-hover:from-purple-600/30 group-hover:to-pink-600/30 transition-all duration-200">
                              <Zap className="w-3 h-3 text-purple-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col items-center gap-4 w-[60vw]">
                    {agents.length > initialAgentsCount && (
                      <button
                        onClick={() => setShowAllAgents(!showAllAgents)}
                        className="group relative overflow-hidden bg-gray-800/40 hover:bg-gray-700/50 border border-gray-600/50 hover:border-purple-400/50 text-gray-300 hover:text-white font-medium text-sm px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 hover:scale-105"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {showAllAgents ? (
                            <>
                              Show Less
                              <svg
                                className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 15l7-7 7 7"
                                />
                              </svg>
                            </>
                          ) : (
                            <>
                              Show {agents.length - initialAgentsCount} More
                              Agents
                              <svg
                                className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </>
                          )}
                        </span>
                      </button>
                    )}

                    <Link
                      href="/agents"
                      className="group inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors duration-200"
                    >
                      Explore Full Agent Directory
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Use Case Examples */}
            <div className="space-y-4 mb-12">
              <h3 className="text-base font-semibold text-gray-400 uppercase tracking-wider">
                Live Use Cases
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-900/30 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
                  <div className="font-semibold text-white mb-2">
                    Website SEO Optimization
                  </div>
                  <div className="text-xs text-gray-400">
                    Scraper, Writer, Researcher & Code Push agents working in
                    harmony
                  </div>
                </div>
                <div className="p-4 bg-gray-900/30 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-pink-500/50 transition-all duration-300">
                  <div className="font-semibold text-white mb-2">
                    Market Sentiment Analysis
                  </div>
                  <div className="text-xs text-gray-400">
                    Reddit & Scraper agents analyzing real-time customer
                    feedback
                  </div>
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-start items-center gap-6 opacity-60">
              <div className="flex items-center gap-2 text-gray-400">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Verifiable Tasks</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-600"></div>
              <div className="flex items-center gap-2 text-gray-400">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Transparent Provenance
                </span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-600"></div>
              <div className="flex items-center gap-2 text-gray-400">
                <Bot className="w-4 h-4" />
                <span className="text-sm font-medium">Autonomous AI</span>
              </div>
            </div>

            {/* Tagline */}
            <div className="pt-8 border-t border-gray-800">
              <p className="text-sm text-gray-500 italic">
                "Autonomous AI shaping economies, creating value."
              </p>
            </div>
          </div>

          {/* Absolutely positioned Lottie animation */}
          <div className="absolute top-0 right-[-100px] lg:right-[-800px] xl:right-[-300px] w-[700px] h-[700px] lg:w-[800px] lg:h-[800px] pointer-events-none hidden lg:block z-0 opacity-60">
            {animationData ? (
              <Lottie
                animationData={animationData}
                loop
                autoplay
                className="w-full h-full object-contain"
                style={{
                  background: "transparent",
                  transform: "scale(1.0)",
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-600/5 to-pink-600/5 rounded-2xl border border-purple-500/10 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center">
                    <Bot className="w-12 h-12 text-white animate-pulse" />
                  </div>
                  <div className="text-gray-400 text-lg font-medium">
                    Multi-Agent Orchestration
                  </div>
                  <div className="text-sm text-gray-500 max-w-sm">
                    Visualizing interconnected AI systems
                    <br />
                    collaborating on complex challenges
                  </div>
                </div>
              </div>
            )}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-purple-500/10 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-pink-500/10 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 -left-8 w-6 h-6 bg-blue-500/10 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
