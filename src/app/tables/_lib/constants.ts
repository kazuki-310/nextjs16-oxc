// --------------------------------
// Type
// --------------------------------

export type AdRow = {
  name: string;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  cvr: number;
  cost: number;
  cpc: number;
  cpa: number;
  revenue: number;
  roas: number;
  reach: number;
  frequency: number;
  cpm: number;
  viewRate: number;
  engagement: number;
  engagementRate: number;
  videoViews: number;
  bounceRate: number;
  avgPosition: number;
  qualityScore: number;
  impressionShare: number;
  lostImpressionShareBudget: number;
  lostImpressionShareRank: number;
  allConversions: number;
};

// --------------------------------
// Mock data (30 rows, deterministic)
// --------------------------------

export const tableData: AdRow[] = Array.from({ length: 90 }, (_, i) => {
  const n = i + 1;
  const impressions = 10000 + n * 15000;
  const clicks = Math.floor(impressions * 0.03 + n * 100);
  const conversions = Math.floor(clicks * 0.05 + n * 2);
  const cost = 5000 + n * 18000;
  const revenue = Math.floor(cost * (1.2 + n * 0.1));
  return {
    name: `キャンペーン_${String(n).padStart(2, "0")}`,
    impressions,
    clicks,
    ctr: parseFloat(((clicks / impressions) * 100).toFixed(2)),
    conversions,
    cvr: parseFloat(((conversions / clicks) * 100).toFixed(2)),
    cost,
    cpc: Math.floor(cost / clicks),
    cpa: Math.floor(cost / (conversions || 1)),
    revenue,
    roas: parseFloat(((revenue / cost) * 100).toFixed(2)),
    reach: Math.floor(impressions * 0.8),
    frequency: parseFloat((1.5 + n * 0.1).toFixed(1)),
    cpm: parseFloat(((cost / impressions) * 1000).toFixed(2)),
    viewRate: parseFloat((50 + n * 1.2).toFixed(2)),
    engagement: Math.floor(clicks * 2 + n * 100),
    engagementRate: parseFloat((3 + n * 0.2).toFixed(2)),
    videoViews: Math.floor(clicks * 1.5),
    bounceRate: parseFloat(Math.max(60 - n, 20).toFixed(2)),
    avgPosition: parseFloat(Math.max(5 - n * 0.1, 1).toFixed(1)),
    qualityScore: (n % 10) + 1,
    impressionShare: parseFloat(Math.min(30 + n, 90).toFixed(2)),
    lostImpressionShareBudget: parseFloat(Math.max(20 - n * 0.5, 0).toFixed(2)),
    lostImpressionShareRank: parseFloat(Math.max(15 - n * 0.3, 0).toFixed(2)),
    allConversions: conversions + n,
  };
});

// --------------------------------
// Table configs
// ここの数を変えるだけでテーブル数を調整できる
// --------------------------------

const TABLE_COUNT = 40;

export const tableConfigs = Array.from({ length: TABLE_COUNT }, (_, i) => ({
  id: i + 1,
  title: `広告レポート ${String(i + 1).padStart(2, "0")}`,
}));
