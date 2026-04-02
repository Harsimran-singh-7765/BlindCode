import type { Challenge } from "../data/questions";

interface SidebarDescriptionProps {
    level: number;
    challenge: Challenge;
}

export default function SidebarDescription({ level, challenge }: SidebarDescriptionProps) {
    return (
        <div className="flex flex-col gap-6 overflow-y-auto pb-4 custom-scrollbar h-full">
            <div>
                <h1 className="text-2xl font-bold text-white mb-4">
                    {level}. {challenge.title}
                </h1>
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                        challenge.difficulty === "easy" ? "bg-teal-500/20 text-teal-400" :
                        challenge.difficulty === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                    }`}>
                        {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                    </span>
                </div>
            </div>

            <div className="text-[#d4d4d4] text-base leading-relaxed whitespace-pre-wrap">
                {challenge.description}
            </div>

            {challenge.inputFormat && (
                <div className="mt-2">
                    <p className="font-bold text-white mb-2">Input Format:</p>
                    <div className="text-[#858585] text-sm leading-relaxed whitespace-pre-wrap">
                        {challenge.inputFormat}
                    </div>
                </div>
            )}

            {challenge.outputFormat && (
                <div className="mt-2">
                    <p className="font-bold text-white mb-2">Output Format:</p>
                    <div className="text-[#858585] text-sm leading-relaxed whitespace-pre-wrap">
                        {challenge.outputFormat}
                    </div>
                </div>
            )}

            <div className="mt-2">
                <p className="font-bold text-white mb-2">Constraints:</p>
                <ul className="list-disc list-inside text-[#858585] text-sm space-y-1">
                    {challenge.constraints ? (
                        <li className="whitespace-pre-wrap">{challenge.constraints}</li>
                    ) : (
                        <li>Time Limit: {challenge.timeLimit} seconds</li>
                    )}
                    <li>Vision Peeks allowed: Yes (with time penalty)</li>
                </ul>
            </div>

            {challenge.testCases.filter(tc => !tc.hidden).length > 0 && (
                <div className="mt-4">
                    <p className="font-bold text-white mb-3">Sample Test Cases:</p>
                    <div className="flex flex-col gap-3">
                        {challenge.testCases.filter(tc => !tc.hidden).map((tc, i) => (
                            <div key={i} className="bg-[#1a1a1a] border border-[#3c3c3c] rounded-xl p-4">
                                <div className="text-xs text-[#555] font-mono uppercase tracking-widest mb-2">
                                    Example {i + 1}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <div className="text-[#858585] text-xs mb-1 font-semibold">Input</div>
                                        <pre className="bg-[#0d0d0d] text-[#d4d4d4] text-xs font-mono px-3 py-2 rounded-lg border border-[#2a2a2a] whitespace-pre-wrap overflow-auto">
                                            {tc.input || '(empty)'}
                                        </pre>
                                    </div>
                                    <div>
                                        <div className="text-[#858585] text-xs mb-1 font-semibold">Expected Output</div>
                                        <pre className="bg-[#0d0d0d] text-[#4ec9b0] text-xs font-mono px-3 py-2 rounded-lg border border-[#2a2a2a] whitespace-pre-wrap overflow-auto">
                                            {tc.expected}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-[#555] text-xs mt-3 italic">
                        🔒 Additional hidden test cases will be run on submission.
                    </p>
                </div>
            )}
        </div>
    );
}
