import {
  LayoutDashboard,
  ChartBar,
  Gauge,
  type LucideIcon,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Enhanced Property Analytics Dashboard",
    items: [
      {
        title: "New Country Dashboard",
        url: "/dashboard/newcountrydashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Predictor",
        url: "/dashboard/predictor",
        icon: Gauge,
      },
      {
        title: "Analyzer",
        url: "/dashboard/analyzer",
        icon: ChartBar,
      }
    ],
  },
];
