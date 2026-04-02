import {
    History,
    CheckCircle2,
    XCircle,
    Clock,
    Trophy,
    Eye,
    AlertTriangle
} from "lucide-react";

export interface TestResult {
    input: string;
    expected: string;
    actual: string;
    status: "passed" | "failed" | "error";
    hidden: boolean;
}

export interface SubmissionData {
    status: "idle" | "accepted" | "rejected" | "error";
    message: string;
    time?: number;
    score?: number;
    peeks?: number;
    testResults?: TestResult[];
    passedCount?: number;
    totalCount?: number;
}

interface SidebarSubmissionsProps {
    submission: SubmissionData;
}

function StatusBadge({
    status,
    actual
}: {
    status: TestResult["status"];
    actual: string;
}) {
    const isTLE = actual?.startsWith("TIME LIMIT EXCEEDED");
    const isMLE = actual?.startsWith("MEMORY LIMIT EXCEEDED");

    if (status === "passed") {
        return (
            <span className="flex items-center gap-1 text-xs font-bold text-green-400">
                <CheckCircle2 size={13} /> Passed
            </span>
        );
    }
    if (isTLE) {
        return (
            <span className="flex items-center gap-1 text-xs font-bold text-orange-400">
                <Clock size={13} /> TLE
            </span>
        );
    }
    if (isMLE) {
        return (
            <span className="flex items-center gap-1 text-xs font-bold text-purple-400">
                <AlertTriangle size={13} /> MLE
            </span>
        );
    }
    if (status === "error") {
        return (
            <span className="flex items-center gap-1 text-xs font-bold text-red-500">
                <AlertTriangle size={13} /> Error
            </span>
        );
    }
    return (
        <span className="flex items-center gap-1 text-xs font-bold text-red-400">
            <XCircle size={13} /> Wrong
        </span>
    );
}

export default function SidebarSubmissions({
    submission
}: SidebarSubmissionsProps) {
    const visibleFailed =
        submission.testResults?.filter(
            (r) => !r.hidden && r.status !== "passed"
        ) ?? [];

    const hiddenOnlyFailed =
        (submission.testResults?.length ?? 0) > 0 &&
        visibleFailed.length === 0 &&
        submission.status === "rejected";

    return (
        <div className="flex flex-col gap-4 overflow-y-auto pb-4 custom-scrollbar h-full">
            {submission.status === "idle" ? (
                <div className="text-center text-[#858585] mt-10">
                    <History
                        size={48}
                        className="mx-auto mb-4 opacity-20"
                    />
                    <p>No submissions yet for this challenge.</p>
                    <p className="text-sm mt-2">
                        Run your code to test, then click Submit when ready.
                    </p>
                </div>
            ) : (
                <div
                    className={`p-6 rounded-xl border ${submission.status === "accepted"
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-red-500/10 border-red-500/30"
                        }`}
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-2">
                        {submission.status === "accepted" ? (
                            <CheckCircle2
                                size={28}
                                className="text-green-500"
                            />
                        ) : (
                            <XCircle
                                size={28}
                                className="text-red-500"
                            />
                        )}
                        <h2
                            className={`text-2xl font-bold ${submission.status === "accepted"
                                ? "text-green-500"
                                : "text-red-500"
                                }`}
                        >
                            {submission.status === "accepted"
                                ? "Accepted"
                                : "Wrong Answer"}
                        </h2>
                    </div>

                    {/* Test summary */}
                    {typeof submission.passedCount === "number" &&
                        typeof submission.totalCount === "number" && (
                            <p className="text-[#858585] text-sm mb-4">
                                {submission.passedCount}/
                                {submission.totalCount} test cases passed
                            </p>
                        )}

                    {/* Message */}
                    <p className="text-[#d4d4d4] mb-6">
                        {submission.message}
                    </p>

                    {/* Accepted stats */}
                    {submission.status === "accepted" && (
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-[#1e1e1e] p-4 rounded-lg flex flex-col gap-1">
                                <span className="text-[#858585] text-xs uppercase flex items-center gap-2">
                                    <Trophy size={14} /> Score Earned
                                </span>
                                <span className="text-yellow-400 font-bold text-xl">
                                    +{submission.score} pts
                                </span>
                            </div>

                            <div className="bg-[#1e1e1e] p-4 rounded-lg flex flex-col gap-1">
                                <span className="text-[#858585] text-xs uppercase flex items-center gap-2">
                                    <Clock size={14} /> Time Taken
                                </span>
                                <span className="text-white font-mono text-xl">
                                    {submission.time}s
                                </span>
                            </div>

                            <div className="bg-[#1e1e1e] p-4 rounded-lg flex flex-col gap-1 col-span-2">
                                <span className="text-[#858585] text-xs uppercase flex items-center gap-2">
                                    <Eye size={14} /> Peeks Used
                                </span>
                                <span className="text-white font-mono text-xl">
                                    {submission.peeks}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Hidden-only failure */}
                    {hiddenOnlyFailed && (
                        <div className="bg-[#1a1a1a] border border-[#444] rounded-lg p-4 text-center text-[#858585] text-sm">
                            🔒 Sample cases passed, but hidden test cases failed.
                            <br />
                            <span className="text-white font-mono">
                                {submission.passedCount}/
                                {submission.totalCount}
                            </span>{" "}
                            test cases passed.
                        </div>
                    )}

                    {/* Visible failed cases */}
                    {visibleFailed.length > 0 && (
                        <div className="flex flex-col gap-3">
                            <p className="text-red-400 text-sm font-bold">
                                Failed Sample Cases:
                            </p>

                            {visibleFailed.map((r, i) => (
                                <div
                                    key={i}
                                    className="bg-[#1a1a1a] border border-red-500/20 rounded-lg p-4 flex flex-col gap-3"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-[#555] font-mono uppercase tracking-widest">
                                            Case {i + 1}
                                        </span>
                                        <StatusBadge
                                            status={r.status}
                                            actual={r.actual}
                                        />
                                    </div>

                                    {!r.actual?.startsWith("TIME LIMIT") &&
                                        !r.actual?.startsWith("MEMORY LIMIT") && (
                                            <>
                                                <div>
                                                    <div className="text-[#858585] text-xs mb-1 font-semibold">
                                                        Input
                                                    </div>
                                                    <pre className="bg-[#0d0d0d] text-[#d4d4d4] text-xs font-mono px-3 py-2 rounded border border-[#2a2a2a] whitespace-pre-wrap overflow-y-auto max-h-20">
                                                        {r.input || "(empty)"}
                                                    </pre>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <div className="text-green-400 text-xs mb-1 font-semibold">
                                                            Expected
                                                        </div>
                                                        <pre className="bg-[#0d0d0d] text-green-300 text-xs font-mono px-3 py-2 rounded border border-green-900/40 whitespace-pre-wrap overflow-y-auto max-h-24">
                                                            {r.expected}
                                                        </pre>
                                                    </div>

                                                    <div>
                                                        <div className="text-red-400 text-xs mb-1 font-semibold">
                                                            Got
                                                        </div>
                                                        <pre className="bg-[#0d0d0d] text-red-300 text-xs font-mono px-3 py-2 rounded border border-red-900/40 whitespace-pre-wrap overflow-y-auto max-h-24">
                                                            {r.actual}
                                                        </pre>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                    {(r.actual?.startsWith("TIME LIMIT") ||
                                        r.actual?.startsWith("MEMORY LIMIT")) && (
                                            <div className="text-orange-300 text-xs font-mono bg-orange-950/30 border border-orange-500/20 px-3 py-2 rounded">
                                                {r.actual}
                                            </div>
                                        )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}