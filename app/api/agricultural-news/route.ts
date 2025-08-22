import { NextResponse } from "next/server"

// Mock news API endpoint
export async function GET() {
  try {
    // In production, this would fetch from real news APIs
    const mockNews = {
      articles: [
        {
          title: "Monsoon Forecast Boosts Agricultural Outlook",
          description:
            "IMD predicts normal rainfall across major agricultural regions, expected to benefit Kharif crops",
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          source: { name: "Agricultural Ministry" },
        },
        {
          title: "Export Demand Drives Spice Prices Higher",
          description: "International demand for Indian spices reaches new highs, particularly turmeric and cardamom",
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          source: { name: "Spices Board India" },
        },
        {
          title: "Government Announces MSP Increase",
          description: "Minimum Support Prices for major crops increased by 4-6% for the upcoming season",
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          source: { name: "Ministry of Agriculture" },
        },
      ],
    }

    return NextResponse.json(mockNews)
  } catch (error) {
    console.error("News API Error:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
