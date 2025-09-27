"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import FinalOutput from "./final_output";
import Plans from "./plan_render";
import { IOutput, IPlan, IServerExecutionPlan } from "../../types";
import { userStories } from "@/constants";
import PromptInput from "./prompt_input";

const HeroSection = () => {
  const { address } = useAccount();
  const [displayText, setDisplayText] = useState("");
  const [prompt, setPrompt] = useState("");
  const productName = "DIRECTOR.AI";
  const [promptExecuted, setPromptExecuted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [finalOutputData, setFinalOutputData] = useState<IOutput[] | undefined>(undefined);

  const [plan, setPlan] = useState<IPlan[] | undefined>(undefined);
  const [txHash, setTxHash] = useState<string | undefined>(undefined);

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

  const handlePromptChange = (e: any) => {
    setPrompt(e.target.value);
  };

  const handleSendPrompt = async () => {
    if (prompt.trim()) {
      setIsLoading(true);
      try {
        // API call logic here
      } catch (err) {
        console.error(err);
        alert("An error occurred while processing your request. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = async (e: any) => {
    if (e.key === "Enter") {
      await handleSendPrompt();
    }
  };

  const onAccept = async () => {
    try {
      setIsLoading(true);
      // Contract call and execution logic here
    } catch (err) {
      console.error(err);
      alert("An error occurred while processing your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loading = isLoading || (plan && plan.length <= 0) || promptExecuted;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center relative overflow-hidden">

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8">
        <div className="p-8 md:p-12">
          {!loading && (
            <div className="text-center mb-12 space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
                  {displayText}
                </span>
              </h1>   
              <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Orchestrate your AI workflows with{" "}
                <span className="font-semibold text-purple-700">unprecedented intelligence</span>{" "}
                and{" "}
                <span className="font-semibold text-pink-700">seamless coordination</span>
              </p>
            </div>
          )}
           <div className="w-full mb-8">
            <PromptInput
              value={prompt}
              onChange={setPrompt} 
              onSend={handleSendPrompt}
              loading={loading}
              placeholder="Describe your AI workflow needs..."
              maxLength={1000}
            />
          </div>
          {!loading && !plan && !finalOutputData && (
            <div className="text-center mb-8">
              <p className="text-sm text-slate-500 mb-4">Try these examples:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {userStories.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(example.examplePrompt)}
                    className="px-4 py-2 bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 border border-slate-200 hover:border-purple-300"
                  >
                    {example.title}
                  </button>
                ))}
              </div>
            </div>
          )}
          {isLoading && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-purple-600 font-medium">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-600 border-t-transparent"></div>
                  Processing your request...
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="h-32 bg-slate-100 rounded-xl animate-pulse"></div>
                <div className="h-4 bg-slate-100 rounded-full w-3/4 animate-pulse"></div>
                <div className="h-4 bg-slate-100 rounded-full w-full animate-pulse"></div>
                <div className="h-4 bg-slate-100 rounded-full w-5/6 animate-pulse"></div>
              </div>
            </div>
          )}
          {plan && plan.length > 0 && !finalOutputData && !isLoading && (
            <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200">
              <Plans
                plans={plan}
                onReject={() => {
                  setPromptExecuted(false);
                  setIsLoading(false);
                  setPlan(undefined);
                  setPrompt("");
                }}
                onAccept={onAccept}
              />
            </div>
          )}
          {finalOutputData && finalOutputData.length > 0 && (
            <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200">
              <FinalOutput output={finalOutputData} txHash={txHash} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;