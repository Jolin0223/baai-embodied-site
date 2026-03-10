import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "智源具身智能 | BAAI Embodied Intelligence",
  description: "开源开放的具身智能全栈解决方案 - 智源研究院以大脑为核心，构建了一套自下而上的全栈技术解决方案",
  keywords: "智源研究院, 具身智能, RoboBrain, RoboOS, 人工智能, AI, 机器人",
  icons: {
    icon: "https://www.baai.ac.cn/Upfile/File/2025-12-15/6e2b4602-1fef-48bb-921e-77f9a27ab87c..png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
