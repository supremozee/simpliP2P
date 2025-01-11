import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/layouts/QueryProvider";
import { ToastContainer } from "react-toastify";
export const metadata: Metadata = {
  title: "SimpliP2P",
  description: "A procurement system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <html lang="en">
         <body className="antialiased">
          <ToastContainer/>
            <QueryProvider>
              {children}
            </QueryProvider>
      </body>
        </html>
  );
}
