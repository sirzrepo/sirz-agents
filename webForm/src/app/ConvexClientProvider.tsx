// "use client";

// import { ConvexProvider, ConvexReactClient } from "convex/react";
// import { ReactNode, useEffect, useState } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import { ConvexAuthProvider } from "@convex-dev/auth/react";

// // Use direct URL if the environment variable is missing
// const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://agile-leopard-792.convex.cloud";

// // Create Convex client
// let convex: ConvexReactClient;
// try {
//   convex = new ConvexReactClient(CONVEX_URL);
// } catch (error) {
//   console.error("Error creating Convex client:", error);
//   // Fallback to a hardcoded URL if there's an error
//   convex = new ConvexReactClient("https://agile-leopard-792.convex.cloud");
// }

// // Set up token handling
// if (typeof window !== 'undefined') {
//   // Get token from localStorage if it exists
//   const token = localStorage.getItem('convex-auth-token');
//   if (token) {
//     // Set the token on the client
//     convex.setAuth(() => Promise.resolve(token));
//   }
// }

// export function ConvexClientProvider({ children }: { children: ReactNode }) {
//   const [isLoaded, setIsLoaded] = useState(false);
  
//   useEffect(() => {
//     // Debug log on client side
//     console.log("ConvexClientProvider mounted with URL:", CONVEX_URL);
    
//     // Handle authentication token
//     if (typeof window !== 'undefined') {
//       // Listen for storage events (for token changes)
//       const handleStorageChange = (event: StorageEvent) => {
//         if (event.key === 'convex-auth-token' && event.newValue) {
//           convex.setAuth(() => Promise.resolve(event.newValue));
//         }
//       };
      
//       window.addEventListener('storage', handleStorageChange);
      
//       // Check for token on mount
//       const token = localStorage.getItem('convex-auth-token');
//       if (token) {
//         convex.setAuth(() => Promise.resolve(token));
//       }
      
//       setIsLoaded(true);
      
//       return () => {
//         window.removeEventListener('storage', handleStorageChange);
//       };
//     } else {
//       setIsLoaded(true);
//     }
//   }, []);

//   if (!isLoaded && typeof window !== 'undefined') {
//     return <div>Loading Convex connection...</div>;
//   }

//   return (
//     <ConvexAuthProvider client={convex}>
//       {children}
//     </ConvexAuthProvider>
//   );
// }



"use client";
 
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
 
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
 
export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
}
