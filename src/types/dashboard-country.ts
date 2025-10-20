// Types for the New Country Dashboard page-data API bundle

export type CountryDashboardPageData = {
  filters: {
    start?: string;
    end?: string;
    country?: string;
    city?: string;
    propertyType?: string;
    minBedrooms?: number;
    maxBedrooms?: number;
  };
  kpis: {
    uniqueProperties: number;
    avgOccupancyRate: number; // 0..1
    avgDailyPrice: number;
    latestSnapshot: {
      asOf: string;
      activeProperties: number;
      occupancyRate: number; // 0..1
      avgPrice: number;
    };
    // Optional future extension:
    // totalRevenue?: number;
  };
  deltas: {
    uniqueProperties: { value: number; deltaPct: number | null };
    avgOccupancyRate: { value: number; deltaPct: number | null };
    avgDailyPrice: { value: number; deltaPct: number | null };
    // totalRevenue?: { value: number; deltaPct: number | null };
  };
  bookings: {
    granularity: "daily";
    series: Array<{ date: string; value: number }>;
    window: { start: string; end: string };
  };
  map: {
    asOf: string;
    markers: Array<DashboardMapMarker>;
  };
  meta: {
    generatedAt: string;
    generationTimeMs: number;
    dataVersion: string;
  };
};

// Shared with MapClient if you want strong typing there too
export type DashboardMapMarker = {
  propertyId: string;
  name: string;
  lat: number;
  lng: number;
  metrics: {
    occupancyRate: number;
    avgPrice: number;
    revenue: number;
    bedrooms: number;
    rooms: number;
    occupiedRooms: number;
    propertyType: string;
  };
};
