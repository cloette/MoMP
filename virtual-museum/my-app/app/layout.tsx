import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Museum of Magical Phenomena",
  description: "A virtual museum of magical phenomena — explore interactive 3D galleries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <meta property="og:title" content="The Museum of Magical Phenomena" />
      <meta property="og:description" content="Where the ordinary world is revealed to be extraordinary." />
      <meta property="og:image" content="MoMPwhite.png" />
      <meta property="og:image:width" content="1522" />
      <meta property="og:image:height" content="637" />
      <meta property="og:image:type" content="image/png" />
      <meta name="robots" content="index, follow"></meta>
      <meta name="viewport" content="width=device-width, initial-scale=1"></meta>

      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
