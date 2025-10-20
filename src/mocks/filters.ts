import { PROPERTIES } from "./data.properties";

export function listCountries() {
  const set = new Map<string, string>();
  PROPERTIES.forEach((p) => {
    const label = p.country === "US" ? "United States" : p.country === "CA" ? "Canada" : "Brazil";
    set.set(p.country, label);
  });
  return [...set.entries()].map(([country_code, country]) => ({ country, country_code }));
}

export function listCities(country?: string) {
  const rows = PROPERTIES.filter((p) => (!country ? true : p.country === country));
  const uniq = new Map<string, { city: string; city_slug: string; state?: string }>();
  rows.forEach((p) => {
    const slug = p.city.toLowerCase().replace(/\s+/g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    uniq.set(`${p.city}-${p.state ?? ""}`, { city: p.city, city_slug: slug, state: p.state });
  });
  return [...uniq.values()];
}

export function listPropertyTypes() {
  const types = Array.from(new Set(PROPERTIES.map((p) => p.propertyType)));
  return types.map((type) => ({ type }));
}

export function listBedrooms() {
  const b = PROPERTIES.map((p) => p.bedrooms);
  const min = Math.min(...b);
  const max = Math.max(...b);
  return { min, max, buckets: [1, 2, 3, 4, 5, "6+"] as const };
}