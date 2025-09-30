import { NextResponse } from "next/server";

// Mock dataset — later this will come from your real backend
const locationsDallas = [
  { id: 1, name: "Downtown Dallas", coords: [32.7767, -96.7970] },
  { id: 2, name: "Deep Ellum", coords: [32.7846, -96.7836] },
  { id: 3, name: "Bishop Arts District", coords: [32.7473, -96.8280] },
  { id: 4, name: "Uptown Dallas", coords: [32.8005, -96.8039] },
  { id: 5, name: "Lakewood", coords: [32.8123, -96.7445] },
];

export async function GET() {
  return NextResponse.json(locationsDallas);
}
