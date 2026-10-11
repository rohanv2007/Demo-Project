import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FixMyCampus — See it. Report it. Get it fixed.",
    template: "%s · FixMyCampus",
  },
  description:
    "A public fix-list for campus. Report what's broken, rally upvotes from fellow students, and watch issues move from reported to fixed — out in the open.",
  openGraph: {
    title: "FixMyCampus — See it. Report it. Get it fixed.",
    description:
      "A public fix-list for campus. Report what's broken, rally upvotes, and watch it get fixed.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FixMyCampus — See it. Report it. Get it fixed.",
    description:
      "A public fix-list for campus. Report what's broken, rally upvotes, and watch it get fixed.",
  },
};

export const viewport = {
  themeColor: "#f6f1e5",
};

export default function RootLayout(props: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${grotesk.variable}`}>
      <body className="min-h-screen flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[3px] focus:bg-ink focus:px-4 focus:py-2 focus:text-[13px] focus:font-semibold focus:text-cream"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1">{props.children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
