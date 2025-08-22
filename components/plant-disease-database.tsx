"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Leaf, AlertTriangle, CheckCircle, Camera, Upload, X, Zap } from "lucide-react"

interface Disease {
  id: string
  name: string
  crop: string
  type: "fungal" | "bacterial" | "viral" | "pest"
  severity: "low" | "medium" | "high"
  symptoms: string[]
  causes: string[]
  treatment: {
    organic: string[]
    chemical: string[]
    preventive: string[]
  }
  image?: string
}

const diseases: Disease[] = [
  {
    id: "1",
    name: "Blast Disease",
    crop: "Rice",
    type: "fungal",
    severity: "high",
    symptoms: [
      "Diamond-shaped lesions on leaves",
      "Brown spots with gray centers",
      "Neck rot in severe cases",
      "Reduced grain filling",
    ],
    causes: ["High humidity", "Excessive nitrogen fertilization", "Dense planting", "Poor air circulation"],
    treatment: {
      organic: [
        "Neem oil spray (5ml/liter)",
        "Trichoderma application",
        "Proper field sanitation",
        "Resistant varieties",
      ],
      chemical: [
        "Tricyclazole 75% WP @ 0.6g/liter",
        "Propiconazole 25% EC @ 1ml/liter",
        "Carbendazim 50% WP @ 1g/liter",
      ],
      preventive: [
        "Use certified seeds",
        "Maintain proper spacing",
        "Balanced fertilization",
        "Avoid overhead irrigation",
      ],
    },
  },
  {
    id: "2",
    name: "Late Blight",
    crop: "Tomato",
    type: "fungal",
    severity: "high",
    symptoms: [
      "Dark water-soaked spots on leaves",
      "White fuzzy growth on leaf undersides",
      "Brown lesions on stems",
      "Fruit rot with dark patches",
    ],
    causes: ["Cool, wet weather", "High humidity (>90%)", "Poor air circulation", "Overhead watering"],
    treatment: {
      organic: [
        "Copper sulfate spray",
        "Baking soda solution (1 tsp/liter)",
        "Milk spray (1:10 ratio)",
        "Remove affected plants",
      ],
      chemical: ["Mancozeb 75% WP @ 2g/liter", "Metalaxyl + Mancozeb @ 2g/liter", "Cymoxanil + Mancozeb @ 2g/liter"],
      preventive: ["Drip irrigation", "Proper plant spacing", "Crop rotation", "Resistant varieties"],
    },
  },
  {
    id: "3",
    name: "Aphids",
    crop: "Cotton",
    type: "pest",
    severity: "medium",
    symptoms: [
      "Small green/black insects on leaves",
      "Sticky honeydew on plants",
      "Yellowing and curling leaves",
      "Stunted plant growth",
    ],
    causes: ["Warm weather", "Excessive nitrogen", "Lack of natural predators", "Stressed plants"],
    treatment: {
      organic: ["Neem oil spray", "Insecticidal soap", "Ladybug release", "Reflective mulch"],
      chemical: [
        "Imidacloprid 17.8% SL @ 0.3ml/liter",
        "Thiamethoxam 25% WG @ 0.2g/liter",
        "Acetamiprid 20% SP @ 0.2g/liter",
      ],
      preventive: ["Regular monitoring", "Balanced fertilization", "Encourage beneficial insects", "Remove weeds"],
    },
  },
  {
    id: "4",
    name: "Powdery Mildew",
    crop: "Wheat",
    type: "fungal",
    severity: "medium",
    symptoms: [
      "White powdery coating on leaves",
      "Yellowing of affected areas",
      "Premature leaf senescence",
      "Reduced grain quality",
    ],
    causes: ["High humidity with dry conditions", "Poor air circulation", "Dense canopy", "Susceptible varieties"],
    treatment: {
      organic: [
        "Sulfur dust application",
        "Milk spray (1:10 ratio)",
        "Potassium bicarbonate spray",
        "Proper field sanitation",
      ],
      chemical: ["Propiconazole 25% EC @ 1ml/liter", "Triadimefon 25% WP @ 1g/liter", "Hexaconazole 5% SC @ 2ml/liter"],
      preventive: ["Resistant varieties", "Proper spacing", "Avoid excessive nitrogen", "Timely sowing"],
    },
  },
]

export function PlantDiseaseDatabase() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCrop, setSelectedCrop] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null)
  const [scanModalOpen, setScanModalOpen] = useState(false)
  const [scanStep, setScanStep] = useState<"upload" | "analyzing" | "results">("upload")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [scanResults, setScanResults] = useState<Disease[]>([])
  const [symptoms, setSymptoms] = useState("")
  const [cropType, setCropType] = useState("")

  const crops = [...new Set(diseases.map((d) => d.crop))].sort()
  const types = [...new Set(diseases.map((d) => d.type))].sort()

  const filteredDiseases = diseases.filter((disease) => {
    const matchesSearch =
      disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disease.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disease.symptoms.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCrop = selectedCrop === "all" || disease.crop === selectedCrop
    const matchesType = selectedType === "all" || disease.type === selectedType

    return matchesSearch && matchesCrop && matchesType
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleScanDisease = async () => {
    setScanStep("analyzing")

    // Simulate AI analysis
    setTimeout(() => {
      // Mock disease detection based on crop type and symptoms
      let possibleDiseases = diseases.filter((disease) => {
        if (cropType && disease.crop.toLowerCase() !== cropType.toLowerCase()) return false
        if (symptoms) {
          return disease.symptoms.some(
            (symptom) =>
              symptom.toLowerCase().includes(symptoms.toLowerCase()) ||
              symptoms.toLowerCase().includes(symptom.toLowerCase()),
          )
        }
        return true
      })

      // If no specific matches, show random diseases for demo
      if (possibleDiseases.length === 0) {
        possibleDiseases = diseases.slice(0, 2)
      }

      setScanResults(possibleDiseases.slice(0, 3))
      setScanStep("results")
    }, 3000)
  }

  const resetScan = () => {
    setScanStep("upload")
    setUploadedImage(null)
    setScanResults([])
    setSymptoms("")
    setCropType("")
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Leaf className="h-5 w-5" />
            <span>Plant Disease Database</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search diseases, crops, symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Crops" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                {crops.map((crop) => (
                  <SelectItem key={crop} value={crop}>
                    {crop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog open={scanModalOpen} onOpenChange={setScanModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Camera className="h-4 w-4 mr-2" />
                  Scan Disease
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-green-500" />
                    <span>AI Disease Scanner</span>
                  </DialogTitle>
                </DialogHeader>

                {scanStep === "upload" && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
                        {uploadedImage ? (
                          <div className="space-y-4">
                            <img
                              src={uploadedImage || "/placeholder.svg"}
                              alt="Uploaded plant"
                              className="max-h-48 mx-auto rounded-lg"
                            />
                            <Button variant="outline" size="sm" onClick={() => setUploadedImage(null)}>
                              <X className="h-4 w-4 mr-2" />
                              Remove Image
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                            <div>
                              <Label htmlFor="image-upload" className="cursor-pointer">
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                  Click to upload plant image or drag and drop
                                </div>
                                <div className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</div>
                              </Label>
                              <Input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="crop-type">Crop Type</Label>
                        <Select value={cropType} onValueChange={setCropType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select crop" />
                          </SelectTrigger>
                          <SelectContent>
                            {crops.map((crop) => (
                              <SelectItem key={crop} value={crop}>
                                {crop}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="symptoms">Observed Symptoms</Label>
                        <Textarea
                          id="symptoms"
                          placeholder="Describe what you see (spots, discoloration, etc.)"
                          value={symptoms}
                          onChange={(e) => setSymptoms(e.target.value)}
                          className="min-h-[80px]"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleScanDisease}
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={!cropType && !symptoms}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Analyze Disease
                    </Button>
                  </div>
                )}

                {scanStep === "analyzing" && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold mb-2">Analyzing Plant Disease...</h3>
                    <p className="text-muted-foreground">
                      Our AI is examining the image and symptoms to identify potential diseases
                    </p>
                  </div>
                )}

                {scanStep === "results" && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                      <h3 className="text-lg font-semibold">Analysis Complete</h3>
                      <p className="text-muted-foreground">Found {scanResults.length} possible matches</p>
                    </div>

                    <div className="space-y-3">
                      {scanResults.map((disease, index) => (
                        <div
                          key={disease.id}
                          className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50"
                          onClick={() => {
                            setSelectedDisease(disease)
                            setScanModalOpen(false)
                            resetScan()
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{disease.name}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={
                                  disease.severity === "high"
                                    ? "destructive"
                                    : disease.severity === "medium"
                                      ? "default"
                                      : "secondary"
                                }
                              >
                                {disease.severity}
                              </Badge>
                              <Badge variant="outline">{disease.type}</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{disease.symptoms.slice(0, 2).join(", ")}</p>
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              {disease.crop}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={resetScan} className="flex-1 bg-transparent">
                        Scan Another
                      </Button>
                      <Button onClick={() => setScanModalOpen(false)} className="flex-1">
                        Close
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Disease List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Diseases ({filteredDiseases.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {filteredDiseases.map((disease) => (
              <div
                key={disease.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedDisease?.id === disease.id ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedDisease(disease)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm text-foreground">{disease.name}</h4>
                  <Badge
                    variant={
                      disease.severity === "high"
                        ? "destructive"
                        : disease.severity === "medium"
                          ? "default"
                          : "secondary"
                    }
                    className="text-xs"
                  >
                    {disease.severity}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {disease.crop}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {disease.type}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Disease Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{selectedDisease ? selectedDisease.name : "Select a disease to view details"}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDisease ? (
              <Tabs defaultValue="symptoms" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                  <TabsTrigger value="causes">Causes</TabsTrigger>
                  <TabsTrigger value="treatment">Treatment</TabsTrigger>
                  <TabsTrigger value="prevention">Prevention</TabsTrigger>
                </TabsList>

                <TabsContent value="symptoms" className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <h3 className="font-semibold text-foreground">Symptoms to Look For</h3>
                  </div>
                  <ul className="space-y-2">
                    {selectedDisease.symptoms.map((symptom, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-foreground">{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="causes" className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <h3 className="font-semibold text-foreground">Common Causes</h3>
                  </div>
                  <ul className="space-y-2">
                    {selectedDisease.causes.map((cause, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-foreground">{cause}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="treatment" className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-green-600 dark:text-green-400">Organic Treatment</h3>
                    <ul className="space-y-2">
                      {selectedDisease.treatment.organic.map((treatment, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Leaf className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-foreground">{treatment}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-blue-600 dark:text-blue-400">Chemical Treatment</h3>
                    <ul className="space-y-2">
                      {selectedDisease.treatment.chemical.map((treatment, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm text-foreground">{treatment}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="prevention" className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold text-foreground">Prevention Measures</h3>
                  </div>
                  <ul className="space-y-2">
                    {selectedDisease.treatment.preventive.map((prevention, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{prevention}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Leaf className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  Select a disease from the list to view detailed information about symptoms, causes, and treatments.
                </p>
                <p className="mt-2 text-sm">
                  Or use the <strong>Scan Disease</strong> feature to identify diseases from plant images.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
