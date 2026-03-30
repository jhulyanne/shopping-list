import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Lista de Compras",
  description: "Gerencie suas listas de compras de mercado",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-50 font-sans antialiased">
        <Providers>
          <header className="bg-white border-b border-gray-200 px-4 py-4">
            <div className="max-w-2xl mx-auto">
              <Link href="/">
                <h1 className="text-2xl font-bold text-gray-900 hover:text-gray-600 transition-colors">🛒 Lista de Compras</h1>
              </Link>
            </div>
          </header>
          <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">{children}</main>
        </Providers>
        <Toaster richColors />
      </body>
    </html>
  );
}
