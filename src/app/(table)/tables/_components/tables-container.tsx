import { getAdData } from "../../_server-functions/fetchers/get-ad-data";
import { TablesContent } from "./tables-content";

export async function TablesContainer(): Promise<React.JSX.Element> {
  const data = await getAdData();
  return <TablesContent {...data} />;
}
