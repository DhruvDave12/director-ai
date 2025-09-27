import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { IFinalOutput } from "../../types";

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


const FinalOutput = ({ output }: { output: IFinalOutput }) => {
  const [expandedAgents, setExpandedAgents] = useState<{ [key: string]: boolean }>({});
  const [copySuccess, setCopySuccess] = useState<{ [key: string]: boolean }>({});
  
  const toggleAgentExpansion = (agentAddress: string) => {
    setExpandedAgents(prev => ({
      ...prev,
      [agentAddress]: !prev[agentAddress]
    }));
  };

  const handleCopy = async (text: string, agentAddress: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(prev => ({ ...prev, [agentAddress]: true }));
      setTimeout(() => {
        setCopySuccess(prev => ({ ...prev, [agentAddress]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatTxHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
  };

  const formatAgentName = (name: string) => {
    return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const shouldShowExpandButton = (text: string) => text?.length > 500;

  const getDisplayText = (text: string, isExpanded: boolean) => {
    return shouldShowExpandButton(text) && !isExpanded 
      ? text.slice(0, 500) + "..."
      : text || "";
  };

  const getAgentIcon = (agentName: string) => {
    if (agentName.includes('scraper') || agentName.includes('web')) return '🕷️';
    if (agentName.includes('seo') || agentName.includes('optimization')) return '📈';
    if (agentName.includes('github') || agentName.includes('code')) return '💻';
    if (agentName.includes('email') || agentName.includes('outreach')) return '✉️';
    if (agentName.includes('social') || agentName.includes('media')) return '📱';
    if (agentName.includes('writer') || agentName.includes('content')) return '✍️';
    return '🤖';
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
        <div>
          <h2 className="text-3xl font-black text-slate-800">Execution Complete!</h2>
          <p className="text-slate-600 mt-2">Your task has been successfully executed.</p>
        </div>
      </div>

      {/* Job Information */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-1">Job ID</p>
            <p className="font-mono text-slate-600 text-sm">{output.jobId}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-1">Completed At</p>
            <p className="text-slate-600 text-sm">{formatTimestamp(output.timestamp)}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50/50 rounded-xl border border-slate-200 backdrop-blur-sm shadow-sm overflow-hidden">
        <div className="bg-white/40 px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">Execution Summary</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/60 rounded-lg border border-slate-200 shadow-sm">
              <p className="text-2xl font-black text-slate-700">{output.executionSummary.totalAgents}</p>
              <p className="text-sm text-slate-600 font-medium">Total Agents</p>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-lg border border-slate-200 shadow-sm">
              <p className="text-2xl font-black text-purple-600">{output.executionSummary.successfulAgents}</p>
              <p className="text-sm text-slate-600 font-medium">Successful</p>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-lg border border-slate-200 shadow-sm">
              <p className="text-2xl font-black text-slate-500">{output.executionSummary.failedAgents}</p>
              <p className="text-sm text-slate-600 font-medium">Failed</p>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-lg border border-slate-200 shadow-sm">
              <p className="text-2xl font-black text-pink-600">${output.executionSummary.totalCost.toFixed(3)}</p>
              <p className="text-sm text-slate-600 font-medium">Total Cost</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Results */}
      <div className="space-y-4">
        {output.results.map((agent, index) => {
          const isExpanded = expandedAgents[agent.agentAddress];
          const agentText = agent.result.content?.[0]?.text || '';
          const displayText = getDisplayText(agentText, isExpanded);
          const hasCopySuccess = copySuccess[agent.agentAddress];
          
          return (
            <div key={agent.agentAddress} className="bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Agent Header */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getAgentIcon(agent.agentName)}</span>
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">{formatAgentName(agent.agentName)}</h4>
                      <p className="text-sm text-slate-600">Agent #{index + 1} • {formatTimestamp(agent.timestamp)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      agent.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {agent.status}
                    </span>
                    <span className="text-sm text-slate-600">${agent.executionCost.toFixed(3)}</span>
                  </div>
                </div>
              </div>

              {/* Agent Content */}
              <div className="p-6">
                {/* Input Prompt */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Input Prompt:</p>
                  <p className="text-sm text-gray-600">{agent.inputPrompt}</p>
                </div>

                {/* Transaction Info */}
                {agent.result._meta?.["x402/payment-response"] && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-blue-700 mb-1">Transaction</p>
                        <p className="font-mono text-blue-600 text-xs">
                          {formatTxHash(agent.result._meta["x402/payment-response"].transaction)}
                        </p>
                      </div>
                      <Link 
                        href={`https://amoy.polygonscan.com/tx/${agent.result._meta["x402/payment-response"].transaction}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded transition-all duration-200 hover:scale-105"
                      >
                        View
                        <ExternalLinkIcon />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Agent Response */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-md font-semibold text-slate-700">Response:</h5>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(agentText, agent.agentAddress)}
                        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                          hasCopySuccess 
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300 hover:scale-105'
                        }`}
                      >
                        <CopyIcon />
                        {hasCopySuccess ? 'Copied!' : 'Copy'}
                      </button>
                      {shouldShowExpandButton(agentText) && (
                        <button
                          onClick={() => toggleAgentExpansion(agent.agentAddress)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg border border-slate-300 transition-all duration-200 hover:scale-105"
                        >
                          {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
                          {isExpanded ? 'Show Less' : 'Show More'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="prose prose-slate max-w-none">
                    <div 
                      className="text-slate-700 leading-relaxed whitespace-pre-wrap transition-all duration-300 bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-46 overflow-y-auto"
                    >
                      {displayText}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-lg hover:shadow-purple-200/80 transform transition-all duration-200"
        >
          Start New Workflow
        </Button>
        <Button
          onClick={() => {
            const allResults = output.results.map(agent => 
              `=== ${formatAgentName(agent.agentName)} ===\n${agent.result.content?.[0]?.text || ''}\n\n`
            ).join('');
            navigator.clipboard.writeText(allResults);
          }}
          className="px-6 py-3 bg-white text-slate-700 font-bold rounded-lg shadow-sm border border-slate-300 hover:bg-slate-50 transition-all duration-200 "
        >
          Copy All Results
        </Button>
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