import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "WB2026 Form | Premium Data Collection",
  description: "A secure and aesthetic form for WB2026 data collection.",
};

import { FormProvider } from "@/context/FormContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <FormProvider>
          {children}
        </FormProvider>
      </body>
    </html>
  );
}
