"use client"

import type { CommodityData, MarketNews } from "@/types/market"

// API Configuration - Now defaulting to real APIs
const API_CONFIG = {
  AGMARKNET_BASE: "https://agmarknet.gov.in/SearchCmmMkt.aspx",
  ENAM_BASE: "https://enam.gov.in/web/dhanyamandi/home",
  DATA_GOV_BASE: "https://api.data.gov.in/resource",
  MCX_BASE: "https://www.mcxindia.com/market-data",
  NCDEX_BASE: "https://www.ncdex.com/market-data",
  // Now attempting real APIs first
  USE_MOCK_DATA: false,
}

// AGMARKNET API Service
export class AgmarknetService {
  private static readonly BASE_URL = "https://agmarknet.gov.in/SearchCmmMkt.aspx"

  static async fetchMarketPrices(commodity?: string, state?: string): Promise<CommodityData[]> {
    try {
      console.log("🔄 Attempting to fetch REAL AGMARKNET data...")

      // Real AGMARKNET API call
      const params = new URLSearchParams({
        Tx_Commodity: commodity || "Rice",
        Tx_State: state || "All",
        Tx_District: "All",
        Tx_Market: "All",
        DateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        DateTo: new Date().toISOString().split("T")[0],
        Fr_Date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        To_Date: new Date().toISOString().split("T")[0],
      })

      const response = await fetch(`${this.BASE_URL}?${params}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        mode: "cors",
      })

      if (!response.ok) {
        throw new Error(`AGMARKNET API error: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()
      console.log("✅ AGMARKNET real data received:", data)
      return this.parseAgmarknetData(data)
    } catch (error) {
      console.error("❌ AGMARKNET API Error:", error)
      console.log("🔄 Falling back to mock data due to API limitations")
      return this.getMockAgmarknetData()
    }
  }

  private static parseAgmarknetData(data: any): CommodityData[] {
    try {
      // Parse real AGMARKNET response format
      if (!data || (!Array.isArray(data) && !data.records)) {
        console.log("Invalid AGMARKNET data format, using mock data")
        return this.getMockAgmarknetData()
      }

      const records = Array.isArray(data) ? data : data.records || []

      return records.map((item: any, index: number) => ({
        id: `agmarknet-${index}`,
        name: item.commodity || item.Commodity || "Unknown",
        currentPrice: Number.parseFloat(item.modal_price || item.Modal_Price || item.price) || 0,
        previousPrice:
          Number.parseFloat(item.modal_price || item.Modal_Price || item.price) * (0.98 + Math.random() * 0.04),
        change24h: 0,
        changePercent: 0,
        volume: Number.parseInt(item.arrivals || item.Arrivals || "0") || Math.floor(Math.random() * 5000) + 1000,
        marketCap: 0,
        state: item.state || item.State || "Unknown",
        market: item.market || item.Market || "Unknown APMC",
        lastUpdated: new Date(item.price_date || item.Price_Date || Date.now()),
        trend: "neutral" as const,
        volatility: "medium" as const,
        category: this.getCommodityCategory(item.commodity || item.Commodity),
        unit: "₹/quintal",
        seasonality: "peak" as const,
      }))
    } catch (error) {
      console.error("Error parsing AGMARKNET data:", error)
      return this.getMockAgmarknetData()
    }
  }

  private static getCommodityCategory(commodity: string): CommodityData["category"] {
    if (!commodity) return "grains"

    const grains = ["Rice", "Wheat", "Maize", "Barley", "Paddy"]
    const vegetables = ["Tomato", "Onion", "Potato", "Cabbage", "Brinjal"]
    const spices = ["Turmeric", "Chili", "Cumin", "Cardamom", "Coriander"]
    const cashCrops = ["Cotton", "Sugarcane", "Tea", "Coffee", "Groundnut"]
    const pulses = ["Gram", "Arhar", "Moong", "Masur", "Urad"]

    const commodityLower = commodity.toLowerCase()

    if (grains.some((g) => commodityLower.includes(g.toLowerCase()))) return "grains"
    if (vegetables.some((v) => commodityLower.includes(v.toLowerCase()))) return "vegetables"
    if (spices.some((s) => commodityLower.includes(s.toLowerCase()))) return "spices"
    if (cashCrops.some((c) => commodityLower.includes(c.toLowerCase()))) return "cash_crops"
    if (pulses.some((p) => commodityLower.includes(p.toLowerCase()))) return "pulses"
    return "grains"
  }

  private static getMockAgmarknetData(): CommodityData[] {
    console.log("📊 Using AGMARKNET mock data")
    return [
      {
        id: "agmarknet-rice-punjab",
        name: "Rice",
        currentPrice: 2850,
        previousPrice: 2820,
        change24h: 30,
        changePercent: 1.06,
        volume: 1250,
        marketCap: 0,
        state: "Punjab",
        market: "Amritsar APMC",
        lastUpdated: new Date(),
        trend: "bullish",
        volatility: "low",
        category: "grains",
        unit: "₹/quintal",
        msp: 2040,
        seasonality: "harvest",
      },
      {
        id: "agmarknet-wheat-haryana",
        name: "Wheat",
        currentPrice: 2180,
        previousPrice: 2165,
        change24h: 15,
        changePercent: 0.69,
        volume: 980,
        marketCap: 0,
        state: "Haryana",
        market: "Karnal APMC",
        lastUpdated: new Date(),
        trend: "bullish",
        volatility: "low",
        category: "grains",
        unit: "₹/quintal",
        msp: 2125,
        seasonality: "peak",
      },
    ]
  }
}

// eNAM API Service
export class EnamService {
  private static readonly BASE_URL = "https://enam.gov.in/web/dhanyamandi"

  static async fetchLivePrices(): Promise<CommodityData[]> {
    try {
      console.log("🔄 Attempting to fetch REAL eNAM data...")

      // Try multiple eNAM endpoints
      const endpoints = [
        `${this.BASE_URL}/live-prices`,
        `${this.BASE_URL}/api/market-data`,
        "https://enam.gov.in/api/market/live-prices",
      ]

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
            mode: "cors",
          })

          if (response.ok) {
            const data = await response.json()
            console.log("✅ eNAM real data received from:", endpoint)
            return this.parseEnamData(data)
          }
        } catch (endpointError) {
          console.log(`❌ Failed endpoint ${endpoint}:`, endpointError)
          continue
        }
      }

      throw new Error("All eNAM endpoints failed")
    } catch (error) {
      console.error("❌ eNAM API Error:", error)
      console.log("🔄 Falling back to mock data due to API limitations")
      return this.getMockEnamData()
    }
  }

  private static parseEnamData(data: any): CommodityData[] {
    try {
      if (!data || (!Array.isArray(data) && !data.prices && !data.data)) {
        console.log("Invalid eNAM data format, using mock data")
        return this.getMockEnamData()
      }

      const records = data.prices || data.data || data
      if (!Array.isArray(records)) return this.getMockEnamData()

      return records.map((item: any, index: number) => ({
        id: `enam-${index}`,
        name: item.commodityName || item.commodity || item.name || "Unknown",
        currentPrice: Number.parseFloat(item.currentPrice || item.price || item.modal_price) || 0,
        previousPrice: Number.parseFloat(item.previousPrice || item.prev_price) || 0,
        change24h: Number.parseFloat(item.priceChange || item.change) || 0,
        changePercent: Number.parseFloat(item.percentChange || item.change_percent) || 0,
        volume: Number.parseInt(item.tradedQuantity || item.volume || item.arrivals) || 0,
        marketCap: Number.parseFloat(item.turnover || "0") || 0,
        state: item.stateName || item.state || "Unknown",
        market: item.marketName || item.market || "eNAM",
        lastUpdated: new Date(item.lastUpdated || item.date || Date.now()),
        trend: item.trend || "neutral",
        volatility: item.volatility || "medium",
        category: AgmarknetService["getCommodityCategory"](item.commodityName || item.commodity),
        unit: item.unit || "₹/quintal",
        seasonality: "peak",
      }))
    } catch (error) {
      console.error("Error parsing eNAM data:", error)
      return this.getMockEnamData()
    }
  }

  private static getMockEnamData(): CommodityData[] {
    console.log("📊 Using eNAM mock data")
    return [
      {
        id: "enam-tomato-maharashtra",
        name: "Tomato",
        currentPrice: 2800,
        previousPrice: 3200,
        change24h: -400,
        changePercent: -12.5,
        volume: 450,
        marketCap: 1260000,
        state: "Maharashtra",
        market: "Pune eNAM",
        lastUpdated: new Date(),
        trend: "bearish",
        volatility: "high",
        category: "vegetables",
        unit: "₹/quintal",
        seasonality: "peak",
      },
      {
        id: "enam-onion-karnataka",
        name: "Onion",
        currentPrice: 1950,
        previousPrice: 1850,
        change24h: 100,
        changePercent: 5.41,
        volume: 680,
        marketCap: 1326000,
        state: "Karnataka",
        market: "Bangalore eNAM",
        lastUpdated: new Date(),
        trend: "bullish",
        volatility: "high",
        category: "vegetables",
        unit: "₹/quintal",
        seasonality: "off_season",
      },
    ]
  }
}

// Data.gov.in Service - Real API calls
export class DataGovService {
  private static readonly BASE_URL = "https://api.data.gov.in/resource"
  private static readonly API_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b"

  static async fetchAgriculturalStats(): Promise<any> {
    try {
      console.log("🔄 Attempting to fetch REAL Data.gov.in data...")

      // Real agricultural statistics API
      const response = await fetch(
        `${this.BASE_URL}/9ef84268-d588-465a-a308-a864a43d0070?api-key=${this.API_KEY}&format=json&limit=100`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Data.gov.in API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("✅ Data.gov.in real data received:", data)
      return data
    } catch (error) {
      console.error("❌ Data.gov.in API Error:", error)
      console.log("🔄 Falling back to mock data")
      return this.getMockStatsData()
    }
  }

  private static getMockStatsData() {
    console.log("📊 Using Data.gov.in mock data")
    return {
      total: 100,
      count: 10,
      records: [
        {
          state: "Punjab",
          crop: "Rice",
          area: "3000000",
          production: "11000000",
          productivity: "3667",
          year: "2023-24",
        },
        {
          state: "Haryana",
          crop: "Wheat",
          area: "2500000",
          production: "12500000",
          productivity: "5000",
          year: "2023-24",
        },
      ],
    }
  }
}

// Main API Service Orchestrator
export class MarketDataService {
  static async fetchAllMarketData(): Promise<CommodityData[]> {
    try {
      console.log("🚀 Fetching REAL market data from all sources...")

      const [agmarknetData, enamData] = await Promise.allSettled([
        AgmarknetService.fetchMarketPrices(),
        EnamService.fetchLivePrices(),
      ])

      const allData: CommodityData[] = []

      if (agmarknetData.status === "fulfilled") {
        allData.push(...agmarknetData.value)
        console.log("✅ AGMARKNET data:", agmarknetData.value.length, "items")
      } else {
        console.log("❌ AGMARKNET failed:", agmarknetData.reason)
      }

      if (enamData.status === "fulfilled") {
        allData.push(...enamData.value)
        console.log("✅ eNAM data:", enamData.value.length, "items")
      } else {
        console.log("❌ eNAM failed:", enamData.reason)
      }

      // Calculate derived metrics
      const processedData = allData.map((item) => ({
        ...item,
        change24h: item.currentPrice - item.previousPrice,
        changePercent: ((item.currentPrice - item.previousPrice) / item.previousPrice) * 100,
      }))

      console.log("📊 Total processed data:", processedData.length, "items")

      // If no real data, ensure we have mock data
      if (processedData.length === 0) {
        console.log("⚠️ No real data available, generating comprehensive mock data")
        const { generateMockData } = await import("./market-data")
        return generateMockData()
      }

      return processedData
    } catch (error) {
      console.error("❌ Market Data Service Error:", error)
      console.log("🔄 Falling back to comprehensive mock data")
      const { generateMockData } = await import("./market-data")
      return generateMockData()
    }
  }

  static async fetchMarketNews(): Promise<MarketNews[]> {
    try {
      console.log("🔄 Attempting to fetch REAL news data...")

      // Try to fetch real news
      const response = await fetch("/api/agricultural-news")
      if (response.ok) {
        const data = await response.json()
        console.log("✅ Real news data received")
        return data.articles.map((article: any, index: number) => ({
          id: `news-${index}`,
          title: article.title,
          summary: article.description,
          impact: this.determineImpact(article.title + " " + article.description),
          commodities: this.extractCommodities(article.title + " " + article.description),
          timestamp: new Date(article.publishedAt),
          source: article.source.name,
        }))
      }
      throw new Error("News API not available")
    } catch (error) {
      console.error("❌ News API Error:", error)
      console.log("🔄 Using mock news data")
      return this.getMockNewsData()
    }
  }

  private static determineImpact(text: string): "positive" | "negative" | "neutral" {
    const positiveWords = ["increase", "boost", "growth", "rise", "good", "better", "improved"]
    const negativeWords = ["decrease", "fall", "drop", "decline", "poor", "worse", "damaged"]

    const lowerText = text.toLowerCase()
    const positiveCount = positiveWords.filter((word) => lowerText.includes(word)).length
    const negativeCount = negativeWords.filter((word) => lowerText.includes(word)).length

    if (positiveCount > negativeCount) return "positive"
    if (negativeCount > positiveCount) return "negative"
    return "neutral"
  }

  private static extractCommodities(text: string): string[] {
    const commodities = ["Rice", "Wheat", "Cotton", "Tomato", "Onion", "Potato", "Turmeric", "Chili"]
    return commodities.filter((commodity) => text.toLowerCase().includes(commodity.toLowerCase()))
  }

  private static getMockNewsData(): MarketNews[] {
    return [
      {
        id: "news-1",
        title: "Monsoon Forecast Boosts Kharif Crop Outlook",
        summary:
          "IMD predicts normal rainfall across major agricultural regions, expected to benefit rice and cotton production",
        impact: "positive",
        commodities: ["Rice", "Cotton"],
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        source: "Agricultural Ministry",
      },
      {
        id: "news-2",
        title: "Export Demand Drives Spice Prices Higher",
        summary: "International demand for Indian spices reaches new highs, particularly for turmeric and cardamom",
        impact: "positive",
        commodities: ["Turmeric"],
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        source: "Spices Board India",
      },
    ]
  }
}
