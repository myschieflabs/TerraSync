"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Bell, Settings, Moon, Sun, ShovelIcon,TrendingUp, Download, Filter } from "lucide-react"
import { useTheme } from "next-themes"
import { useMarket } from "@/contexts/market-context"

export function MarketHeader() {
  const { theme, setTheme } = useTheme()
  const { state } = useMarket()
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <header className="border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/95">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold">TerraSync</h1>
                  <p className="text-xs text-muted-foreground">Smart Farming</p>
                </div>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                LIVE
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-64 h-10 bg-muted rounded-md animate-pulse" />
              <div className="w-20 h-10 bg-muted rounded-md animate-pulse" />
              <div className="w-10 h-10 bg-muted rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/95 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ShovelIcon className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Terra Sync</h1>
                <p className="text-xs text-muted-foreground">Smart Agriculture</p>
              </div>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50 dark:bg-green-950/20">
              LIVE
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search commodities, states..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-background"
              />
            </div>

            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
