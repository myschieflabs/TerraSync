"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMarket } from "@/contexts/market-context"
import { Bell, Newspaper, Plus, AlertTriangle, Cloud, Gavel } from "lucide-react"
import { generateMarketNews } from "@/lib/market-data"
import { DataSourceIndicator } from "./data-source-indicator"
import type { MarketNews } from "@/types/market"

export function NewsAndAlerts() {
  const { state, dispatch } = useMarket()
  const [showAddAlert, setShowAddAlert] = useState(false)
  const [marketNews, setMarketNews] = useState<MarketNews[]>([])
  const [alertForm, setAlertForm] = useState({
    commodityId: "",
    type: "above" as "above" | "below",
    targetPrice: "",
  })

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const news = await generateMarketNews()
        setMarketNews(news)
      } catch (error) {
        console.error("Failed to fetch news:", error)
      }
    }

    fetchNews()

    // Refresh news every 10 minutes
    const interval = setInterval(fetchNews, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const handleAddAlert = () => {
    if (alertForm.commodityId && alertForm.targetPrice) {
      const commodity = state.commodities.find((c) => c.id === alertForm.commodityId)
      if (commodity) {
        dispatch({
          type: "ADD_ALERT",
          payload: {
            id: `alert-${Date.now()}`,
            commodityId: alertForm.commodityId,
            type: alertForm.type,
            targetPrice: Number.parseFloat(alertForm.targetPrice),
            isActive: true,
            createdAt: new Date(),
          },
        })
        setAlertForm({ commodityId: "", type: "above", targetPrice: "" })
        setShowAddAlert(false)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Data Sources */}
      <DataSourceIndicator />

      {/* Price Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Price Alerts</span>
            </CardTitle>
            <Button size="sm" onClick={() => setShowAddAlert(!showAddAlert)} variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add Alert
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {showAddAlert && (
            <div className="p-3 border rounded-lg space-y-3">
              <div>
                <Label htmlFor="commodity">Commodity</Label>
                <Select
                  value={alertForm.commodityId}
                  onValueChange={(value) => setAlertForm((prev) => ({ ...prev, commodityId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select commodity" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.commodities.slice(0, 20).map((commodity) => (
                      <SelectItem key={commodity.id} value={commodity.id}>
                        {commodity.name} - {commodity.state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="type">Alert Type</Label>
                  <Select
                    value={alertForm.type}
                    onValueChange={(value: "above" | "below") => setAlertForm((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Above</SelectItem>
                      <SelectItem value="below">Below</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price">Target Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={alertForm.targetPrice}
                    onChange={(e) => setAlertForm((prev) => ({ ...prev, targetPrice: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" onClick={handleAddAlert}>
                  Create Alert
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddAlert(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {state.alerts.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No active alerts. Create one to get notified of price changes.
              </div>
            ) : (
              state.alerts.map((alert) => {
                const commodity = state.commodities.find((c) => c.id === alert.commodityId)
                if (!commodity) return null

                return (
                  <div key={alert.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div>
                      <div className="font-medium text-sm">{commodity.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {commodity.state} • {alert.type} ₹{alert.targetPrice}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {alert.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm font-medium">₹{commodity.currentPrice.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Market News */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Newspaper className="h-5 w-5" />
            <span>Market News</span>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Live Feed
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {marketNews.map((news) => (
            <div key={news.id} className="p-3 border rounded-lg space-y-2">
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-sm leading-tight">{news.title}</h4>
                <Badge
                  variant={
                    news.impact === "positive" ? "default" : news.impact === "negative" ? "destructive" : "secondary"
                  }
                  className="text-xs ml-2"
                >
                  {news.impact}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{news.summary}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {news.commodities.map((commodity) => (
                    <Badge key={commodity} variant="outline" className="text-xs">
                      {commodity}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">
                  {news.timestamp.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  • {news.source}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weather Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cloud className="h-5 w-5" />
            <span>Weather Impact</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <div className="flex items-center space-x-2 mb-2">
              <Cloud className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-sm text-black">Monsoon Update</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Normal rainfall expected across major agricultural regions. Positive impact on Kharif crops expected.
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
                Rice
              </Badge>
              <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
                Cotton
              </Badge>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="font-medium text-sm text-black">Heat Wave Alert</span>
            </div>
            <p className="text-xs text-muted-foreground">
              High temperatures in North India may affect vegetable prices. Monitor tomato and onion markets closely.
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline" className="text-yellow-600 border-yellow-600 text-xs">
                Tomato
              </Badge>
              <Badge variant="outline" className="text-yellow-600 border-yellow-600 text-xs">
                Onion
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Policy Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gavel className="h-5 w-5" />
            <span>Policy Updates</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="p-3 border rounded-lg">
            <div className="font-medium text-sm mb-1">MSP Announcement</div>
            <p className="text-xs text-muted-foreground mb-2">
              Government announces Minimum Support Prices for Rabi crops. Wheat MSP increased by 5.4%.
            </p>
            <div className="text-xs text-muted-foreground">2 hours ago</div>
          </div>

          <div className="p-3 border rounded-lg">
            <div className="font-medium text-sm mb-1">Export Policy</div>
            <p className="text-xs text-muted-foreground mb-2">
              Rice export restrictions lifted for premium varieties. Expected to boost Basmati prices.
            </p>
            <div className="text-xs text-muted-foreground">5 hours ago</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
