import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"], // Regular, Medium, Semi-bold
  variable: "--font-sans", // Maps directly to Tailwind's font-sans
});

export const metadata: Metadata = {
  title: "BillFlow",
  description: "Invoice and Client Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", plusJakarta.variable)}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}