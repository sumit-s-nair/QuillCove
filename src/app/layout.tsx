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
  title: "QuillCove - Your Personal Note Keeper",
  description: "QuillCove helps you keep your notes organized and accessible.",
  keywords: "notes, organization, productivity, QuillCove",
  authors: [{ name: "QuillCove Team" }],
  viewport: "width=device-width, initial-scale=1.0",
  robots: "index, follow",
  openGraph: {
    title: "QuillCove - Your Personal Note Keeper",
    description: "QuillCove helps you keep your notes organized and accessible.",
    url: "https://quill-cove.vercel.app/",
    type: "website",
    images: [
      {
        url: "https://quill-cove.vercel.app/logo.png",
        width: 1200,
        height: 630,
        alt: "QuillCove",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@quillcove",
    title: "QuillCove - Your Personal Note Keeper",
    description: "QuillCove helps you keep your notes organized and accessible.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="QuillCove helps you keep your notes organized and accessible." />
        <meta name="keywords" content="notes, organization, productivity, QuillCove" />
        <meta name="author" content="QuillCove Team" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="QuillCove - Your Personal Note Keeper" />
        <meta property="og:description" content="QuillCove helps you keep your notes organized and accessible." />
        <meta property="og:url" content="https://quill-cove.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://quill-cove.vercel.app/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="QuillCove" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@quillcove" />
        <meta name="twitter:title" content="QuillCove - Your Personal Note Keeper" />
        <meta name="twitter:description" content="QuillCove helps you keep your notes organized and accessible." />
        <meta name="twitter:image" content="https://quill-cove.vercel.app/logo.png" />
        <title>QuillCove - Your Personal Note Keeper</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
