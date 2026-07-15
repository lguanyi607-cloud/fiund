import type { Metadata, Viewport } from "next";
import "./globals.css";
import TabBar from "@/components/TabBar";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Fiund - 校园物品流转平台",
  description: "校园二手交易与失物招领一站式平台",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <AuthProvider>
          <main className="pb-20 min-h-screen">{children}</main>
          <TabBar />
        </AuthProvider>
      </body>
    </html>
  );
}
