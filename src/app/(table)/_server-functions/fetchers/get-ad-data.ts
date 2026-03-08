import "server-only";
import { tableData, tableConfigs, type AdRow } from "../../_lib/constants";

export type { AdRow };

export type AdData = {
  tableData: AdRow[];
  tableConfigs: { id: number; title: string }[];
};

export async function getAdData(): Promise<AdData> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { tableData, tableConfigs };
}
