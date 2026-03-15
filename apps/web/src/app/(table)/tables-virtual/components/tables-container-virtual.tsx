import { getAdData } from "../../data/get-ad-data";
import { TablesContentVirtual } from "./tables-content-virtual";

export async function TablesContainerVirtual(): Promise<React.JSX.Element> {
  const data = await getAdData();
  return <TablesContentVirtual {...data} />;
}
