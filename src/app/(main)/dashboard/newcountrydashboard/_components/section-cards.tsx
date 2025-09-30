import { TrendingUp, TrendingDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Map from "@/components/map";

export function SectionCards() {
  return (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Unique Properties</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">4,505</CardTitle>
        <CardAction>
          <Badge variant="outline">4,505</Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Trending up this month <TrendingUp className="size-4" />
        </div>
      </CardFooter>
    </Card>

    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Avg. Occupancy</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">87.3%</CardTitle>
        <CardAction>
          <Badge variant="outline">
            <TrendingUp /> +13.7%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Up 13.7% this period <TrendingUp className="size-4" />
        </div>
      </CardFooter>
    </Card>

    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Avg. Daily Property Price</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">$30.47</CardTitle>
        <CardAction>
          <Badge variant="outline">
            <TrendingUp /> +3.5%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Strong trend <TrendingUp className="size-4" />
        </div>
        <div className="text-muted-foreground">Bookings exceed targets</div>
      </CardFooter>
    </Card>

    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Total Revenue</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">$46,754,891.08</CardTitle>
        <CardAction>
          <Badge variant="outline">
            <TrendingUp /> +4.5%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Steady performance increase <TrendingUp className="size-4" />
        </div>
        <div className="text-muted-foreground">Meets growth projections</div>
      </CardFooter>
    </Card>
  </div>
  );
}
