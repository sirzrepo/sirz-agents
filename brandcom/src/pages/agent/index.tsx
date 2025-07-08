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





// import React, { useState } from "react";

// export default function KeywordForm() {
//   const [keyword, setKeyword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setResult(null);

//     try {
//       const response = await fetch(
//         "https://api.vectorshift.ai/v1/pipeline/68551daec06fbab08c1b022b/run",
//         {
//           method: "POST",
//           headers: {
//             Authorization: "Bearer sk_grL4WdZWc6rutQFZFmXBebfL667FrCcgxWK6EosFcoBx052F",
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             inputs: {
//               input_0: keyword,
//               input_1: "",
//               input_2: "",
//               input_3: "",
//             },
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`API request failed: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("VectorShift response:", data);
//       setResult(data.outputs);
//     } catch (err) {
//       console.error("Error:", err);
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
//       <h2 className="text-2xl font-bold mb-4">Keyword Bomber</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="keyword" className="block font-medium mb-1">
//             Enter a Keyword:
//           </label>
//           <input
//             type="text"
//             id="keyword"
//             value={keyword}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
//             required
//             className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
//             placeholder="e.g. rekobo"
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
//         >
//           {loading ? "Generating..." : "Submit"}
//         </button>
//       </form>

//       {error && <p className="text-red-600 mt-4">{error}</p>}

//       {result && (
//         <div className="mt-6">
//           <h3 className="text-lg font-semibold mb-2">Generated Output:</h3>
//           <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
//             {JSON.stringify(result, null, 2)}
//           </pre>
//         </div>
//       )}
//     </div>
//   );
// }
