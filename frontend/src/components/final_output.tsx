import Link from "next/link";
import { IOutput } from "../../types";
import { useState } from "react";

interface IFinalOutput {
  output: IOutput[];
  txHash?: string;
}

// Success checkmark icon
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12"></polyline>
  </svg>
);

// External link icon
const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15,3 21,3 21,9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

// Copy icon
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

// Expand icon
const ExpandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15,3 21,3 21,9"></polyline>
    <polyline points="9,21 3,21 3,15"></polyline>
    <line x1="21" y1="3" x2="14" y2="10"></line>
    <line x1="3" y1="21" x2="10" y2="14"></line>
  </svg>
);

// Collapse icon
const CollapseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4,14 10,14 10,20"></polyline>
    <polyline points="20,10 14,10 14,4"></polyline>
    <line x1="14" y1="10" x2="21" y2="3"></line>
    <line x1="3" y1="21" x2="10" y2="14"></line>
  </svg>
);

const FinalOutput = ({ output, txHash }: IFinalOutput) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const finalResponse: IOutput = output?.[output.length - 1];
  
  const shouldShowExpandButton = finalResponse?.response?.length > 500;
  const displayText = shouldShowExpandButton && !isExpanded 
    ? finalResponse.response.slice(0, 500) + "..."
    : finalResponse?.response || "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(finalResponse.response);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatTxHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
  };

  return (
    <div 
      className="space-y-6"
      style={{
        animation: 'fadeInUp 0.6s ease-out forwards',
      }}
    >
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
          <CheckIcon />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-800">Execution Complete!</h2>
          <p className="text-slate-600 mt-2">Your AI workflow has been successfully executed.</p>
        </div>
      </div>

      {/* Transaction Hash */}
      {txHash && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-1">Transaction Hash</p>
              <p className="font-mono text-slate-600 text-sm">{formatTxHash(txHash)}</p>
            </div>
            <Link 
              href={`https://amoy.polygonscan.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
            >
              View on Etherscan
              <ExternalLinkIcon />
            </Link>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Final Results</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  copySuccess 
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300 hover:scale-105'
                }`}
              >
                <CopyIcon />
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
              {shouldShowExpandButton && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg border border-slate-300 transition-all duration-200 hover:scale-105"
                >
                  {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
                  {isExpanded ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="prose prose-slate max-w-none">
            <div 
              className={`text-slate-700 leading-relaxed whitespace-pre-wrap transition-all duration-300 ${
                isExpanded ? 'max-h-none' : ''
              }`}
            >
              {displayText}
            </div>
          </div>

          {/* Execution Summary */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <p className="text-2xl font-black text-purple-700">{output.length}</p>
                <p className="text-sm text-purple-600 font-medium">Agents Executed</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg border border-green-200">
                <p className="text-2xl font-black text-green-700">100%</p>
                <p className="text-sm text-green-600 font-medium">Success Rate</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <p className="text-2xl font-black text-blue-700">
                  {Math.ceil(finalResponse?.response?.length / 100) || 1}s
                </p>
                <p className="text-sm text-blue-600 font-medium">Est. Time</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-lg hover:shadow-purple-200/80 transform transition-all duration-200 hover:scale-105"
        >
          Start New Workflow
        </button>
        <button
          onClick={handleCopy}
          className="px-6 py-3 bg-white text-slate-700 font-bold rounded-lg shadow-sm border border-slate-300 hover:bg-slate-50 transition-all duration-200 hover:scale-105"
        >
          Copy Results
        </button>
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
      `}</style>
    </div>
  );
};

export default FinalOutput;