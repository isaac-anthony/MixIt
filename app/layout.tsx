import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mixit - Cocktail Generator",
  description: "Generate amazing cocktails from your ingredients",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // SVG Noise Pattern
  const noiseSvg = `data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        {/* Global Noise Texture Overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("${noiseSvg}")`,
            backgroundSize: '200px 200px',
          }}
        />
      </body>
    </html>
  );
}

