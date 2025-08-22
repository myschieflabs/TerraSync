"use client"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarketHeader } from "@/components/market-header"
import { MarketStatusBar } from "@/components/market-status-bar"
import { LivePriceMonitor } from "@/components/live-price-monitor"
import { MarketIntelligence } from "@/components/market-intelligence"
import { TechnicalAnalysis } from "@/components/technical-analysis"
import { NewsAndAlerts } from "@/components/news-and-alerts"
import { FarmTally } from "@/components/farm-tally"
import { PlantDiseaseDatabase } from "@/components/plant-disease-database"
import { MarketProvider } from "@/contexts/market-context"
import { ThemeProvider } from "@/components/theme-provider"
import { TrendingUp, Calculator, Leaf } from "lucide-react"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("market")

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <MarketProvider>
        <div className="min-h-screen bg-background text-foreground">
          <MarketHeader />
          <MarketStatusBar />

          <main className="container mx-auto px-4 py-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="market" className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Market Intelligence</span>
                </TabsTrigger>
                <TabsTrigger value="tally" className="flex items-center space-x-2">
                  <Calculator className="h-4 w-4" />
                  <span>Farm Tally</span>
                </TabsTrigger>
                <TabsTrigger value="diseases" className="flex items-center space-x-2">
                  <Leaf className="h-4 w-4" />
                  <span>Plant Disease Database</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="market" className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                  <div className="xl:col-span-3 space-y-6">
                    <LivePriceMonitor />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <MarketIntelligence />
                      <TechnicalAnalysis />
                    </div>
                  </div>
                  <div className="xl:col-span-1">
                    <NewsAndAlerts />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tally">
                <FarmTally />
              </TabsContent>

              <TabsContent value="diseases">
                <PlantDiseaseDatabase />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </MarketProvider>
    </ThemeProvider>
  )
}
