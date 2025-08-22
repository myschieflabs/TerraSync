"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMarket } from "@/contexts/market-context"
import { TrendingUp, TrendingDown, Star, Plus, ArrowUpDown } from "lucide-react"

export function LivePriceMonitor() {
  const { state, dispatch } = useMarket()
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filterState, setFilterState] = useState("all")
  const [filterCommodity, setFilterCommodity] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showPerKg, setShowPerKg] = useState(false)

  const filteredAndSortedData = useMemo(() => {
    console.log("Filtering data:", {
      totalCommodities: state.commodities.length,
      searchTerm,
      filterState,
      filterCommodity,
    })

    if (state.commodities.length === 0) {
      console.log("No commodities in state")
      return []
    }

    const filtered = state.commodities.filter((commodity) => {
      const matchesSearch =
        !searchTerm ||
        commodity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commodity.state.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesState = filterState === "all" || commodity.state === filterState
      const matchesCommodity = filterCommodity === "all" || commodity.name === filterCommodity

      return matchesSearch && matchesState && matchesCommodity
    })

    console.log("Filtered results:", filtered.length)

    // Sort the filtered data
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof typeof a]
      let bValue = b[sortBy as keyof typeof b]

      if (typeof aValue === "string") aValue = aValue.toLowerCase()
      if (typeof bValue === "string") bValue = bValue.toLowerCase()

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [state.commodities, sortBy, sortOrder, filterState, filterCommodity, searchTerm])

  useEffect(() => {
    console.log("LivePriceMonitor: commodities updated", state.commodities.length)
  }, [state.commodities])

  const uniqueStates = [...new Set(state.commodities.map((c) => c.state))].sort()
  const uniqueCommodities = [...new Set(state.commodities.map((c) => c.name))].sort()

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const toggleWatchlist = (commodityId: string) => {
    if (state.watchlist.includes(commodityId)) {
      dispatch({ type: "REMOVE_FROM_WATCHLIST", payload: commodityId })
    } else {
      dispatch({ type: "ADD_TO_WATCHLIST", payload: commodityId })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Live Price Monitor</span>
            <Badge variant="outline" className="text-green-600 border-green-600 mx-3.5">
              Real-time
            </Badge>
          </CardTitle>

          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search commodities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48"
            />

            <Select value={filterState} onValueChange={setFilterState}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {uniqueStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterCommodity} onValueChange={setFilterCommodity}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Commodities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Commodities</SelectItem>
                {uniqueCommodities.map((commodity) => (
                  <SelectItem key={commodity} value={commodity}>
                    {commodity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={() => setShowPerKg(!showPerKg)} className="whitespace-nowrap">
              {showPerKg ? "Per Kg" : "Per Quintal"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("name")} className="h-auto p-0 font-semibold">
                    Commodity <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>State/Market</TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("currentPrice")}
                    className="h-auto p-0 font-semibold"
                  >
                    Price <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("changePercent")}
                    className="h-auto p-0 font-semibold"
                  >
                    24h Change <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Volume</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Volatility</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.commodities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading market data...</p>
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    <p>No commodities found matching your criteria</p>
                    <p className="text-sm mt-2">Try adjusting your filters or search terms</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedData.slice(0, 20).map((commodity) => (
                  <TableRow key={commodity.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleWatchlist(commodity.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Star
                          className={`h-4 w-4 ${
                            state.watchlist.includes(commodity.id)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </Button>
                    </TableCell>

                    <TableCell>
                      <div>
                        <div className="font-medium">{commodity.name}</div>
                        <div className="text-xs text-muted-foreground">{commodity.category}</div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <div className="font-medium">{commodity.state}</div>
                        <div className="text-xs text-muted-foreground">{commodity.market}</div>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div>
                        <div className="font-medium">
                          ₹
                          {showPerKg && commodity.unit.includes("quintal")
                            ? (commodity.currentPrice / 100).toFixed(2)
                            : commodity.currentPrice.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {showPerKg && commodity.unit.includes("quintal") ? "₹/kg" : commodity.unit}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div
                        className={`flex items-center justify-end space-x-1 ${
                          commodity.changePercent > 0
                            ? "text-green-600"
                            : commodity.changePercent < 0
                              ? "text-red-600"
                              : "text-muted-foreground"
                        }`}
                      >
                        {commodity.changePercent > 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : commodity.changePercent < 0 ? (
                          <TrendingDown className="h-3 w-3" />
                        ) : null}
                        <span className="font-medium">
                          {commodity.changePercent > 0 ? "+" : ""}
                          {commodity.changePercent.toFixed(2)}%
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ₹
                        {showPerKg && commodity.unit.includes("quintal")
                          ? (commodity.change24h / 100).toFixed(2)
                          : commodity.change24h.toFixed(2)}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="font-medium">{commodity.volume.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">units</div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          commodity.trend === "bullish"
                            ? "default"
                            : commodity.trend === "bearish"
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {commodity.trend}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          commodity.volatility === "high"
                            ? "border-red-500 text-red-600"
                            : commodity.volatility === "medium"
                              ? "border-yellow-500 text-yellow-600"
                              : "border-green-500 text-green-600"
                        }`}
                      >
                        {commodity.volatility}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dispatch({ type: "SET_SELECTED_COMMODITY", payload: commodity })}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
