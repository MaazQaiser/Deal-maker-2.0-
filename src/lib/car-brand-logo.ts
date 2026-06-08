const CAR_BRAND_LOGOS: Record<string, string> = {
  BMW: "/brands/bmw.svg",
  Audi: "/brands/audi.svg",
  Volkswagen: "/brands/volkswagen.svg",
  "Mercedes-Benz": "/brands/mercedes-benz.svg",
  Ford: "/brands/ford.svg",
  Vauxhall: "/brands/vauxhall.svg",
};

export function getCarBrandLogo(make: string): string | undefined {
  return CAR_BRAND_LOGOS[make];
}
