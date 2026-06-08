export const brandConfig = {
  companyLogo: "/brand/oakwood-logo.png",
  productName: "Deal Builder",
  tagline: "Oakwood showroom finance tool",
  /** Figma node 2169:17071 — layout/spacing only; typography sizes are user-locked */
  figma: {
    frameWidth: 273.23,
    frameHeight: 30,
    logoWidth: 152.833,
    logoHeight: 26,
    gap: 7.385,
    dividerWidth: 0.923,
    dividerHeight: 14.769,
    textGap: 4,
    /** LOCKED — do not change: product name 16px, tagline 12px */
    productFontSize: 16,
    productLineHeight: 20,
    productLetterSpacing: 0.2954,
    productColor: "#42454e",
    taglineFontSize: 12,
    taglineLetterSpacing: 0.18,
    taglineColor: "#0095de",
    dividerColor: "#e2e8f0",
  },
} as const;
