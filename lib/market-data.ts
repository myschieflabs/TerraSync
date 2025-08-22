import type { CommodityData, MarketNews } from "@/types/market"
import { MarketDataService } from "./api-services"

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
]

const COMMODITIES = [
  { name: "Rice", basePrice: 2850, volatility: 0.02, category: "grains", unit: "₹/quintal", msp: 2040 },
  { name: "Wheat", basePrice: 2180, volatility: 0.015, category: "grains", unit: "₹/quintal", msp: 2125 },
  { name: "Cotton", basePrice: 59800, volatility: 0.03, category: "cash_crops", unit: "₹/bale", msp: 6080 },
  { name: "Tomato", basePrice: 2800, volatility: 0.08, category: "vegetables", unit: "₹/quintal" },
  { name: "Onion", basePrice: 1950, volatility: 0.06, category: "vegetables", unit: "₹/quintal" },
  { name: "Potato", basePrice: 1600, volatility: 0.04, category: "vegetables", unit: "₹/quintal" },
  { name: "Turmeric", basePrice: 10250, volatility: 0.025, category: "spices", unit: "₹/quintal" },
  { name: "Chili", basePrice: 14500, volatility: 0.035, category: "spices", unit: "₹/quintal" },
  { name: "Cumin", basePrice: 48500, volatility: 0.04, category: "spices", unit: "₹/quintal" },
  { name: "Cardamom", basePrice: 275000, volatility: 0.05, category: "spices", unit: "₹/quintal" },
  { name: "Tea", basePrice: 28500, volatility: 0.02, category: "cash_crops", unit: "₹/quintal" },
  { name: "Coffee", basePrice: 42500, volatility: 0.03, category: "cash_crops", unit: "₹/quintal" },
  { name: "Groundnut", basePrice: 6800, volatility: 0.025, category: "cash_crops", unit: "₹/quintal", msp: 5850 },
  { name: "Soybean", basePrice: 4500, volatility: 0.03, category: "cash_crops", unit: "₹/quintal", msp: 4300 },
  { name: "Mustard", basePrice: 5200, volatility: 0.025, category: "cash_crops", unit: "₹/quintal", msp: 5450 },
  { name: "Gram", basePrice: 5800, volatility: 0.02, category: "pulses", unit: "₹/quintal", msp: 5230 },
  { name: "Maize", basePrice: 2200, volatility: 0.02, category: "grains", unit: "₹/quintal", msp: 1870 },
  { name: "Coconut", basePrice: 2800, volatility: 0.03, category: "cash_crops", unit: "₹/100 pieces" },
  { name: "Rubber", basePrice: 16500, volatility: 0.04, category: "cash_crops", unit: "₹/quintal" },
  { name: "Jute", basePrice: 4200, volatility: 0.025, category: "cash_crops", unit: "₹/quintal", msp: 4750 },
]

// Generate mock data as fallback
export function generateMockData(): CommodityData[] {
  const data: CommodityData[] = []

  COMMODITIES.forEach((commodity, index) => {
    // Generate data for more states to ensure we have enough data
    INDIAN_STATES.slice(0, 12).forEach((state, stateIndex) => {
      const stateMultiplier = 0.85 + stateIndex * 0.03
      const currentPrice = Math.round(commodity.basePrice * stateMultiplier * 100) / 100
      const previousPrice = currentPrice * (0.97 + Math.random() * 0.06)
      const change24h = currentPrice - previousPrice
      const changePercent = (change24h / previousPrice) * 100

      data.push({
        id: `${commodity.name.toLowerCase().replace(/\s+/g, "-")}-${state.toLowerCase().replace(/\s+/g, "-")}`,
        name: commodity.name,
        currentPrice,
        previousPrice,
        change24h: Math.round(change24h * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
        volume: Math.floor(Math.random() * 10000) + 1000,
        marketCap: Math.floor(Math.random() * 1000000) + 100000,
        state,
        market: `${state} APMC`,
        lastUpdated: new Date(),
        trend: changePercent > 1 ? "bullish" : changePercent < -1 ? "bearish" : "neutral",
        volatility: commodity.volatility > 0.04 ? "high" : commodity.volatility > 0.025 ? "medium" : "low",
        category: commodity.category as any,
        unit: commodity.unit,
        msp: commodity.msp,
        seasonality: Math.random() > 0.5 ? "peak" : Math.random() > 0.5 ? "harvest" : "off_season",
      })
    })
  })

  console.log("Generated", data.length, "commodity records")
  return data
}

// Fetch real market data
export async function fetchRealMarketData(): Promise<CommodityData[]> {
  try {
    console.log("Attempting to fetch real market data...")

    // For now, always use mock data since APIs need configuration
    const mockData = generateMockData()
    console.log("Generated mock data:", mockData.length, "items")
    return mockData

    // Uncomment below when APIs are configured
    // const realData = await MarketDataService.fetchAllMarketData()
    // if (realData && realData.length > 0) {
    //   return realData
    // }
    // return generateMockData()
  } catch (error) {
    console.error("Error fetching real market data:", error)
    return generateMockData()
  }
}

export function updatePricesWithVolatility(commodities: CommodityData[]): CommodityData[] {
  return commodities.map((commodity) => {
    const volatilityFactor = COMMODITIES.find((c) => c.name === commodity.name)?.volatility || 0.02
    const priceChange = (Math.random() - 0.5) * 2 * volatilityFactor * commodity.currentPrice
    const newPrice = Math.max(0.1, commodity.currentPrice + priceChange)
    const change24h = newPrice - commodity.previousPrice
    const changePercent = (change24h / commodity.previousPrice) * 100

    return {
      ...commodity,
      previousPrice: commodity.currentPrice,
      currentPrice: Math.round(newPrice * 100) / 100,
      change24h: Math.round(change24h * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      volume: commodity.volume + Math.floor((Math.random() - 0.5) * 200),
      lastUpdated: new Date(),
      trend: changePercent > 1 ? "bullish" : changePercent < -1 ? "bearish" : "neutral",
    }
  })
}

export async function generateMarketNews(): Promise<MarketNews[]> {
  try {
    const realNews = await MarketDataService.fetchMarketNews()

    if (realNews && realNews.length > 0) {
      return realNews
    }

    // Fallback to mock news
    return getMockNewsData()
  } catch (error) {
    console.error("Error fetching real news:", error)
    return getMockNewsData()
  }
}

function getMockNewsData(): MarketNews[] {
  const newsTemplates = [
    {
      title: "Monsoon Forecast Impacts Kharif Crop Prices",
      summary: "IMD predicts normal rainfall, affecting rice and cotton futures",
      impact: "positive" as const,
      commodities: ["Rice", "Cotton"],
      source: "Agricultural Ministry",
    },
    {
      title: "Export Demand Boosts Spice Prices",
      summary: "International demand for turmeric and cardamom reaches new highs",
      impact: "positive" as const,
      commodities: ["Turmeric", "Cardamom"],
      source: "Spices Board",
    },
    {
      title: "Storage Issues Affect Onion Prices",
      summary: "Post-harvest storage problems lead to price volatility",
      impact: "negative" as const,
      commodities: ["Onion"],
      source: "Market Intelligence",
    },
    {
      title: "Government Announces New MSP Rates",
      summary: "Minimum Support Prices increased for major Rabi crops",
      impact: "positive" as const,
      commodities: ["Wheat", "Gram", "Mustard"],
      source: "Ministry of Agriculture",
    },
    {
      title: "Weather Alert Issued for Northern States",
      summary: "Unseasonal rainfall may affect standing crops in Punjab and Haryana",
      impact: "negative" as const,
      commodities: ["Wheat", "Mustard"],
      source: "IMD",
    },
  ]

  return newsTemplates.map((template, index) => ({
    id: `news-${index}`,
    ...template,
    timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
  }))
}
