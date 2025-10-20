import { fetchNewCountryDashboardPageData } from "@/lib/api/newcountrydashboard";
import { SectionCards } from "./_components/section-cards";
import { ChartAreaInteractive } from "./_components/chart-area-interactive";
import { DataTable } from "./_components/data-table";
import MapClient from "../_components/mapClient";
import tableData from "./_components/data.json";
import type { CountryDashboardPageData } from "@/types/dashboard-country";
import { Suspense } from "react";

export default async function Page() {
  // TODO: wire real filters from your global state/UI (query params or store)
  const data: CountryDashboardPageData = await fetchNewCountryDashboardPageData({
    // start, end, country, city, propertyType, minBedrooms, maxBedrooms
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-17">
      <div className="lg:col-span-12 flex flex-col gap-4">
        {/* KPIs */}
        <SectionCards
          uniqueProperties={data.kpis.uniqueProperties}
          avgOccupancy={data.kpis.avgOccupancyRate}
          avgDailyPrice={data.kpis.avgDailyPrice}
          latest={data.kpis.latestSnapshot}
          deltaUnique={data.deltas.uniqueProperties.deltaPct}
          deltaOccupancy={data.deltas.avgOccupancyRate.deltaPct}
          deltaAvgPrice={data.deltas.avgDailyPrice.deltaPct}
        />

        {/* Chart */}
        <Suspense fallback={<div className="h-64 rounded-lg bg-muted animate-pulse" />}>
          <ChartAreaInteractive />
        </Suspense>

        {/* Table — if your table currently needs rows, use map markers or extend API later.
            Here we'll convert markers to a light table row shape. */}
        <DataTable data={tableData} />
      </div>

      {/* Map */}
      <div className="lg:col-span-5">
        <div className="sticky top-4 h-[80vh] rounded-lg shadow-md p-1">
          <MapClient />
        </div>
      </div>
    </div>
  );
}
