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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
