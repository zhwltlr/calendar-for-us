import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "일정 관리 시스템",
  description: "휴일 정보를 포함한 일정 관리 시스템",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  );
}
