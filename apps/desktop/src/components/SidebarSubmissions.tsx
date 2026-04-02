import { History, CheckCircle2, XCircle, Trophy, Clock, Eye } from "lucide-react";

export interface SubmissionData {
    status: "idle" | "accepted" | "rejected" | "error";
    message: string;
    expected?: string;
    actual?: string;
    time?: number;
    score?: number;
    peeks?: number;
}

interface SidebarSubmissionsProps {
    submission: SubmissionData;
}

export default function SidebarSubmissions({ submission }: SidebarSubmissionsProps) {
    return (
        <div className="flex flex-col gap-4 overflow-y-auto pb-4 custom-scrollbar h-full">
            {submission.status === "idle" ? (
                <div className="text-center text-[#858585] mt-10">
                    <History size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No submissions yet for this challenge.</p>
                    <p className="text-sm mt-2">Run your code to test, then click Submit when ready.</p>
                </div>
            ) : (
                <div className={`p-6 rounded-xl border ${submission.status === "accepted" ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                    <div className="flex items-center gap-3 mb-4">
                        {submission.status === "accepted" ? (
                            <CheckCircle2 size={28} className="text-green-500" />
                        ) : (
                            <XCircle size={28} className="text-red-500" />
                        )}
                        <h2 className={`text-2xl font-bold ${submission.status === "accepted" ? "text-green-500" : "text-red-500"}`}>
                            {submission.status === "accepted" ? "Accepted" : "Wrong Answer"}
                        </h2>
                    </div>

                    <p className="text-[#d4d4d4] mb-6">{submission.message}</p>

                    {submission.status === "accepted" && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#1e1e1e] p-4 rounded-lg flex flex-col gap-1">
                                <span className="text-[#858585] text-xs uppercase flex items-center gap-2"><Trophy size={14} /> Score Earned</span>
                                <span className="text-yellow-400 font-bold text-xl">+{submission.score} pts</span>
                            </div>
                            <div className="bg-[#1e1e1e] p-4 rounded-lg flex flex-col gap-1">
                                <span className="text-[#858585] text-xs uppercase flex items-center gap-2"><Clock size={14} /> Time Taken</span>
                                <span className="text-white font-mono text-xl">{submission.time}s</span>
                            </div>
                            <div className="bg-[#1e1e1e] p-4 rounded-lg flex flex-col gap-1 col-span-2">
                                <span className="text-[#858585] text-xs uppercase flex items-center gap-2"><Eye size={14} /> Peeks Used</span>
                                <span className="text-white font-mono text-xl">{submission.peeks}</span>
                            </div>
                        </div>
                    )}

                    {submission.status === "rejected" && (
                        <div className="flex flex-col gap-4 mt-4">
                            <div>
                                <span className="text-red-400 text-sm font-bold">Output:</span>
                                <div className="bg-red-950/30 text-red-200 p-3 rounded mt-1 font-mono text-sm border border-red-500/20">
                                    {submission.actual || "Empty string"}
                                </div>
                            </div>
                            <div>
                                <span className="text-green-400 text-sm font-bold">Expected:</span>
                                <div className="bg-green-950/30 text-green-200 p-3 rounded mt-1 font-mono text-sm border border-green-500/20">
                                    {submission.expected}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
