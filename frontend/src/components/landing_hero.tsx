"use client";
import Link from "next/link";
import TypeWriterComponent from "typewriter-effect";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles, Zap, Bot, Star, Users, Shield } from "lucide-react";
import { useAccount, useConnect } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";

export default function LandingHero() {

    const { open } = useAppKit();
    const router = useRouter();

    const { isConnected } = useAccount();

    const [animationData, setAnimationData] = useState<any | null>(null);

    useEffect(() => {
        if (isConnected) {
            router.push("/chat");
        }
    }, [isConnected])

    useEffect(() => {
        let isMounted = true;
        fetch("lottie_2.json")
            .then((res) => res.json())
            .then((data) => {
                if (isMounted) setAnimationData(data);
            })
            .catch(() => {
                // Silently ignore load errors; fallback UI will remain
            });
        return () => {
            isMounted = false;
        };
    }, []);


    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-950 via-slate-950 to-black flex items-center py-12">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-600/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/3 rounded-full blur-3xl animate-pulse"></div>
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-20">
                <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            </div>

            <div className="relative w-full max-w-7xl mx-auto px-8 z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    {/* Left Column - Content */}
                    <div className="text-left space-y-8" style={{ paddingLeft: '15px' }}>
                        {/* Logo */}
                        <div className="flex justify-start mb-8">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
                                    <Bot className="w-10 h-10 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-full px-4 py-2 text-sm font-medium text-purple-300 mb-8">
                            <Sparkles className="w-4 h-4" />
                            <span>Powered by Advanced AI</span>
                            <Star className="w-4 h-4 text-yellow-400" />
                        </div>

                        {/* Main heading */}
                        <div className="space-y-6 mb-8">
                            <h1 className="text-4xl sm:text-5xl md:tex@pubt-6xl lg:text-7xl font-black leading-tight">
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
                                    Director.AI
                                </span>
                                <span className="block text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-2">
                                    Your AI Task Manager
                                </span>
                            </h1>

                            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-200 leading-relaxed">
                                <span>Create intelligent agents </span>
                                <br />
                                <div className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                                    <TypeWriterComponent
                                        options={{
                                            strings: [
                                                "for SEO optimization",
                                                "for report generation",
                                                "for content creation",
                                                "for data analysis",
                                                "for blockchain automation",
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
                        <div className="max-w-2xl mb-10">
                            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                                The ultimate marketplace for creators, developers, and AI enthusiasts to build,
                                share, and deploy intelligent agents with{" "}
                                <span className="font-semibold text-purple-400">unprecedented intelligence</span>{" "}
                                and{" "}
                                <span className="font-semibold text-pink-400">seamless coordination</span>.
                            </p>
                        </div>

                        {/* CTA Button */}
                        <div className="flex justify-start items-center mb-16">
                            <Button
                                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 min-w-[250px]"
                                onClick={() => open()}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    Get Started
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mb-12">
                            <div className="text-left p-4 bg-gray-900/30 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
                                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-1">
                                    10K+
                                </div>
                                <div className="text-sm font-medium text-gray-300 mb-1">
                                    Active Agents
                                </div>
                                <div className="text-xs text-gray-500">
                                    Running 24/7
                                </div>
                            </div>
                            <div className="text-left p-4 bg-gray-900/30 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
                                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-1">
                                    99.9%
                                </div>
                                <div className="text-sm font-medium text-gray-300 mb-1">
                                    Uptime
                                </div>
                                <div className="text-xs text-gray-500">
                                    Enterprise Grade
                                </div>
                            </div>
                            <div className="text-left p-4 bg-gray-900/30 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
                                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-1">
                                    24/7
                                </div>
                                <div className="text-sm font-medium text-gray-300 mb-1">
                                    AI Support
                                </div>
                                <div className="text-xs text-gray-500">
                                    Always Available
                                </div>
                            </div>
                        </div>

                        {/* Trust indicators */}
                        <div className="flex flex-wrap justify-start items-center gap-6 opacity-60">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Shield className="w-4 h-4" />
                                <span className="text-sm font-medium">Enterprise Security</span>
                            </div>
                            <div className="hidden sm:block w-px h-4 bg-gray-600"></div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Zap className="w-4 h-4" />
                                <span className="text-sm font-medium">Lightning Fast</span>
                            </div>
                            <div className="hidden sm:block w-px h-4 bg-gray-600"></div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Bot className="w-4 h-4" />
                                <span className="text-sm font-medium">AI Powered</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Lottie Animation */}
                    <div className="flex justify-center items-center">
                        <div className="relative w-full max-w-lg h-100 lg:h-[500px]">
                            {/* Lottie Animation or Placeholder */}
                            {animationData ? (
                                <Lottie
                                    animationData={animationData}
                                    loop
                                    autoplay
                                    className="w-full h-full"
                                    style={{ background: "transparent" }}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-2xl border border-purple-500/20 flex items-center justify-center backdrop-blur-sm">
                                    <div className="text-center space-y-4">
                                        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                                            <Bot className="w-10 h-10 text-white animate-pulse" />
                                        </div>
                                        <div className="text-gray-400 text-sm">
                                            Lottie Animation Placeholder
                                        </div>
                                        <div className="text-xs text-gray-500 max-w-xs">
                                            Replace this div with your Lottie component.<br />
                                            Suggested: Workflow, AI brain, or automation animation
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Decorative elements around animation */}
                            <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-500/20 rounded-full animate-pulse"></div>
                            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-500/20 rounded-full animate-pulse delay-1000"></div>
                            <div className="absolute top-1/2 -left-6 w-4 h-4 bg-blue-500/20 rounded-full animate-pulse delay-500"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}