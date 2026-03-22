'use client';

import { Inter, JetBrains_Mono } from "next/font/google";
import { StorageProvider } from '@/contexts/StorageContext';
import "./globals.css";

// Clean sans-serif for all text (Notion-style)
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Monospace for code
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <title>Rednote Post - 小红书卡片生成器</title>
        <meta name="description" content="将 Markdown 内容转换为精美的小红书风格卡片" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <StorageProvider>
          {children}
        </StorageProvider>
      </body>
    </html>
  );
}
