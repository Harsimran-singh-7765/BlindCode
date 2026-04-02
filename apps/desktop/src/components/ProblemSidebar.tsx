import { FileText, History, Trophy } from "lucide-react";
import type { Challenge } from "../data/questions";
import Leaderboard, { type LeaderboardParticipant } from "./Leaderboard";
import SidebarDescription from "./SidebarDescription";
import SidebarSubmissions, { type SubmissionData } from "./SidebarSubmissions";

export type { SubmissionData, LeaderboardParticipant };

interface ProblemBase {
    _id: string;
    title: string;
    difficulty: string;
}

interface ProblemSidebarProps {
    challenge: Challenge;
    activeTab: "description" | "submissions" | "leaderboard";
    onTabChange: (tab: "description" | "submissions" | "leaderboard") => void;
    submission: SubmissionData;
    level: number;
    leaderboard: LeaderboardParticipant[];
    currentParticipantId: string;
    // For spheres
    problems: ProblemBase[];
}

export default function ProblemSidebar({
    challenge, activeTab, onTabChange, submission, level, leaderboard, currentParticipantId, problems
}: ProblemSidebarProps) {
    return (
        <div className="w-full bg-[#252526] flex flex-col border-r border-[#3c3c3c] shrink-0 h-full overflow-hidden">
            {/* Tabs Header */}
            <div className="flex items-center bg-[#1e1e1e] px-2 pt-2 border-b border-[#3c3c3c] overflow-x-auto custom-scrollbar shrink-0">
                <button
                    onClick={() => onTabChange("description")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors text-sm font-medium whitespace-nowrap ${activeTab === "description" ? "bg-[#252526] text-white" : "text-[#858585] hover:bg-[#2a2d2e] hover:text-[#cccccc]"}`}
                >
                    <FileText size={16} />
                    Description
                </button>
                <button
                    onClick={() => onTabChange("submissions")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors text-sm font-medium whitespace-nowrap ${activeTab === "submissions" ? "bg-[#252526] text-white" : "text-[#858585] hover:bg-[#2a2d2e] hover:text-[#cccccc]"}`}
                >
                    <History size={16} />
                    Submissions
                </button>
                <button
                    onClick={() => onTabChange("leaderboard")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors text-sm font-medium whitespace-nowrap ${activeTab === "leaderboard" ? "bg-[#252526] text-white" : "text-[#858585] hover:bg-[#2a2d2e] hover:text-[#cccccc]"}`}
                >
                    <Trophy size={16} className={activeTab === "leaderboard" ? "text-yellow-400" : ""} />
                    Leaderboard
                </button>
            </div>

            {/* Tab Content Area */}
            <div className="flex-1 overflow-hidden p-6 relative">
                {/* ── DESCRIPTION TAB ── */}
                {activeTab === "description" && (
                    <SidebarDescription level={level} challenge={challenge} />
                )}

                {/* ── SUBMISSIONS TAB ── */}
                {activeTab === "submissions" && (
                    <SidebarSubmissions submission={submission} />
                )}

                {/* ── LEADERBOARD TAB ── */}
                {activeTab === "leaderboard" && (
                    <Leaderboard 
                        leaderboard={leaderboard} 
                        currentParticipantId={currentParticipantId} 
                        problems={problems}
                    />
                )}
            </div>
        </div>
    );
}