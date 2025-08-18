import type { Metadata } from "next";
import RootLayout from "./layout";

export const metadata: Metadata = {
  title: "Uncle Reuben grills - Order Food Online",
  description: "Order delicious food from Uncle Reuben grills online",
  viewport: "width=device-width, initial-scale=1",
  themeColor: '#E1972F',
};

export default function ServerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootLayout>{children}</RootLayout>;
}
