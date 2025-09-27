"use client";
import Link from "next/link";
import TypeWriterComponent from "typewriter-effect";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { useAccount, useConnect } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingHero() {

    const { open } = useAppKit();
    const router  = useRouter();

    const { isConnected } = useAccount();

    useEffect(()=>{
        if(isConnected){
            router.push("/chat");
        }
    },[isConnected])
    

    return (
        <div className="h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center">
            <div className={cn("relative font-bold  text-center space-y-8 text-slate-900 px-4 max-w-6xl mx-auto")}>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-full px-4 py-2 text-sm font-medium text-purple-700 shadow-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Powered by Advanced AI</span>
                </div>

                {/* Main heading */}
                <div className="space-y-6">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight">
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
                            Director.AI
                        </span>
                        <span className="block text-slate-800 text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-2">
                            Your AI Task Manager
                        </span>
                    </h1>
                    
                    <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-700 leading-relaxed">
                        <span>Create intelligent agents </span>
                        <div className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                            <TypeWriterComponent
                                options={{
                                    strings: [
                                        "for SEO optimization",
                                        "for report generation",
                                        "for content creation",
                                        "for data analysis",
                                        "for any task you imagine",
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

                {/* Description */}
                <div className="max-w-3xl mx-auto">
                    <p className={cn("text-lg md:text-xl lg:text-2xl font-normal text-slate-600 leading-relaxed")}>
                        The ultimate marketplace for creators, developers, and AI enthusiasts to build, 
                        share, and deploy intelligent agents with{" "}
                        <span className="font-semibold text-purple-700">unprecedented intelligence</span>{" "}
                        and{" "}
                        <span className="font-semibold text-pink-700">seamless coordination</span>.
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Button className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
                            onClick={() => open()}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Get Started
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Button>
                    
                </div>

                {/* Stats or features */}
                <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
                    <div className="text-center">
                        <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                            10K+
                        </div>
                        <div className="text-sm font-medium text-slate-600 mt-1">
                            Active Agents
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                            99.9%
                        </div>
                        <div className="text-sm font-medium text-slate-600 mt-1">
                            Uptime
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                            24/7
                        </div>
                        <div className="text-sm font-medium text-slate-600 mt-1">
                            AI Support
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}