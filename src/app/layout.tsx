import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/layouts/QueryProvider";
import { ToastContainer } from "react-toastify";
import ProgressProvider from "@/components/layouts/ProgressBar";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-roboto",
});
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
    <html lang="en" className={roboto.className}>
      <body className="antialiased" id="dee">
        <ProgressProvider>
          <ToastContainer />
          <QueryProvider>{children}</QueryProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}
