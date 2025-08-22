"use client"

import { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { CommodityData } from "@/types/market"

interface PriceChartProps {
  commodity: CommodityData
}

export function PriceChart({ commodity }: PriceChartProps) {
  const chartData = useMemo(() => {
    if (!commodity) {
      console.log("No commodity provided to chart")
      return []
    }

    console.log("Generating chart data for:", commodity.name, "Price:", commodity.currentPrice)

    // Generate simple mock historical data
    const data = []
    const basePrice = commodity.currentPrice || 1000

    // Generate 7 days of data
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      // Simple price variation
      const variation = (Math.random() - 0.5) * 0.1 // 10% variation
      const price = basePrice * (1 + variation)

      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        price: Math.round(price * 100) / 100,
        timestamp: date.getTime(),
      })
    }

    // Ensure current price is the last point
    if (data.length > 0) {
      data[data.length - 1].price = basePrice
    }

    console.log("Generated chart data:", data)
    return data
  }, [commodity])

  if (!commodity) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-muted/20 rounded border-2 border-dashed border-muted-foreground/20">
        <div className="text-center p-4">
          <div className="text-muted-foreground text-sm">No commodity selected</div>
          <div className="text-xs text-muted-foreground mt-1">Select a commodity to view price chart</div>
        </div>
      </div>
    )
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-muted/20 rounded border-2 border-dashed border-muted-foreground/20">
        <div className="text-center p-4">
          <div className="text-muted-foreground text-sm">No chart data available</div>
          <div className="text-xs text-muted-foreground mt-1">Chart data could not be generated</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
          <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `₹${value}`} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "6px",
              color: "#F9FAFB",
            }}
            formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, "Price"]}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#3B82F6" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
