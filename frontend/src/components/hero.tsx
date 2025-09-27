"use client";

import {  useEffect, useState } from "react";
import { useAccount } from "wagmi";
import FinalOutput from "./final_output";
import Plans from "./plan_render";
import {  IFinalOutput, IPlan } from "../../types";
import { getTokenAddress, userStories } from "@/constants";
import PromptInput from "./prompt_input";
import { useRouter } from "next/navigation";
import { erc20Abi, parseUnits } from "viem";
import { toast } from "sonner";
import {
  writeContract,
  waitForTransactionReceipt,
} from '@wagmi/core';
import { config } from "@/config";
import LoadingComponent from "./loading_text";
import { Button } from "./ui/button";
import { getChainId } from '@wagmi/core';

const HeroSection = () => {
  const router = useRouter();
  const { isConnected } = useAccount();
  const [displayText, setDisplayText] = useState("");
  const [prompt, setPrompt] = useState("");
  const productName = "DIRECTOR.AI";
  const [promptExecuted, setPromptExecuted] = useState(false);
  // State to manage the loading state
  const [loadingState, setLoadingState] = useState<'plan' | 'execute' | 'transaction' | null>(null);
  const chainId = getChainId(config)

  const getErrorMessage = async (response: Response): Promise<string> => {
    try {
      const errorData = await response.json();
      return errorData.message || errorData.error || `Request failed with status: ${response.status}`;
    } catch {
      return `Request failed with status: ${response.status}`;
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<IPlan[] | undefined>(undefined);
  const [planResponse, setPlanResponse] = useState<any>(undefined);
  const [executeResponse, setExecuteResponse] = useState<any>(undefined);

  const totalAmount = plan?.reduce((acc, plan) => acc + plan.cost, 0);

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= productName.length) {
        setDisplayText(productName.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  const handleSendPrompt = async () => {
    if (prompt.trim()) {
      setPromptExecuted(true);
      setIsLoading(true);
      setLoadingState('plan');
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/jobs/quote`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt, chainId }),
          }
        );

        if (!response.ok) {
          const errorMessage = await getErrorMessage(response);
          throw new Error(errorMessage);
        }

        const data = await response.json();

        if (data.success && data.agentSequence) {
          setPlanResponse(data);
          setPlan(data.agentSequence);
        } else {
          const errorMessage = data.message || data.error || "Failed to get a valid plan from the server.";
          toast(errorMessage);
          setPromptExecuted(false);
        }
      } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : "An error occurred while processing your request. Please try again.";
        toast(errorMessage);
        setPromptExecuted(false);
      } finally {
        setIsLoading(false);
        setLoadingState(null);
      }
    }
  };

  const onAccept = async () => {
    try {
      setIsLoading(true);
      setLoadingState('transaction');
      setPromptExecuted(true);
      if (totalAmount === undefined || totalAmount === 0) {
        toast("Invalid total amount for transaction.");
        setIsLoading(false);
        setLoadingState(null);
        return;
      }
      if (!plan || plan.length === 0) {
        toast("No execution plan available.");
        setIsLoading(false);
        setLoadingState(null);
        return;
      }
      if(process.env.NEXT_PUBLIC_SERVER_ADDRESS === undefined) {
        toast("Server address is not defined.");
        setIsLoading(false);
        setLoadingState(null);
        return;
      }
      if (!isConnected) {
        toast("Wallet not connected.");
        setIsLoading(false);
        setLoadingState(null);
        return;
      }

      const tokenAddress = getTokenAddress(chainId)
      const to = process.env.NEXT_PUBLIC_SERVER_ADDRESS as `0x${string}`;
      const hash = await writeContract(config, {
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [
          to,
          parseUnits(totalAmount.toString(),6)
        ],
      });
      await waitForTransactionReceipt(config, {
        hash: hash,
      });
      setLoadingState('execute');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/jobs/execute`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobId:planResponse.jobId,
            agentSequence:planResponse.agentSequence,
            transferHash: hash,
            chainId
          }),
        }
      );

      if (!response.ok) {
        const errorMessage = await getErrorMessage(response);
        throw new Error(errorMessage);
      }
      const data = await response.json();

      setExecuteResponse(data);
    } catch (err) {
      console.error(err);
      let errorMessage = "An error occurred while processing your request";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      toast(errorMessage);
      setPromptExecuted(false);
    } finally {
      setIsLoading(false);
      setLoadingState(null);
    }
  };

  const onReject = () => {
    resetState();
  };

  const resetState = () => {
    setPromptExecuted(false);
    setIsLoading(false);
    setLoadingState(null);
    setPlan(undefined);
    setExecuteResponse(undefined);
    setPrompt("");
  };

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50/30 flex flex-col relative overflow-hidden transition-all duration-700 ease-out ${promptExecuted ? "justify-start pt-16" : "justify-center pt-0"
        }`}
    >
      <div className="absolute top-4 right-4 z-20">
        <w3m-account-button />
      </div>
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8">
        <div className="p-0 md:p-4">
          {/* Animated Header Section */}
          <div
            className={`text-center space-y-6 transition-all duration-700 ease-out transform ${promptExecuted
                ? "opacity-0 scale-95 -translate-y-8 mb-0 pointer-events-none max-h-0 overflow-hidden"
                : "opacity-100 scale-100 translate-y-0 mb-12 max-h-screen"
              }`}
            style={{
              transitionProperty: 'opacity, transform, max-height, margin-bottom',
            }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
                {displayText}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Orchestrate your AI workflows with{" "}
              <span className="font-semibold text-purple-700">
                unprecedented intelligence
              </span>{" "}
              and{" "}
              <span className="font-semibold text-pink-700">
                seamless coordination
              </span>
            </p>
          </div>

          {/* Prompt Input - now persistent */}
          <div
            className={`w-full mb-8 transition-all duration-500 ease-out ${promptExecuted ? 'transform -translate-y-4' : 'transform translate-y-0'
              }`}
          >
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              onSend={handleSendPrompt}
              loading={isLoading}
              placeholder="Describe your AI workflow needs..."
              maxLength={1000}
            />
          </div>

          {/* Content area for examples, loader, and results */}
          <div className="w-full">
            {/* Example Prompts */}
            <div
              className={`transition-all duration-500 ease-out transform ${promptExecuted
                  ? "opacity-0 scale-95 -translate-y-4 max-h-0 overflow-hidden pointer-events-none"
                  : "opacity-100 scale-100 translate-y-0 max-h-screen"
                }`}
              style={{
                transitionProperty: 'opacity, transform, max-height',
              }}
            >
              {!isLoading && !plan && !executeResponse && (
                <div className="text-center mb-8">
                  <p className="text-sm text-slate-500 mb-4">
                    Try these examples:
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {userStories.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setPrompt(example.examplePrompt)}
                        className="px-4 py-2 bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 rounded-full text-sm font-medium transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-0.5 hover:shadow-md border border-slate-200 hover:border-purple-300"
                        style={{
                          animationDelay: `${index * 100}ms`,
                        }}
                      >
                        {example.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Loading State */}
            {isLoading && loadingState && (
              <LoadingComponent loadingState={loadingState} />
            )}

            {/* Plan Display State */}
            {plan && plan.length > 0 && !executeResponse && !isLoading && (
              <div
                className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200 backdrop-blur-sm"
                style={{
                  animation: 'fadeInUp 0.6s ease-out forwards',
                }}
              >
                <Plans plans={plan} onReject={resetState} onAccept={onAccept} />

                {/* Summary and Actions */}
                {plan.length && (<div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 mt-8 space-y-4 border border-purple-200">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold text-slate-700">Total Estimated Cost:</p>
                    {totalAmount && <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                      {totalAmount.toFixed(4)} ETH
                    </p>}
                  </div>
                  <div className="w-full flex justify-center items-center gap-x-4 pt-2">
                    <Button
                      onClick={onReject}
                      className="w-[200px] py-3 px-4 bg-white text-slate-700 font-bold rounded-lg shadow-sm border border-slate-300 hover:bg-slate-50 transition-all duration-200"
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={onAccept}
                      className="w-[200px] py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-lg hover:shadow-purple-200/80 transform transition-all duration-200"
                    >
                      Confirm & Execute
                    </Button>
                  </div>
                </div>)}
              </div>
            )}

            {/* Final Output State */}
            {executeResponse && (
              <div
                className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200 backdrop-blur-sm"
                style={{
                  animation: 'fadeInUp 0.6s ease-out forwards',
                }}
              >
                <FinalOutput output={executeResponse} />
              </div>
            )}
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

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 2s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .bg-size-200 {
          background-size: 200% 100%;
        }

        .bg-pos-0 {
          background-position: -200% 0;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;