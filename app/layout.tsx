import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Lista de Compras",
  description: "Gerencie suas listas de compras de mercado",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-50 font-sans antialiased">
        <Providers>
          <header className="bg-white border-b border-gray-200 px-4 py-4">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900">🛒 Lista de Compras</h1>
            </div>
          </header>
          <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">{children}</main>
        </Providers>
        <Toaster richColors />
      </body>
    </html>
  );
}
