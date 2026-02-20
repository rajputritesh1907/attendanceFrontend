import React from 'react';

export const Skeleton = ({ className }) => (
    <div className={`skeleton ${className}`}></div>
);

export const AttendanceSkeleton = () => (
    <div className="glass-panel p-8 rounded-[32px] space-y-8 animate-pulse">
        <div className="flex items-center gap-2">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="w-40 h-6" />
        </div>
        <div className="space-y-6 text-center">
            <Skeleton className="w-32 h-8 mx-auto rounded-xl" />
            <Skeleton className="w-full h-24 rounded-2xl" />
            <Skeleton className="w-full h-16 rounded-2xl" />
        </div>
    </div>
);

export const TaskSkeleton = () => (
    <div className="space-y-10 animate-pulse">
        <div>
            <div className="flex items-center gap-2 mb-6">
                <Skeleton className="w-5 h-5 rounded-full" />
                <Skeleton className="w-48 h-6" />
            </div>
            <div className="space-y-6">
                {[1, 2].map(i => (
                    <div key={i} className="p-8 rounded-3xl glass-morphism border-l-4 border-slate-700">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div className="flex-1 space-y-4">
                                <Skeleton className="w-3/4 h-8" />
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-5/6 h-4" />
                                <Skeleton className="w-40 h-6 rounded-xl" />
                            </div>
                            <div className="w-full md:w-32 h-12 rounded-2xl bg-slate-700/50"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
