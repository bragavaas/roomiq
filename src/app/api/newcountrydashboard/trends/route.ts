import { secure } from "@/lib/api/handler";

export const GET = secure(async () => {
  const data = {
    weekly: {
      occupancyRate: [
        { week: "2025-W30", value: 0.78 },
        { week: "2025-W31", value: 0.79 },
        { week: "2025-W32", value: 0.80 },
        { week: "2025-W33", value: 0.81 },
      ],
      avgRate: [
        { week: "2025-W30", value: 41.2 },
        { week: "2025-W31", value: 41.8 },
        { week: "2025-W32", value: 42.4 },
        { week: "2025-W33", value: 42.9 },
      ],
    },
    monthly: {
      occupancyRate: [
        { month: "2025-06", value: 0.80 },
        { month: "2025-07", value: 0.82 },
        { month: "2025-08", value: 0.83 },
      ],
      avgRate: [
        { month: "2025-06", value: 40.5 },
        { month: "2025-07", value: 41.6 },
        { month: "2025-08", value: 43.0 },
      ],
    },
  };
  return Response.json(data);
});