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

const Plans = ({ plans, onAccept, onReject }: IPlansRender) => {
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