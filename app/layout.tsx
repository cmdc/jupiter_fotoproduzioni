import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode, FC } from "react";
import Menu from "@/components/ui/menu";
import { Particles } from "@/components/particles";
import { Providers } from "@/lib/providers";
import GoogleAnalytics from "./GoogleAnalytics";
import Link from "next/link";
import { CookieConsentBanner } from "@/components/ui/cookie-consent-banner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "Jupiter Foto | %s ",
    default: "Jupiter Foto",
  },
  description: "A website by Ashwin Manghat",
};

interface RootLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}
const RootLayout: FC<RootLayoutProps> = ({ children, modal }) => {
  const year = new Date().getFullYear();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Menu />
          <Particles className="absolute inset-0 -z-10" />
          {children}

          <div className="text-center bottom-3 text-xs md:text-normal left-0 opacity-60 right-0 m-auto w-5/6 md:w-1/2  scroll-m-20 p-5 pt-10 text-md  tracking-tight transition-colors first:mt-0 select-none flex flex-col items-center lg:justify-center">
            <Link
              className="flex items-center gap-1 text-current text-sm"
              href="http://cmdc.it"
              title="CMDC homepage"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-default-600">powered by</span>
              <p className="text-[#74feff] dark:animate-pulse text-center font-semibold">
                cmdc
              </p>
            </Link>
            <span className="mt-2 text-sm text-center text-default-600">
              {`© ${year} copyright`}
            </span>
          </div>
          <CookieConsentBanner />
        </Providers>
        <GoogleAnalytics />
      </body>
      {/* {modal} */}
    </html>
  );
};

export default RootLayout;
