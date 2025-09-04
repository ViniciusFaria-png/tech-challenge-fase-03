import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Posts Teachers FIAP",
  description: "Discover inspiring stories, creative lessons, and educational insights from teachers around the world.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
