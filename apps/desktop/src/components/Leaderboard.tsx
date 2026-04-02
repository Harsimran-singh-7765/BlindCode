import { Activity } from "lucide-react";

export interface LeaderboardParticipant {
    _id: string;
    name: string;
    score: number;
    status: string;
    reveals: number;
    wrongSubmissions: number;
    currentProblemId?: { _id: string; title: string; difficulty: string } | string;
    solvedProblemIds?: string[];
}

interface ProblemBase {
    _id: string;
    title: string;
    difficulty: string;
}

interface LeaderboardProps {
    leaderboard: LeaderboardParticipant[];
    currentParticipantId: string;
    problems: ProblemBase[];
}

export default function Leaderboard({ leaderboard, currentParticipantId, problems }: LeaderboardProps) {
    if (leaderboard.length === 0) {
        return (
            <div className="flex flex-col gap-3 h-full">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Activity size={18} className="text-cyan-400" /> Live Rankings
                    </h2>
                    <span className="flex items-center gap-1.5 text-xs text-[#858585]">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
                        Auto-sync
                    </span>
                </div>
                <div className="text-center text-[#858585] mt-10">
                    <p>No leaderboard data available.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 h-full overflow-hidden">
            <div className="flex items-center justify-between mb-2 shrink-0">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity size={18} className="text-cyan-400" /> Live Rankings
                </h2>
                <span className="flex items-center gap-1.5 text-xs text-[#858585]">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
                    Auto-sync
                </span>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto pr-1 pb-4 custom-scrollbar">
                {leaderboard.map((p, index) => {
                    const isMe = p._id === currentParticipantId;

                    return (
                        <div
                            key={p._id}
                            className={`flex flex-col p-3 rounded-lg border transition-colors ${
                                isMe
                                    ? "bg-cyan-950/30 border-cyan-500/50"
                                    : "bg-[#1e1e1e] border-[#3c3c3c] hover:bg-[#252526]"
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className={`font-mono text-sm font-bold ${
                                        index === 0 ? "text-yellow-400" :
                                        index === 1 ? "text-slate-300" :
                                        index === 2 ? "text-orange-400" : "text-[#858585]"
                                    }`}>
                                        #{index + 1}
                                    </span>
                                    <div className="flex flex-col min-w-0">
                                        <span className={`text-sm font-semibold truncate ${isMe ? "text-cyan-400" : "text-white"}`}>
                                            {p.name} {isMe && "(You)"}
                                        </span>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <div className="flex items-center gap-1">
                                                <div className={`w-1.5 h-1.5 rounded-full ${
                                                    p.status === 'coding' ? 'bg-cyan-400' :
                                                    p.status === 'idle' ? 'bg-[#858585]' :
                                                    p.status === 'submitted' ? 'bg-green-400' : 'bg-red-500'
                                                }`} />
                                                <span className="text-[10px] text-[#858585] capitalize">{p.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="font-mono font-bold text-yellow-400 text-base">{p.score}</div>
                                    <div className="text-[10px] text-[#858585] mt-0.5">pts</div>
                                </div>
                            </div>
                            
                            {/* Problems Spheres row */}
                            {problems && problems.length > 0 && (
                                <div className="flex gap-2 items-center mt-1 pt-2 border-t border-[#3c3c3c]/50">
                                    <span className="text-[10px] text-[#858585] uppercase tracking-wider">Progress:</span>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {problems.map((prob, i) => {
                                            const isSolved = p.solvedProblemIds?.includes(prob._id) || false;
                                            
                                            // Is this the problem they are currently working on?
                                            let isCurrent = false;
                                            if (typeof p.currentProblemId === 'string') {
                                                isCurrent = p.currentProblemId === prob._id;
                                            } else if (p.currentProblemId && typeof p.currentProblemId === 'object') {
                                                isCurrent = p.currentProblemId._id === prob._id || p.currentProblemId.title === prob.title;
                                            }

                                            let sphereClass = "w-3.5 h-3.5 rounded-full transition-all duration-300 flex-shrink-0 ";
                                            if (isSolved) {
                                                sphereClass += "bg-green-500 border-2 border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]";
                                            } else if (isCurrent) {
                                                sphereClass += "bg-transparent border-2 border-purple-500 sphere-pulse";
                                            } else {
                                                sphereClass += "bg-black border-2 border-[#3c3c3c]";
                                            }

                                            return (
                                                <div 
                                                    key={prob._id} 
                                                    className={sphereClass}
                                                    title={`Q${i + 1}: ${prob.title} - ${isSolved ? 'Solved' : isCurrent ? 'Working' : 'Unsolved'}`} 
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
