"use client";
import { IPlan } from "../../types";

const WebScraperIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path>
    </svg>
);

const SEOIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path>
        <line x1="12" y1="5" x2="12" y2="19"></line>
    </svg>
);

const GitHubIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
);

const ContentAgentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

const EmailerAgentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);

// Error/Warning Icon
const AlertTriangleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

// Robot Icon for no agents found
const RobotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
        <circle cx="12" cy="5" r="2"></circle>
        <path d="M12 7v4"></path>
        <line x1="8" y1="16" x2="8" y2="16"></line>
        <line x1="16" y1="16" x2="16" y2="16"></line>
    </svg>
);

// Refresh Icon
const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"></polyline>
        <polyline points="1 20 1 14 7 14"></polyline>
        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
    </svg>
);

// Edit Icon  
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const AgentIcon = ({ agentName }: { agentName: string }) => {
    const name = agentName.toLowerCase();
    if (name.includes("scrape")) return <WebScraperIcon />;
    if (name.includes("seo")) return <SEOIcon />;
    if (name.includes("github")) return <GitHubIcon />;
    if (name.includes("content")) return <ContentAgentIcon />;
    if (name.includes("email")) return <EmailerAgentIcon />;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8V4H8" /><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M12 12h4" /><path d="M12 16h4" /><path d="M8 12h.01" /><path d="M8 16h.01" />
        </svg>
    );
};

interface IPlansRender {
    plans: IPlan[];
    onReject: () => void;
    onAccept: () => void;
}

// Empty State Component
const EmptyPlansState = ({ onRetry, onModifyPrompt }: { onRetry: () => void, onModifyPrompt: () => void }) => (
    <div 
        className="text-center space-y-6 py-12"
        style={{
            animation: 'fadeInUp 0.6s ease-out forwards',
        }}
    >
        {/* Icon */}
        <div className="w-24 h-24 mx-auto bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-lg text-white opacity-90">
            <RobotIcon />
        </div>

        {/* Heading */}
        <div>
            <h2 className="text-3xl font-black text-slate-800">No Suitable Agents Found</h2>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto leading-relaxed">
                We couldn't find any agents capable of handling your specific request. 
                This might be because your task falls outside our current agent capabilities 
                or needs a different approach.
            </p>
        </div>

        {/* Suggestions */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <AlertTriangleIcon />
                </div>
                <h3 className="font-bold text-slate-800">Here's what you can try:</h3>
            </div>
            <ul className="text-left space-y-2 text-slate-700">
                <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Break down your request into smaller, more specific tasks</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Use keywords like "scrape", "analyze", "email", "content", or "github"</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Try rephrasing your request to be more action-oriented</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Check if your task requires capabilities we currently support</span>
                </li>
            </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
                onClick={onModifyPrompt}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-lg hover:shadow-purple-200/80 transform transition-all duration-200 hover:scale-105"
            >
                <EditIcon />
                Modify Request
            </button>
            <button
                onClick={onRetry}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-white text-slate-700 font-bold rounded-lg shadow-sm border border-slate-300 hover:bg-slate-50 transition-all duration-200 hover:scale-105"
            >
                <RefreshIcon />
                Try Again
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

const Plans = ({ plans, onReject, onAccept }: IPlansRender) => {
    // Handle empty plans case
    if (!plans || plans.length === 0) {
        return (
            <EmptyPlansState 
                onRetry={onReject}
                onModifyPrompt={onReject}
            />
        );
    }

    const totalAmount = plans.reduce((acc, plan) => acc + plan.cost, 0);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-black text-slate-800 text-center">Execution Plan</h2>
                <p className="text-center text-slate-500 mt-1">
                    A sequence of {plans.length} agents will run to complete your request.
                </p>
            </div>

            {/* Agent Sequence Flow */}
            <div className="relative space-y-4">
                {/* Dotted line connecting the steps */}
                <div className="absolute left-6 top-6 bottom-6 w-px bg-slate-300 border-l-2 border-dashed"></div>
                
                {plans.map((plan, index) => (
                    <div key={plan.agentId} className="relative pl-14 py-2">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border-2 border-purple-200 shadow-md flex items-center justify-center text-purple-600">
                           <AgentIcon agentName={plan.agentName} />
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-slate-800 capitalize">
                                        {plan.agentName.replace(/_/g, " ")}
                                    </p>
                                    <p className="text-xs text-slate-500 font-mono mt-1">
                                        {plan.agentAddress}
                                    </p>
                                </div>
                                <p className="font-bold text-purple-700 text-lg">
                                    {plan.cost.toFixed(4)} ETH
                                </p>
                            </div>
                            <p className="text-slate-600 mt-3 text-sm leading-relaxed">
                                {plan.agentPrompt}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Plans;