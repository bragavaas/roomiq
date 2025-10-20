import { secure } from "@/lib/api/handler";
import { listCountries } from "@/mocks/filters";

export const GET = secure(async () => Response.json(listCountries()));
