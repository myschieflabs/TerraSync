export interface CommodityData {
  id: string
  name: string
  currentPrice: number
  previousPrice: number
  change24h: number
  changePercent: number
  volume: number
  marketCap: number
  state: string
  market: string
  lastUpdated: Date
  trend: "bullish" | "bearish" | "neutral"
  volatility: "high" | "medium" | "low"
  category: "grains" | "vegetables" | "spices" | "cash_crops" | "pulses"
  unit: string
  msp?: number
  seasonality: "peak" | "off_season" | "harvest"
}

export interface PriceAlert {
  id: string
  commodityId: string
  type: "above" | "below"
  targetPrice: number
  isActive: boolean
  createdAt: Date
}

export interface MarketNews {
  id: string
  title: string
  summary: string
  impact: "positive" | "negative" | "neutral"
  commodities: string[]
  timestamp: Date
  source: string
}

export interface MarketState {
  commodities: CommodityData[]
  watchlist: string[]
  alerts: PriceAlert[]
  isMarketOpen: boolean
  lastUpdate: Date
  selectedCommodity: CommodityData | null
  filters: {
    state: string
    commodity: string
    priceRange: [number, number]
    sortBy: string
    sortOrder: "asc" | "desc"
  }
}

export type MarketAction =
  | { type: "SET_COMMODITIES"; payload: CommodityData[] }
  | { type: "UPDATE_PRICES"; payload: CommodityData[] | ((prev: CommodityData[]) => CommodityData[]) }
  | { type: "ADD_TO_WATCHLIST"; payload: string }
  | { type: "REMOVE_FROM_WATCHLIST"; payload: string }
  | { type: "SET_SELECTED_COMMODITY"; payload: CommodityData | null }
  | { type: "SET_FILTERS"; payload: Partial<MarketState["filters"]> }
  | { type: "ADD_ALERT"; payload: PriceAlert }
