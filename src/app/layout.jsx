import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PurelyStore",
  description:
    "Curated skincare, makeup, and fragrance — a student demo storefront.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fafafa] text-gray-900">
        <Provider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#000000", // black background
                color: "#ffffff", // white text
                fontWeight: "bold",
                borderRadius: "12px",
              },
              duration: 3000, // default duration 3s
            }}
          />
          {children}
        </Provider>
      </body>
    </html>
  );
}
