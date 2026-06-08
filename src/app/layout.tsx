import type { Metadata } from "next";
import { Inter, Montserrat, Poppins } from "next/font/google";
import { Providers } from "@/components/common/providers";
import { appConfig } from "@/constants/navigation";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-logo-product",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-logo-tagline",
});

export const metadata: Metadata = {
  title: {
    default: appConfig.name,
    template: `%s | ${appConfig.name}`,
  },
  description: appConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${montserrat.variable} ${poppins.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
