import { useEffect } from "react";

export const Agent = () => {

    useEffect(() => {
        console.log("Agent mounted");
        window.addEventListener("message", (event) => {
        //   if (event.origin !== "https://app.vectorshift.ai") return; // secure check
          console.log("Form message:", event.data);
      
        //   if (event.data?.type === "vectorshift_result") {
            const generatedText = event.data.data;
            console.log("generatedText", generatedText);
            // 👉 Now save to your DB
            // saveToDB(generatedText);
        //   }
        });
      }, []);
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
                    src="https://app.vectorshift.ai/forms/embedded/68651aac1c44767b1795c64d" 
                    className="w-full h-[730px] border-0 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl"
                    allow="clipboard-read; clipboard-write; microphone"
                    title="AI Content Generator"
                />
            </div>
        </div>
    )
}