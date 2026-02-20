import React from 'react';

const Loader = () => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg-color)] transition-colors">
            {/* Background Decorative Blobs */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-700"></div>

            <div className="relative flex flex-col items-center">
                {/* Main Loader Rings */}
                <div className="relative w-24 h-24">
                    {/* Outer ring */}
                    <div className="absolute inset-0 border-4 border-indigo-500/10 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>

                    {/* Middle ring */}
                    <div className="absolute inset-2 border-4 border-purple-500/10 rounded-full"></div>
                    <div className="absolute inset-2 border-4 border-transparent border-b-purple-500 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>

                    {/* Inner ring */}
                    <div className="absolute inset-4 border-4 border-pink-500/10 rounded-full"></div>
                    <div className="absolute inset-4 border-4 border-transparent border-l-pink-500 rounded-full animate-[spin_2s_linear_infinite]"></div>
                </div>

                {/* Text and Pulse */}
                <div className="mt-8 flex flex-col items-center">
                    <span className="text-[var(--text-main)] font-medium text-lg tracking-widest uppercase animate-pulse">
                        Loading
                    </span>
                    <div className="flex gap-1 mt-2">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loader;
