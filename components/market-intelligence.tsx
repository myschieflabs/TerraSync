"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useMarket } from "@/contexts/market-context"
import { TrendingUp, TrendingDown, AlertTriangle, Target, MapPin, Calendar } from "lucide-react"

export function MarketIntelligence() {
  const { state } = useMarket()

  if (state.commodities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Market Intelligence</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading market intelligence...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const marketInsights = {
    topGainers: state.commodities
      .filter((c) => c.changePercent > 0)
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 5),
    topLosers: state.commodities
      .filter((c) => c.changePercent < 0)
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 5),
    highVolatility: state.commodities.filter((c) => c.volatility === "high").slice(0, 3),
    arbitrageOpportunities: getArbitrageOpportunities(state.commodities),
  }

  console.log("Market Intelligence Data:", {
    totalCommodities: state.commodities.length,
    gainers: marketInsights.topGainers.length,
    losers: marketInsights.topLosers.length,
    highVolatility: marketInsights.highVolatility.length,
    arbitrage: marketInsights.arbitrageOpportunities.length,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Market Intelligence</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Top Movers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-sm mb-3 flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Top Gains</span>
            </h4>
            <div className="space-y-2">
              {marketInsights.topGainers.map((commodity) => (
                <div
                  key={commodity.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
                >
                  <div>
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100 bg-black">{commodity.name}</div>
                    <div className="text-xs dark:text-gray-300 text-black">{commodity.state}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-600 dark:text-green-400 font-medium text-sm">
                      +{commodity.changePercent.toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">₹{commodity.currentPrice.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 flex items-center space-x-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span>Top Loss</span>
            </h4>
            <div className="space-y-2">
              {marketInsights.topLosers.map((commodity) => (
                <div
                  key={commodity.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
                >
                  <div>
                    <div className="font-medium text-sm dark:text-gray-100 text-black">{commodity.name}</div>
                    <div className="text-xs dark:text-gray-300 text-black">{commodity.state}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-red-600 dark:text-red-400 font-medium text-sm">
                      {commodity.changePercent.toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">₹{commodity.currentPrice.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* High Volatility Alert */}
        <div>
          <h4 className="font-semibold text-sm mb-3 flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span>High Volatility Alert</span>
          </h4>
          <div className="space-y-2">
            {marketInsights.highVolatility.map((commodity) => (
              <div
                key={commodity.id}
                className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800"
              >
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="font-medium text-sm dark:text-gray-100 text-black">{commodity.name}</div>
                    <div className="text-xs dark:text-gray-300 text-black">{commodity.state}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className="text-yellow-600 dark:text-yellow-400 border-yellow-600 dark:border-yellow-500"
                  >
                    High Vol
                  </Badge>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      ₹{commodity.currentPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arbitrage Opportunities */}
        <div>
          <h4 className="font-semibold text-sm mb-3 flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span>Arbitrage Opportunities</span>
          </h4>
          <div className="space-y-2">
            {marketInsights.arbitrageOpportunities.map((opportunity, index) => (
              <div key={index} className="p-3 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm text-foreground">{opportunity.commodity}</div>
                  <Badge
                    variant="outline"
                    className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-500"
                  >
                    {opportunity.profitMargin.toFixed(1)}% margin
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-muted-foreground">Buy from</div>
                    <div className="font-medium text-foreground">{opportunity.buyState}</div>
                    <div className="text-green-600 dark:text-green-400">₹{opportunity.buyPrice.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Sell to</div>
                    <div className="font-medium text-foreground">{opportunity.sellState}</div>
                    <div className="text-blue-600 dark:text-blue-400">₹{opportunity.sellPrice.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Sentiment */}
        <div>
          <h4 className="font-semibold text-sm mb-3 flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-purple-500" />
            <span>Market Sentiment</span>
          </h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground">Bullish Sentiment</span>
                <span className="text-foreground font-medium">65%</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground">Market Activity</span>
                <span className="text-foreground font-medium">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground">Price Stability</span>
                <span className="text-foreground font-medium">42%</span>
              </div>
              <Progress value={42} className="h-2" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getArbitrageOpportunities(commodities: any[]) {
  if (!commodities || commodities.length === 0) return []

  const opportunities: any[] = []
  const commodityGroups = commodities.reduce((acc, commodity) => {
    if (!acc[commodity.name]) acc[commodity.name] = []
    acc[commodity.name].push(commodity)
    return acc
  }, {} as any)

  Object.entries(commodityGroups).forEach(([name, items]: [string, any[]]) => {
    if (items.length > 1) {
      const sorted = items.sort((a, b) => a.currentPrice - b.currentPrice)
      const lowest = sorted[0]
      const highest = sorted[sorted.length - 1]

      if (highest.currentPrice > lowest.currentPrice * 1.1) {
        opportunities.push({
          commodity: name,
          buyState: lowest.state,
          sellState: highest.state,
          buyPrice: lowest.currentPrice,
          sellPrice: highest.currentPrice,
          profitMargin: ((highest.currentPrice - lowest.currentPrice) / lowest.currentPrice) * 100,
        })
      }
    }
  })

  return opportunities.slice(0, 3)
}
