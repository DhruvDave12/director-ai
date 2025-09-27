import Link from "next/link";
import { IOutput } from "../../types";

interface IFinalOutput {
  output: IOutput[];
  txHash?: string;
}

const FinalOutput = ({ output, txHash }: IFinalOutput) => {
  const finalResponse: IOutput = output?.[output.length - 1];

  return (
    <div className="w-full bg-purple-600/10 backdrop-blur-sm rounded-lg border border-white/20 p-4 mt-6">
      {/* Main Response */}
      <div className="mb-3">
        <p className="text-white text-base font-light leading-relaxed">{finalResponse.response.slice(0, 500)}...</p>
      </div>

      <div className="flex flex-col items-center justify-center overflow-x-auto space-x-6 pb-1 mt-6 w-full">
        <div className="flex flex-row items-center justify-center overflow-x-auto space-x-6 pb-1 mt-6 w-full">
          {output?.map((pakkaWalaOutput, index) => (
            <div
              key={index + 1}
              className="flex-shrink-0 bg-white/5 rounded-md p-2 border border-white/10 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-md text-white/70 mr-2">Agent {index + 1}</span>
                <span className="text-md text-green-400 font-semibold">Score: {pakkaWalaOutput.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinalOutput;
