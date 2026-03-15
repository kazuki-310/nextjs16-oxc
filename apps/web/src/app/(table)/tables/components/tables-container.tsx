import { getAdData } from "../../data/get-ad-data";
import { TablesContent } from "./tables-content";

export async function TablesContainer(): Promise<React.JSX.Element> {
  const data = await getAdData();
  return <TablesContent {...data} />;
}
