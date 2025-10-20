import { secure } from "@/lib/api/handler";

export const GET = secure(async () => {
  const data = [
    { country: "United States", country_code: "US" },
  ];
  return Response.json(data);
})