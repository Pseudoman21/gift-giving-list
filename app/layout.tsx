import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Christmas Gift List | Track Your Holiday Giving",
  description: "Organize your Christmas gift giving with ease. Track who gets money, gifts, and manage your holiday budget all in one place.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Christmas Gift List | Track Your Holiday Giving",
    description: "Organize your Christmas gift giving with ease. Track who gets money, gifts, and manage your holiday budget all in one place.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Christmas Gift List App",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Christmas Gift List | Track Your Holiday Giving",
    description: "Organize your Christmas gift giving with ease. Track who gets money, gifts, and manage your holiday budget all in one place.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100`}
      >
        {children}
        <footer className="py-8 mt-12">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <p className="text-sm md:text-base text-gray-600">
              Made with love by{' '}
              <a
                href="https://github.com/Pseudoman21/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-gray-900 hover:text-green-600 transition-colors underline decoration-dotted underline-offset-4"
              >
                Pseudoman21
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
