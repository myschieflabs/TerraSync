"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMarket } from "@/contexts/market-context"
import { BarChart3, Activity, Target } from "lucide-react"
import { PriceChart } from "./price-chart"

export function TechnicalAnalysis() {
  const { state } = useMarket()

  // Get the first commodity if no commodity is selected
  const selectedCommodity = state.selectedCommodity || (state.commodities.length > 0 ? state.commodities[0] : null)

  console.log(
    "Technical Analysis - Selected commodity:",
    selectedCommodity?.name,
    "Total commodities:",
    state.commodities.length,
  )

  if (!selectedCommodity) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Technical Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 bg-muted/20 rounded border-2 border-dashed border-muted-foreground/20">
            <div className="text-center p-4">
              <div className="text-muted-foreground">No commodity data available</div>
              <div className="text-xs text-muted-foreground mt-1">Waiting for market data to load...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const technicalIndicators = {
    rsi: Math.floor(Math.random() * 100),
    macd: (Math.random() - 0.5) * 2,
    movingAverage20: selectedCommodity.currentPrice * (0.95 + Math.random() * 0.1),
    movingAverage50: selectedCommodity.currentPrice * (0.9 + Math.random() * 0.2),
    support: selectedCommodity.currentPrice * 0.92,
    resistance: selectedCommodity.currentPrice * 1.08,
    volume: selectedCommodity.volume,
    avgVolume: selectedCommodity.volume * (0.8 + Math.random() * 0.4),
  }

  const getRSISignal = (rsi: number) => {
    if (rsi > 70) return { signal: "Overbought", variant: "destructive" as const }
    if (rsi < 30) return { signal: "Oversold", variant: "default" as const }
    return { signal: "Neutral", variant: "secondary" as const }
  }

  const getMACDSignal = (macd: number) => {
    if (macd > 0.5) return { signal: "Strong Buy", variant: "default" as const }
    if (macd > 0) return { signal: "Buy", variant: "outline" as const }
    if (macd < -0.5) return { signal: "Strong Sell", variant: "destructive" as const }
    if (macd < 0) return { signal: "Sell", variant: "outline" as const }
    return { signal: "Hold", variant: "secondary" as const }
  }

  const rsiSignal = getRSISignal(technicalIndicators.rsi)
  const macdSignal = getMACDSignal(technicalIndicators.macd)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Analysis</span>
          </CardTitle>
          <Badge variant="outline">
            {selectedCommodity.name} - {selectedCommodity.state}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Price Chart */}
        <div className="h-64 w-full">
          <h5 className="text-sm font-medium mb-2">Price Chart (7 Days)</h5>
          <div className="h-52 w-full border rounded-lg p-2 bg-card">
            <PriceChart commodity={selectedCommodity} />
          </div>
        </div>

        {/* Technical Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Key Indicators</span>
            </h4>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm">RSI (14)</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{technicalIndicators.rsi}</span>
                  <Badge variant={rsiSignal.variant} className="text-xs">
                    {rsiSignal.signal}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm">MACD</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{technicalIndicators.macd.toFixed(2)}</span>
                  <Badge variant={macdSignal.variant} className="text-xs">
                    {macdSignal.signal}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm">Volume</span>
                <div className="text-right">
                  <div className="font-medium text-sm">{technicalIndicators.volume.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">
                    Avg: {Math.round(technicalIndicators.avgVolume).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Support & Resistance</span>
            </h4>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
                <span className="text-sm text-black">Resistance</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  ₹{technicalIndicators.resistance.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <span className="text-sm text-black">Current Price</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  ₹{selectedCommodity.currentPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                <span className="text-sm text-black">Support</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  ₹{technicalIndicators.support.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Moving Averages */}
        <div>
          <h4 className="font-semibold text-sm mb-3">Moving Averages</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground">MA 20</div>
              <div className="font-medium">₹{technicalIndicators.movingAverage20.toFixed(2)}</div>
              <div
                className={`text-xs ${
                  selectedCommodity.currentPrice > technicalIndicators.movingAverage20
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {selectedCommodity.currentPrice > technicalIndicators.movingAverage20 ? "Above" : "Below"}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground">MA 50</div>
              <div className="font-medium">₹{technicalIndicators.movingAverage50.toFixed(2)}</div>
              <div
                className={`text-xs ${
                  selectedCommodity.currentPrice > technicalIndicators.movingAverage50
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {selectedCommodity.currentPrice > technicalIndicators.movingAverage50 ? "Above" : "Below"}
              </div>
            </div>
          </div>
        </div>

        {/* Trading Signals */}
        <div className="p-4 rounded-lg border bg-card">
          <h4 className="font-semibold text-sm mb-2">Overall Signal</h4>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">
                {macdSignal.signal === "Strong Buy" || macdSignal.signal === "Buy"
                  ? "BUY"
                  : macdSignal.signal === "Strong Sell" || macdSignal.signal === "Sell"
                    ? "SELL"
                    : "HOLD"}
              </div>
              <div className="text-xs text-muted-foreground">Based on technical indicators</div>
            </div>
            <Badge variant={macdSignal.variant}>{macdSignal.signal}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
