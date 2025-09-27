"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { IAgent } from "../../../types";
import { FALLBACK_AGENTS } from "@/constants";

const AvailableAgents = () => {
  const [displayText, setDisplayText] = useState("");
  const productName = "AVAILABLE AGENTS";
  const [agents, setAgents] = useState<IAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= productName.length) {
        setDisplayText(productName.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      setError(null);

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
        throw new Error("Failed to fetch agents from backend");
      }

      const data = await response.json();
      console.log("Fetched agents:", data);

      setAgents(data);

    } catch (err) {
      console.error("Failed to fetch agents from backend:", err);
      
      setAgents(FALLBACK_AGENTS);
      setError("Using cached agents data");
      
    } finally {
      setIsLoading(false);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50/30 flex flex-col justify-center items-center">
        <div className="absolute top-4 right-4 z-20">
          <w3m-account-button />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50/30 flex flex-col relative overflow-hidden">
      <div className="absolute top-4 right-4 z-20">
        <w3m-account-button />
      </div>
      
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8">
        <div className="p-0 md:p-4">
          {/* Header Section */}
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
                {displayText}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Discover our{" "}
              <span className="font-semibold text-purple-700">
                powerful AI agents
              </span>{" "}
              ready to{" "}
              <span className="font-semibold text-pink-700">
                transform your workflows
              </span>
            </p>
            
            {error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-md mx-auto">
                <p className="text-sm text-yellow-700">{error}</p>
              </div>
            )}
          </div>


          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {agents.map((agent, index) => (
              <div
                key={index}
                className="group bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-purple-300 hover:-translate-y-1"
                style={{
                  animation: `fadeInUp 0.6s ease-out forwards`,
                  animationDelay: `${index * 100}ms`,
                  opacity: 0,
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 group-hover:scale-110 transition-transform duration-200"></div>
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-purple-700 transition-colors duration-200">
                      {agent.name}
                    </h3>
                  </div>
                  
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {agent.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                      AI Agent
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-200">
                      <svg 
                        className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform duration-200" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M13 10V3L4 14h7v7l9-11h-7z" 
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  {agents.length}
                </p>
                <p className="text-sm font-semibold text-slate-600">Available Agents</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  24/7
                </p>
                <p className="text-sm font-semibold text-slate-600">Always Ready</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-blue-600">
                  ∞
                </p>
                <p className="text-sm font-semibold text-slate-600">Scalable</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AvailableAgents;