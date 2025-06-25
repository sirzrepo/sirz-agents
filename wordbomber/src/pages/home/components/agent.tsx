export const Agent = () => {
    return (
        <div id="agent-section" className="w-full h-full flex flex-col items-center py-16 px-4 space-y-8">
            <div className="text-center sm:w-[60%] w-[95%] mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold bg-black bg-clip-text text-transparent mb-4">
                Try It Now — Discover High‑Intent Keywords Instantly
                </h2>
                <p className="text-lg text-gray-900 sm:w-[70%] w-[95%] mx-auto mb-6">
                Enter a keyword or topic, and our AI will find the best high‑intent searches your ideal customers are looking for.
                </p>
            </div>
            <div className="w-full max-w-5xl">
                <iframe 
                    src="https://app.vectorshift.ai/forms/embedded/685527bbc06fbab08c1bb40a" 
                    className="w-full h-[890px] border-0 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl"
                    allow="clipboard-read; clipboard-write; microphone"
                    title="AI Content Generator"
                />
            </div>
        </div>
    )
}