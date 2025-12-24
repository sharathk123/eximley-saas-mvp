import { WorkflowProvider } from "@/context/WorkflowContext";
import { Shell } from "@/components/layout/Shell";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import React from "react";

export const metadata = {
  title: "Eximley - Enterprise Export Management",
  description: "Next-gen EXIM workflow automation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased bg-slate-50" suppressHydrationWarning>
          <WorkflowProvider>
            <Shell>{children}</Shell>
          </WorkflowProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
