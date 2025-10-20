// src/app/(main)/dashboard/newcountrydashboard/_components/section-cards.tsx
"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PaywallGuard } from "@/components/app/PaywallGuard";

type Delta = number | null | undefined;

type Props = {
  uniqueProperties: number;
  avgOccupancy: number; // 0..1
  avgDailyPrice: number;
  latest?: { asOf: string; activeProperties: number; occupancyRate: number; avgPrice: number };

  // deltas (as fractions, e.g., +0.137 for +13.7%). Null/undefined hides the chip.
  deltaUnique?: Delta;
  deltaOccupancy?: Delta;
  deltaAvgPrice?: Delta;

  // Optional revenue card (if you later include it in the API)
  totalRevenue?: number;
  deltaRevenue?: Delta;
};

export function SectionCards({
  uniqueProperties,
  avgOccupancy,
  avgDailyPrice,
  latest,
  deltaUnique,
  deltaOccupancy,
  deltaAvgPrice,
  totalRevenue,
  deltaRevenue,
}: Props) {
  const fmtPct = (v: number, d = 1) => `${(v * 100).toFixed(d)}%`;
  const fmtDelta = (v: Delta, d = 1) => (v == null ? "" : `${(v * 100).toFixed(d)}%`);
  const fmtInt = (v: number) => Intl.NumberFormat().format(Math.round(v));
  const fmtCurrency = (v: number) =>
    Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(v);

  const DeltaBadge = ({ value }: { value: Delta }) => {
    if (value == null) return null;
    const up = value >= 0;
    return (
      <Badge variant="outline" className={up ? "text-emerald-700" : "text-rose-700"}>
        {up ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
        {fmtDelta(value)}
      </Badge>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
      {/* Unique Properties */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Unique Properties</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {fmtInt(uniqueProperties)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">{fmtInt(uniqueProperties)}</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {deltaUnique != null ? (
            <div className="line-clamp-1 flex gap-2 font-medium">
              {deltaUnique >= 0 ? "Trending up this period" : "Trending down this period"}
              {deltaUnique >= 0 ? (
                <TrendingUp className="size-4 text-emerald-600" />
              ) : (
                <TrendingDown className="size-4 text-rose-600" />
              )}
            </div>
          ) : (
            <div className="text-muted-foreground">As of {latest?.asOf ?? "-"}</div>
          )}
        </CardFooter>
      </Card>

      {/* Avg. Occupancy */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Avg. Occupancy</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {fmtPct(avgOccupancy)}
          </CardTitle>
          <CardAction>
            <DeltaBadge value={deltaOccupancy} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {deltaOccupancy != null ? (
            <div className="line-clamp-1 flex gap-2 font-medium">
              {deltaOccupancy >= 0 ? "Up" : "Down"} {fmtDelta(deltaOccupancy)} this period{" "}
              {deltaOccupancy >= 0 ? (
                <TrendingUp className="size-4 text-emerald-600" />
              ) : (
                <TrendingDown className="size-4 text-rose-600" />
              )}
            </div>
          ) : (
            <div className="text-muted-foreground">Period average</div>
          )}
        </CardFooter>
      </Card>

      {/* Avg. Daily Property Price */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Avg. Daily Property Price</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {fmtCurrency(avgDailyPrice)}
          </CardTitle>
          <CardAction>
            <DeltaBadge value={deltaAvgPrice} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {deltaAvgPrice != null ? (
            <div className="line-clamp-1 flex gap-2 font-medium">
              {deltaAvgPrice >= 0 ? "Strong trend" : "Softening trend"}{" "}
              {deltaAvgPrice >= 0 ? (
                <TrendingUp className="size-4 text-emerald-600" />
              ) : (
                <TrendingDown className="size-4 text-rose-600" />
              )}
            </div>
          ) : (
            <div className="text-muted-foreground">As of {latest?.asOf ?? "-"}</div>
          )}
        </CardFooter>
      </Card>

      {/* Optional: Total Revenue (behind paywall). Pass totalRevenue/ deltaRevenue to show; otherwise this card is omitted. */}
      {typeof totalRevenue === "number" && (
        <PaywallGuard fallback={<p className="text-sm text-muted-foreground">This feature requires a paid plan.</p>}>
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Total Revenue</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {fmtCurrency(totalRevenue)}
              </CardTitle>
              <CardAction>
                <DeltaBadge value={deltaRevenue} />
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              {deltaRevenue != null ? (
                <div className="line-clamp-1 flex gap-2 font-medium">
                  {deltaRevenue >= 0 ? "Steady performance increase" : "Performance decreased"}{" "}
                  {deltaRevenue >= 0 ? (
                    <TrendingUp className="size-4 text-emerald-600" />
                  ) : (
                    <TrendingDown className="size-4 text-rose-600" />
                  )}
                </div>
              ) : (
                <div className="text-muted-foreground">Period total</div>
              )}
            </CardFooter>
          </Card>
        </PaywallGuard>
      )}
    </div>
  );
}

