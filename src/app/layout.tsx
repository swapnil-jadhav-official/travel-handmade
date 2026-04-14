import type { Metadata } from "next";
import { Geist, Geist_Mono, Unbounded, Roboto_Flex, Work_Sans, Dancing_Script } from "next/font/google";
import localFont from "next/font/local";
import { RootProvider } from "@/components/RootProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
});

const robotoFlex = Roboto_Flex({
  variable: "--font-roboto-flex",
  subsets: ["latin"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
});

const floresttaOpheralio = localFont({
  src: "../../public/fonnts.com-482677/fonts/fonnts.com-FloresttaOpheralio-vm1K4.otf",
  variable: "--font-florestta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Travel Handmade | Conscious Travel & Wellness",
  description: "Inspiring stories of conscious travel, adventure, wellness, and authentic living around the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${unbounded.variable} ${robotoFlex.variable} ${workSans.variable} ${dancingScript.variable} ${floresttaOpheralio.variable} antialiased`}
      >
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
