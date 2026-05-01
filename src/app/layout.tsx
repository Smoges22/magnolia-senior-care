import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/lib/site-data";

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: "Magnolia Senior Care | Premium Adult Family Homes in South King County",
    template: "%s | Magnolia Senior Care"
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "Magnolia Senior Care",
    description: site.description,
    url: site.domain
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
