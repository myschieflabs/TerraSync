"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calculator, Plus, Trash2, Download, TrendingUp, TrendingDown } from "lucide-react"

interface TallyEntry {
  id: string
  date: string
  type: "income" | "expense"
  category: string
  description: string
  amount: number
  quantity?: number
  unit?: string
}

export function FarmTally() {
  const [entries, setEntries] = useState<TallyEntry[]>([
    {
      id: "1",
      date: "2024-01-15",
      type: "income",
      category: "Crop Sale",
      description: "Rice harvest sale",
      amount: 45000,
      quantity: 1500,
      unit: "kg",
    },
    {
      id: "2",
      date: "2024-01-10",
      type: "expense",
      category: "Seeds",
      description: "Wheat seeds purchase",
      amount: 8500,
      quantity: 50,
      unit: "kg",
    },
    {
      id: "3",
      date: "2024-01-08",
      type: "expense",
      category: "Fertilizer",
      description: "NPK fertilizer",
      amount: 12000,
      quantity: 200,
      unit: "kg",
    },
  ])

  const [newEntry, setNewEntry] = useState({
    type: "income" as "income" | "expense",
    category: "",
    description: "",
    amount: "",
    quantity: "",
    unit: "",
  })

  const categories = {
    income: ["Crop Sale", "Livestock Sale", "Dairy Products", "Government Subsidy", "Other Income"],
    expense: ["Seeds", "Fertilizer", "Pesticides", "Labor", "Equipment", "Fuel", "Irrigation", "Other Expense"],
  }

  const units = ["kg", "quintal", "ton", "liters", "pieces", "acres", "hours"]

  const addEntry = () => {
    if (newEntry.category && newEntry.description && newEntry.amount) {
      const entry: TallyEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split("T")[0],
        type: newEntry.type,
        category: newEntry.category,
        description: newEntry.description,
        amount: Number.parseFloat(newEntry.amount),
        quantity: newEntry.quantity ? Number.parseFloat(newEntry.quantity) : undefined,
        unit: newEntry.unit || undefined,
      }
      setEntries([entry, ...entries])
      setNewEntry({
        type: "income",
        category: "",
        description: "",
        amount: "",
        quantity: "",
        unit: "",
      })
    }
  }

  const deleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id))
  }

  const totalIncome = entries.filter((e) => e.type === "income").reduce((sum, e) => sum + e.amount, 0)
  const totalExpense = entries.filter((e) => e.type === "expense").reduce((sum, e) => sum + e.amount, 0)
  const netProfit = totalIncome - totalExpense

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-2xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Expense</p>
                <p className="text-2xl font-bold text-red-600">₹{totalExpense.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calculator className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ₹{netProfit.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div>
                <p className="text-sm text-muted-foreground">Total Entries</p>
                <p className="text-2xl font-bold">{entries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add New Entry */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add New Entry</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Type</Label>
              <Select
                value={newEntry.type}
                onValueChange={(value: "income" | "expense") => setNewEntry({ ...newEntry, type: value, category: "" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Category</Label>
              <Select
                value={newEntry.category}
                onValueChange={(value) => setNewEntry({ ...newEntry, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories[newEntry.type].map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Description</Label>
              <Input
                value={newEntry.description}
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                placeholder="Enter description"
              />
            </div>

            <div>
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                value={newEntry.amount}
                onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Quantity (Optional)</Label>
                <Input
                  type="number"
                  value={newEntry.quantity}
                  onChange={(e) => setNewEntry({ ...newEntry, quantity: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Unit</Label>
                <Select value={newEntry.unit} onValueChange={(value) => setNewEntry({ ...newEntry, unit: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={addEntry} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Entries</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.slice(0, 10).map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={entry.type === "income" ? "default" : "destructive"}>{entry.type}</Badge>
                      </TableCell>
                      <TableCell>{entry.category}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          entry.type === "income" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        ₹{entry.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{entry.quantity && entry.unit ? `${entry.quantity} ${entry.unit}` : "-"}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEntry(entry.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
