import {
  LayoutGrid,
  Sprout,
  Package,
  FlaskConical,
  ShieldAlert,
  Wheat,
  Carrot,
  Apple,
  Droplets,
  Tractor,
} from "lucide-react";

export const categories = [
  { id: "all", name: "All Categories", shortName: "All", icon: LayoutGrid, count: 230 },
  { id: "seeds", name: "Seeds", shortName: "Seeds", icon: Sprout, count: 25 },
  { id: "fertilizers", name: "Fertilizers", shortName: "Fertilizers", icon: Package, count: 28 },
  { id: "pesticides", name: "Pesticides", shortName: "Pesticides", icon: FlaskConical, count: 22 },
  { id: "herbicides", name: "Herbicides", shortName: "Herbicides", icon: ShieldAlert, count: 18 },
  { id: "crops", name: "Crops", shortName: "Crops", icon: Wheat, count: 24 },
  { id: "vegetables", name: "Vegetables", shortName: "Vegetables", icon: Carrot, count: 30 },
  { id: "fruits", name: "Fruits", shortName: "Fruits", icon: Apple, count: 21 },
  { id: "irrigation", name: "Irrigation", shortName: "Irrigation", icon: Droplets, count: 20 },
  { id: "equipment", name: "Farm Equipment", shortName: "Farm Equipment", icon: Tractor, count: 22 },
];