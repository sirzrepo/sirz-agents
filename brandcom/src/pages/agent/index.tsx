import { useEffect } from "react";

export const Agent = () => {

    useEffect(() => {
        window.addEventListener("message", (event) => {
            if (event.origin === "https://app.vectorshift.ai") {
              console.log("Form message:", event.data);
            }
          });
    }, []);
    
    return (
        <div id="agent-section" className="w-full h-full flex flex-col items-center py-16 px-4 space-y-8">
            <div className="w-full max-w-5xl">
                <iframe 
                    src="https://app.vectorshift.ai/forms/embedded/686587631c44767b17a48cd2" 
                    className="w-full h-[730px] border-0 rounded-xl transition-all duration-300 "
                    allow="clipboard-read; clipboard-write; microphone"
                    title="AI Content Generator"
                />
            </div>
        </div>
    )
}