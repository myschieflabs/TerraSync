"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { MarketState, MarketAction } from "@/types/market"
import { fetchRealMarketData, updatePricesWithVolatility } from "@/lib/market-data"

const MarketContext = createContext<{
  state: MarketState
  dispatch: React.Dispatch<MarketAction>
} | null>(null)

const initialState: MarketState = {
  commodities: [],
  watchlist: [],
  alerts: [],
  isMarketOpen: true,
  lastUpdate: new Date(),
  selectedCommodity: null,
  filters: {
    state: "all",
    commodity: "all",
    priceRange: [0, 1000000], // Increased range
    sortBy: "name",
    sortOrder: "asc",
  },
}

function marketReducer(state: MarketState, action: MarketAction): MarketState {
  switch (action.type) {
    case "SET_COMMODITIES":
      return { ...state, commodities: action.payload }
    case "UPDATE_PRICES":
      const updatedCommodities =
        typeof action.payload === "function" ? action.payload(state.commodities) : action.payload
      return {
        ...state,
        commodities: updatedCommodities,
        lastUpdate: new Date(),
      }
    case "ADD_TO_WATCHLIST":
      return {
        ...state,
        watchlist: [...state.watchlist, action.payload],
      }
    case "REMOVE_FROM_WATCHLIST":
      return {
        ...state,
        watchlist: state.watchlist.filter((id) => id !== action.payload),
      }
    case "SET_SELECTED_COMMODITY":
      return { ...state, selectedCommodity: action.payload }
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } }
    case "ADD_ALERT":
      return { ...state, alerts: [...state.alerts, action.payload] }
    default:
      return state
  }
}

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(marketReducer, initialState)

  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log("Initializing market data...")
        const initialData = await fetchRealMarketData()
        console.log("Fetched data:", initialData.length, "items")

        if (initialData.length === 0) {
          console.warn("No data received, generating mock data")
          const { generateMockData } = await import("@/lib/market-data")
          const mockData = generateMockData()
          dispatch({ type: "SET_COMMODITIES", payload: mockData })
        } else {
          dispatch({ type: "SET_COMMODITIES", payload: initialData })
        }
      } catch (error) {
        console.error("Failed to initialize market data:", error)
        const { generateMockData } = await import("@/lib/market-data")
        const mockData = generateMockData()
        dispatch({ type: "SET_COMMODITIES", payload: mockData })
      }
    }

    initializeData()

    const interval = setInterval(async () => {
      try {
        dispatch({
          type: "UPDATE_PRICES",
          payload: (prevCommodities) => {
            if (prevCommodities.length === 0) {
              console.warn("No commodities to update")
              return []
            }
            console.log("Updating prices for", prevCommodities.length, "commodities")
            return updatePricesWithVolatility(prevCommodities)
          },
        })
      } catch (error) {
        console.error("Failed to update prices:", error)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return <MarketContext.Provider value={{ state, dispatch }}>{children}</MarketContext.Provider>
}

export function useMarket() {
  const context = useContext(MarketContext)
  if (!context) {
    throw new Error("useMarket must be used within MarketProvider")
  }
  return context
}
