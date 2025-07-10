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
        <div id="agent-section" className="w-full h-full flex flex-col items-center space-y-8">
            <div className="w-full max-w-5xl">
                <iframe 
                    src="https://app.vectorshift.ai/forms/embedded/68651aac1c44767b1795c64d" 
                    className="w-full h-[700px] border-0 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl"
                    allow="clipboard-read; clipboard-write; microphone"
                    title="AI Content Generator"
                />
            </div>
        </div>
    )
}