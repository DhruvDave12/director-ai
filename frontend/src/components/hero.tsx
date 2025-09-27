"use client";
import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { useAccount } from "wagmi";
import FinalOutput from "./final_output";
import Plans from "./plan_render";
import { IOutput, IPlan, IServerExecutionPlan } from "../../types";


const HeroSection = () => {
  const { address } = useAccount();
  const [displayText, setDisplayText] = useState("");
  const [prompt, setPrompt] = useState("");
  const productName = "DIRECTOR.AI";
  const [promptExecuted, setPromptExecuted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [finalOutputData, setFinalOutputData] = useState<IOutput[] | undefined>(undefined);

  const [plan, setPlan] = useState<IPlan[] | undefined>(undefined);
  const [promptMetadataURI, setPromptMetadataURI] = useState<string | undefined>(undefined);
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
        // const data = await fetch(`${NGROK_BASE_URL}/prompt/create`, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ prompt }),
        // });
        // const response = await data.json();
        // const plan = response.quotes;
        // setPlan(plan);
        // setPromptMetadataURI(response.promptMetadataBlobId);
        // setPromptExecuted(true);
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
    // if (promptMetadataURI === undefined || !plan?.length) return;
    // const randomString = Math.random().toString(36).substring(7);
    // // make a contract call
    // const agentAddresses = plan.map((p: IPlan) => p.agentAddress);
    // const amounts = plan.map((p: IPlan) => parseEther(p.agentPrice.toString()));
    try {
      setIsLoading(true);
    //   const provider = new ethers.BrowserProvider(window.ethereum);
    //   const signer = await provider.getSigner();
    //   const res = await sendFundsToEscrow({
    //     agentAddresses: agentAddresses,
    //     amounts: amounts,
    //     jobID: randomString,
    //     promptMetadataURI: promptMetadataURI,
    //     totalAmount: plan.reduce((acc, plan) => acc + plan.agentPrice, 0),
    //     address: address,
    //     signer: signer,
    //   });

    //   if (!res) {
    //     alert("Transaction failed. Please try again.");
    //     return;
    //   }
    //   const serverSerializedData: IServerExecutionPlan[] = [];
    //   plan.forEach((p: IPlan) => {
    //     serverSerializedData.push({
    //       agentAddress: p.agentAddress,
    //       agentDescription: p.agentDescription,
    //       agentImage: p.agentImage,
    //       agentName: p.agentName,
    //       agentPrice: p.agentPrice,
    //       agentPrompt: p.agentPrompt,
    //       agentUrl: p.apiUrl,
    //     });
    //   });
    //   const response = await fetch(`${NGROK_BASE_URL}/prompt/execute`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ jobId: randomString, data: serverSerializedData }),
    //   });

    //   const finalData = await response.json();
    //   const outputSerializedData: IOutput[] = [];

    //   finalData?.outputs?.forEach((output: any) => {
    //     const serializedOutput: IOutput = {
    //       agentAddress: output.agentAddress,
    //       response: output.response,
    //       prompt: output.prompt,
    //       attestationId: output.attestationId,
    //       score: output.score,
    //       agentPrice: output.agentPrice,
    //     };
    //     outputSerializedData.push(serializedOutput);
    //   });

    //   setTxHash(finalData.txHash);

    //   setFinalOutputData(outputSerializedData);
    } catch (err) {
      console.error(err);
      alert("An error occurred while processing your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const loading = isLoading || (plan && plan.length <= 0) || promptExecuted;
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-900 text-white sticky">
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl flex items-center justify-center p-8 max-w-4xl w-full shadow-lg border border-gray-700/50">
        <div className="w-full">
          {/* Logo and Title Container */}
          {!loading && (
            <div className="flex flex-col items-center justify-center space-y-6 mb-8">
              {/* <Image
                src="/logo.gif"
                alt="Director.AI Assistant"
                className="object-cover rounded-full w-48 h-48 shadow-2xl"
                width={200}
                height={200}
              /> */}

              <h1 className="text-7xl font-extrabold tracking-wider">
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
                  {displayText}
                </span>
              </h1>
            </div>
          )}

          {/* Input Bar Section */}
          <div className="w-full mx-auto my-8">
            <div className="relative w-full">
              <input
                type="text"
                disabled={loading}
                value={prompt}
                onChange={handlePromptChange}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="w-full pl-6 pr-40 py-5 bg-gray-800 border border-gray-700 rounded-full text-lg text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 ease-in-out shadow-inner"
              />
              <button
                disabled={loading}
                onClick={handleSendPrompt}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 ease-in-out shadow-lg flex items-center space-x-2 transform hover:scale-105"
              >
                <Send size={20} />
                <span>Send</span>
              </button>
            </div>
          </div>

          {!loading && (
            <p className="text-xl text-gray-400 text-center max-w-2xl mx-auto mb-12">
              Orchestrate your AI workflows with unprecedented intelligence and seamless coordination.
            </p>
          )}

          {isLoading && (
            <div className="flex w-full flex-col gap-5 my-5">
              <div className="skeleton h-36 w-full bg-gray-800/50 rounded-lg"></div>
              <div className="skeleton h-6 w-3/4 bg-gray-800/50 rounded"></div>
              <div className="skeleton h-6 w-full bg-gray-800/50 rounded"></div>
              <div className="skeleton h-6 w-5/6 bg-gray-800/50 rounded"></div>
            </div>
          )}
          {plan && plan.length > 0 && !finalOutputData && !isLoading && (
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
          )}
          {finalOutputData && finalOutputData.length > 0 && <FinalOutput output={finalOutputData} txHash={txHash} />}
          {/* Subtle Background Effects */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse-slow delay-2000"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;