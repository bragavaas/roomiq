import { getServerSession } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";

export default async function RoleBadge() {
  const session = await getServerSession();
  if (!session) return <Badge variant="outline">guest</Badge>;
  return <Badge>{session.role}</Badge>;
}
