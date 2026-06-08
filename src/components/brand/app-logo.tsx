"use client";

import Link from "next/link";
import { brandConfig } from "@/constants/brand";
import { routes } from "@/constants/routes";
import { cn } from "@/lib/cn";

type AppLogoProps = {
  className?: string;
};

/** User-locked logo typography — do not change or sync from Figma */
const LOGO_PRODUCT_FONT_SIZE = 16;
const LOGO_TAGLINE_FONT_SIZE = 12;
const LOGO_PRODUCT_LINE_HEIGHT = 20;

export function AppLogo({ className }: AppLogoProps) {
  const { figma } = brandConfig;

  return (
    <Link
      href={routes.dashboard}
      className={cn("inline-flex shrink-0 items-center", className)}
      style={{
        gap: figma.gap,
        height: figma.frameHeight,
        maxWidth: figma.frameWidth,
      }}
      aria-label={`${brandConfig.productName} home`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={brandConfig.companyLogo}
        alt="Oakwood Motor Company"
        width={524}
        height={96}
        className="pointer-events-none shrink-0 object-cover object-left"
        style={{
          width: figma.logoWidth,
          height: figma.logoHeight,
        }}
        decoding="async"
      />

      <span
        className="shrink-0 self-center"
        style={{
          width: figma.dividerWidth,
          height: figma.dividerHeight,
          backgroundColor: figma.dividerColor,
        }}
        aria-hidden="true"
      />

      <span
        className="flex shrink-0 flex-col justify-center self-stretch"
        style={{ gap: figma.textGap }}
      >
        <span
          className="whitespace-nowrap font-medium"
          style={{
            fontFamily: "var(--font-logo-product), Montserrat, sans-serif",
            fontSize: LOGO_PRODUCT_FONT_SIZE,
            lineHeight: `${LOGO_PRODUCT_LINE_HEIGHT}px`,
            letterSpacing: figma.productLetterSpacing,
            color: figma.productColor,
          }}
        >
          {brandConfig.productName}
        </span>
        <span
          className="whitespace-nowrap"
          style={{
            fontFamily: "var(--font-logo-tagline), Poppins, sans-serif",
            fontSize: LOGO_TAGLINE_FONT_SIZE,
            lineHeight: "normal",
            letterSpacing: figma.taglineLetterSpacing,
            color: figma.taglineColor,
          }}
        >
          {brandConfig.tagline}
        </span>
      </span>
    </Link>
  );
}
