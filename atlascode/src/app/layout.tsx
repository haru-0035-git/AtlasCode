import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "next-themes";
import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AtlasCode",
  description: "Learn to code in your browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class">
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow w-full pt-4">
              {children}
            </main>
            <Footer />
          </div>
          <div className="fixed bottom-4 right-4 z-50">
            <ThemeSwitcher />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
