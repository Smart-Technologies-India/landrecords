import { CommidityPursose } from "@prisma/client";

interface CommodityData {
  id: string;
  act: string;
  code: string;
  commodity: string;
  purpose: CommidityPursose;
  description: string;
}

export type { CommodityData };

export interface OptionValue {
  value: string;
  label: string;
}
