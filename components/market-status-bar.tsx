"use client"

import { Badge } from "@/components/ui/badge"
import { useMarket } from "@/contexts/market-context"
import { TrendingUp, TrendingDown, Activity, Clock } from "lucide-react"

export function MarketStatusBar() {
  const { state } = useMarket()

  const marketStats = {
    totalCommodities: state.commodities.length,
    gainers: state.commodities.filter((c) => c.changePercent > 0).length,
    losers: state.commodities.filter((c) => c.changePercent < 0).length,
    unchanged: state.commodities.filter((c) => c.changePercent === 0).length,
    avgChange: state.commodities.reduce((acc, c) => acc + c.changePercent, 0) / state.commodities.length,
  }

  return (
    <div className="border-b bg-background">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-foreground">Market Open</span>
              <Badge
                variant="outline"
                className="text-green-600 border-green-600 bg-green-50 dark:bg-green-950/20 dark:text-green-400 dark:border-green-500"
              >
                ACTIVE
              </Badge>
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-green-600 dark:text-green-400 font-medium">{marketStats.gainers}</span>
                <span className="text-muted-foreground">Up</span>
              </div>

              <div className="flex items-center space-x-1">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="text-red-600 dark:text-red-400 font-medium">{marketStats.losers}</span>
                <span className="text-muted-foreground">Down</span>
              </div>

              <div className="flex items-center space-x-1">
                <span className="text-muted-foreground font-medium">{marketStats.unchanged}</span>
                <span className="text-muted-foreground">Unchanged</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Last Update:</span>
              <span className="font-medium text-foreground">
                {state.lastUpdate.toLocaleTimeString("en-IN", {
                  hour12: true,
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">Avg Change:</span>
              <span
                className={`font-medium ${marketStats.avgChange >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              >
                {marketStats.avgChange >= 0 ? "+" : ""}
                {marketStats.avgChange.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
