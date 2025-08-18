
'use client';

import { usePathname } from "next/navigation";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "@/contexts/CartContext";
import { UserProvider } from "@/contexts/UserContext";
import { BranchProvider } from "@/contexts/BranchContext";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ReduxProvider } from "@/providers/ReduxProvider";
import NavbarWrapper from "@/components/NavbarWrapper";
import MobileFooterWrapper from "@/components/layouts/footer/MobileFooterWrapper";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import PwaInstallPrompt from "@/services/pwaInstallPrompts";
import Footer from "@/components/layouts/footer";

// We'll use the built-in Convex authentication system instead of a custom implementation

// Use a local font stack instead
const fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';


function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMessagesPage = pathname === '/messages';
  
  return (
    <div className={``}>
      <div className="top-0 right-0 w-1/2 h-full" />
      {children}
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#E1972F" />
        <link rel="apple-touch-icon" href="/logo-v2.svg.webp" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title> Sirz Client Questionnaire</title>
        <link rel="icon" type="image/png" href="/logo-v2.svg.webp" />
      </head>
      <body 
      // className={fontFamily}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            <ConvexClientProvider>
              <AuthProvider>
                <UserProvider>
                  <BranchProvider>
                    <CartProvider>
                      <ProtectedRoute>
                        <LayoutContent>
                          {children}
                        </LayoutContent>
                        <ToastContainer />
                      </ProtectedRoute>
                    </CartProvider>
                  </BranchProvider>
                </UserProvider>
              </AuthProvider>
            </ConvexClientProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
