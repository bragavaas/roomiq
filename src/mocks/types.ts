export type PropertyType = "co-living" | "apartment" | "house";

export type PropertyRecord = {
  propertyId: string;
  name: string;
  country: "US" | "CA" | "BR";
  state?: string;
  city: string;
  lat: number;
  lng: number;
  propertyType: PropertyType;
  bedrooms: number;
  rooms: number;
  description?: string;
  amenities?: string[];
};

export type DailyMetric = {
  date: string;            // YYYY-MM-DD
  propertyId: string;
  occupancyRate: number;   // 0..1
  avgRate: number;         // daily price (currency-agnostic)
  revenue: number;         // occupancy * rooms * avgRate (approx)
  rooms: number;           // available rooms
  occupiedRooms: number;   // integer
};

export type TrendPoint = { date: string; value: number };
export type BucketCount = { bucket: string; properties: number };
export type TypeCount = { type: PropertyType; count: number };
export type BedroomsCount = { bedrooms: number; properties: number };
