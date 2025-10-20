import { secure } from "@/lib/api/handler";

export const GET = secure(async () => {
  const data = {
    asOf: "2025-09-30",
    markers: [
      {
        propertyId: "P123",
        name: "Peachtree House",
        lat: 33.7489,
        lng: -84.39,
        metrics: {
          occupancyRate: 0.86,
          avgPrice: 45.5,
          revenue: 12500.7,
          bedrooms: 7,
          rooms: 12,
          occupiedRooms: 10,
          propertyType: "co-living",
        },
      },
      {
        propertyId: "P987",
        name: "Downtown Pods",
        lat: 33.76,
        lng: -84.4,
        metrics: {
          occupancyRate: 0.75,
          avgPrice: 39.2,
          revenue: 8800.0,
          bedrooms: 10,
          rooms: 20,
          occupiedRooms: 15,
          propertyType: "co-living",
        },
      },
    ],
  };
  return Response.json(data);
});