
import type { Metadata } from "next";
import { Inter, Roboto_Slab } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Heading font - Bold, sturdy, construction-appropriate
const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fire Alarm System & Electrical Testing LTD | Expert Fire Safety & Electrical Services in London",
  description:
    "Fire Alarm System & Electrical Testing LTD offers professional fire alarm installation, electrical testing, inspection, and maintenance services across London. Reliable, certified engineers ensuring safety and compliance.",
  keywords: [
    "Fire Alarm System & Electrical Testing LTD",
    "Fire Alarm Installation London",
    "Electrical Testing London",
    "Fire Safety Services UK",
    "EICR London",
    "Emergency Lighting Installation",
    "PAT Testing",
    "Fire Alarm Maintenance",
    "Electrical Compliance London",
  ],
  authors: [{ name: "Fire Alarm System & Electrical Testing LTD", url: "https://fasandet.co.uk" }],
  creator: "Fire Alarm System & Electrical Testing LTD",
  publisher: "Fire Alarm System & Electrical Testing LTD",
  openGraph: {
    title: "Fire Alarm System & Electrical Testing LTD | Expert Fire Safety & Electrical Services in London",
    description:
      "Certified fire alarm installation, electrical testing, inspection, and maintenance services across London. Trusted engineers for safety and compliance.",
    url: "https://fasandet.co.uk",
    siteName: "Fire Alarm System & Electrical Testing LTD",
    type: "website",
  },
  
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
    noimageindex:false
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoSlab.variable} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
