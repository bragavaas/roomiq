import { ChartAreaInteractive } from "./_components/chart-area-interactive";
import { DataTable } from "./_components/data-table";
import data from "./_components/data.json";
import { SectionCards } from "./_components/section-cards";

import MapClient from "../_components/mapClient"; // adjust path if needed


export default function Page() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-17">
        <div className="lg:col-span-12 flex flex-col gap-4">
          <SectionCards />
          <ChartAreaInteractive />
          <DataTable data={data} />
        </div>
        <div className="lg:col-span-5">
          <div className="sticky top-4 h-[80vh] rounded-lg shadow-md p-1">
            <MapClient />
          </div>
        </div>
    </div>
  );
}
