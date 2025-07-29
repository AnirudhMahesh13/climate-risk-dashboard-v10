"use client"

import type React from "react"

import { useState, useMemo, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Search, X, TrendingUp, Filter, MapPin, Upload, Download, AlertCircle, HelpCircle, User } from "lucide-react"
import { Stepper } from "@/components/stepper"
import {
  mockProperties,
  formatCurrency,
  formatSquareFootage,
  getRiskColor,
  getCertificationLabel,
} from "@/lib/mock-data"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Filters {
  propertyType: string
  riskRating: string
  greenCertification: string
  ltvRange: [number, number]
  dscrRange: [number, number]
  country: string
}

export default function AssetSearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null) // Changed to single selection
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    propertyType: "all",
    riskRating: "all",
    greenCertification: "all",
    ltvRange: [0, 100],
    dscrRange: [0, 5],
    country: "all",
  })

  const [uploadedProperties, setUploadedProperties] = useState<any[]>([])
  const [uploadError, setUploadError] = useState<string>("")
  const [showUploadSuccess, setShowUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseCSV = (csvText: string) => {
    const lines = csvText.trim().split("\n")
    if (lines.length < 2) throw new Error("CSV must contain at least a header and one data row")

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
    const requiredHeaders = [
      "address",
      "city",
      "province_or_state",
      "country",
      "value_millions",
      "type",
      "year_built",
      "size_sqft",
      "heat_source",
      "green_certifications",
      "ttm_revenue",
      "opex",
      "noi",
      "loan_value",
      "dscr",
      "ltv",
      "energy_efficiency",
      "retrofit_cost",
      "expected_reg_shock",
      "client_name", // Added client name to required headers
    ]

    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h))
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`)
    }

    const properties = []
    for (let i = 1; i < lines.length && i <= 101; i++) {
      // Max 100 rows + header
      const values = lines[i].split(",").map((v) => v.trim())
      if (values.length !== headers.length) continue

      try {
        const property = {
          id: Date.now() + i, // Unique ID
          address: values[headers.indexOf("address")],
          city: values[headers.indexOf("city")],
          state: values[headers.indexOf("province_or_state")],
          country: values[headers.indexOf("country")],
          type: values[headers.indexOf("type")] as any,
          value: Number.parseFloat(values[headers.indexOf("value_millions")]) * 1000000,
          size: Number.parseInt(values[headers.indexOf("size_sqft")]),
          yearBuilt: Number.parseInt(values[headers.indexOf("year_built")]),
          riskLevel:
            Number.parseFloat(values[headers.indexOf("expected_reg_shock")]) > 3.5
              ? "high"
              : Number.parseFloat(values[headers.indexOf("expected_reg_shock")]) > 2.5
                ? "medium"
                : "low",
          riskScore: Number.parseFloat(values[headers.indexOf("expected_reg_shock")]),
          ltv: Number.parseFloat(values[headers.indexOf("ltv")]),
          dscr: Number.parseFloat(values[headers.indexOf("dscr")]),
          heatSource: values[headers.indexOf("heat_source")] as any,
          greenCertifications: values[headers.indexOf("green_certifications")] as any,
          ttmRevenue: Number.parseFloat(values[headers.indexOf("ttm_revenue")]),
          annualDebtPayment: Number.parseFloat(values[headers.indexOf("loan_value")]) * 0.08, // Estimate
          netOperatingIncome: Number.parseFloat(values[headers.indexOf("noi")]),
          operatingExpenses: Number.parseFloat(values[headers.indexOf("opex")]),
          clientName: values[headers.indexOf("client_name")], // Added client name parsing
          isUserImported: true,
        }
        properties.push(property)
      } catch (error) {
        console.warn(`Skipping malformed row ${i}:`, error)
      }
    }

    return properties
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB")
      return
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setUploadError("Please upload a CSV file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string
        const newProperties = parseCSV(csvText)
        setUploadedProperties((prev) => [...prev, ...newProperties])
        setUploadError("")
        setShowUploadSuccess(true)
        setTimeout(() => setShowUploadSuccess(false), 3000)
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : "Failed to parse CSV")
      }
    }
    reader.readAsText(file)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const downloadTemplate = () => {
    const headers = [
      "address",
      "city",
      "province_or_state",
      "country",
      "value_millions",
      "type",
      "year_built",
      "size_sqft",
      "heat_source",
      "green_certifications",
      "ttm_revenue",
      "opex",
      "noi",
      "loan_value",
      "dscr",
      "ltv",
      "energy_efficiency",
      "retrofit_cost",
      "expected_reg_shock",
      "client_name", // Added to template
    ]
    const sampleRow = [
      "123 Main Street",
      "Toronto",
      "ON",
      "Canada",
      "45",
      "Office",
      "2015",
      "250000",
      "natural-gas",
      "leed-gold",
      "8500000",
      "2300000",
      "6200000",
      "32000000",
      "2.21",
      "71.1",
      "B+",
      "2100000",
      "3.2",
      "ABC Real Estate Corp", // Added sample client name
    ]

    const csvContent = [headers.join(","), sampleRow.join(",")].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "property_template.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  // Filter and search properties
  const filteredProperties = useMemo(() => {
    let results = [...mockProperties, ...uploadedProperties]

    // Text search - now includes client name
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (property) =>
          property.address.toLowerCase().includes(query) ||
          property.city.toLowerCase().includes(query) ||
          property.state.toLowerCase().includes(query) ||
          property.country.toLowerCase().includes(query) ||
          property.type.toLowerCase().includes(query) ||
          property.clientName.toLowerCase().includes(query), // Added client name search
      )
    }

    // Apply filters
    if (filters.propertyType !== "all") {
      results = results.filter((property) => {
        const propertyTypeKebab = property.type
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
        return propertyTypeKebab === filters.propertyType
      })
    }

    if (filters.riskRating !== "all") {
      results = results.filter((property) => property.riskLevel === filters.riskRating)
    }

    if (filters.greenCertification !== "all") {
      results = results.filter((property) => property.greenCertifications === filters.greenCertification)
    }

    if (filters.country !== "all") {
      results = results.filter((property) => property.country.toLowerCase() === filters.country)
    }

    // LTV range filter
    results = results.filter((property) => property.ltv >= filters.ltvRange[0] && property.ltv <= filters.ltvRange[1])

    // DSCR range filter
    results = results.filter(
      (property) => property.dscr >= filters.dscrRange[0] && property.dscr <= filters.dscrRange[1],
    )

    return results
  }, [searchQuery, filters, uploadedProperties])

  const handlePropertySelect = (propertyId: number, checked: boolean) => {
    if (checked) {
      setSelectedProperty(propertyId) // Set single selection
    } else {
      setSelectedProperty(null) // Clear selection
    }
  }

  const removeProperty = () => {
    setSelectedProperty(null) // Clear single selection
  }

  const clearAllFilters = () => {
    setFilters({
      propertyType: "all",
      riskRating: "all",
      greenCertification: "all",
      ltvRange: [0, 100],
      dscrRange: [0, 5],
      country: "all",
    })
    setSearchQuery("")
  }

  const selectedProp = selectedProperty ? mockProperties.find((p) => p.id === selectedProperty) : null
  const totalValue = selectedProp ? selectedProp.value : 0

  // Create URL with selected property ID
  const getDetailsUrl = () => {
    if (!selectedProperty) return "#"
    return `/asset/details?properties=${selectedProperty}&current=1`
  }

  const activeFiltersCount = Object.values(filters).filter((value) => {
    if (Array.isArray(value)) {
      return value[0] !== 0 || value[1] !== (value === filters.ltvRange ? 100 : 5)
    }
    return value !== "all"
  }).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <Stepper steps={["Search", "Overview", "Analysis"]} currentStep={0} type="asset" />

        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8">
          {/* Main Content - 3 columns */}
          <div className="col-span-3">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative mb-4">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <Input
                  placeholder="Search by address, city, state/province, country, or client name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-16 h-16 text-lg rounded-full border-2 focus:border-blue-500 shadow-lg"
                />
              </div>

              {/* Upload Section */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full shadow-md hover:shadow-lg bg-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload CSV
                  </Button>
                  <Popover>
                    <PopoverTrigger>
                      <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-3">
                        <p className="text-sm font-semibold">CSV Upload Requirements:</p>
                        <ul className="text-xs space-y-1 text-gray-600">
                          <li>• Max file size: 5MB</li>
                          <li>• Max 100 properties per upload</li>
                          <li>• Must include all required headers</li>
                          <li>• Data is session-persistent only</li>
                          <li>• Include client_name column</li>
                        </ul>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={downloadTemplate}
                          className="w-full rounded-full bg-transparent"
                        >
                          <Download className="w-3 h-3 mr-2" />
                          Download Template
                        </Button>
                      </div>
                      <p>
                        <strong>Baseline:</strong> Current policy trajectory with moderate transition action
                      </p>
                      <p>
                        <strong>Aggressive Transition:</strong> Rapid decarbonization with strong policy support
                      </p>
                      <p>
                        <strong>Delayed Policy:</strong> Slower transition action with policy uncertainty
                      </p>
                    </PopoverContent>
                  </Popover>
                  {uploadedProperties.length > 0 && (
                    <Badge
                      className="rounded-full px-4 py-2 text-sm font-medium"
                      style={{ backgroundColor: "#10b981", color: "white" }}
                    >
                      User Imported ({uploadedProperties.length})
                    </Badge>
                  )}
                </div>
              </div>

              <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />

              {/* Upload Alerts */}
              {uploadError && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{uploadError}</AlertDescription>
                </Alert>
              )}

              {showUploadSuccess && (
                <Alert className="mb-4 border-green-200 bg-green-50">
                  <AlertCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Successfully imported {uploadedProperties.length} properties from CSV
                  </AlertDescription>
                </Alert>
              )}

              {/* Filter Toggle and Active Filters */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant={showFilters ? "default" : "outline"}
                    onClick={() => setShowFilters(!showFilters)}
                    className="rounded-full"
                    style={{ backgroundColor: showFilters ? "#2B6CA9" : "transparent" }}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                  </Button>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" onClick={clearAllFilters} className="rounded-full text-gray-600">
                      Clear All
                    </Button>
                  )}
                </div>
                <div className="text-sm text-gray-600">{filteredProperties.length} properties found</div>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <Card className="rounded-2xl shadow-lg mb-6">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-3 gap-6">
                      {/* Property Type */}
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Property Type</Label>
                        <Select
                          value={filters.propertyType}
                          onValueChange={(value) => setFilters({ ...filters, propertyType: value })}
                        >
                          <SelectTrigger className="rounded-full h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="multi-family">Multi-family</SelectItem>
                            <SelectItem value="office">Office</SelectItem>
                            <SelectItem value="industrial">Industrial</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="hospitality">Hospitality</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Risk Rating */}
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Risk Rating</Label>
                        <Select
                          value={filters.riskRating}
                          onValueChange={(value) => setFilters({ ...filters, riskRating: value })}
                        >
                          <SelectTrigger className="rounded-full h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Risk Levels</SelectItem>
                            <SelectItem value="low">Low Risk</SelectItem>
                            <SelectItem value="medium">Medium Risk</SelectItem>
                            <SelectItem value="high">High Risk</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Country */}
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Country</Label>
                        <Select
                          value={filters.country}
                          onValueChange={(value) => setFilters({ ...filters, country: value })}
                        >
                          <SelectTrigger className="rounded-full h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Countries</SelectItem>
                            <SelectItem value="usa">United States</SelectItem>
                            <SelectItem value="canada">Canada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Green Certification */}
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Green Certification</Label>
                        <Select
                          value={filters.greenCertification}
                          onValueChange={(value) => setFilters({ ...filters, greenCertification: value })}
                        >
                          <SelectTrigger className="rounded-full h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Certifications</SelectItem>
                            <SelectItem value="LEED Gold">LEED Gold</SelectItem>
                            <SelectItem value="LEED Platinum">LEED Platinum</SelectItem>
                            <SelectItem value="BOMA BEST Gold">BOMA BEST Gold</SelectItem>
                            <SelectItem value="BOMA BEST Platinum">BOMA BEST Platinum</SelectItem>
                            <SelectItem value="BREEAM Excellent">BREEAM Excellent</SelectItem>
                            <SelectItem value="BREEAM Outstanding">BREEAM Outstanding</SelectItem>
                            <SelectItem value="ENERGY STAR (85)">ENERGY STAR (85)</SelectItem>
                            <SelectItem value="ENERGY STAR for New Homes (v12.6+)">
                              ENERGY STAR for New Homes (v12.6+)
                            </SelectItem>
                            <SelectItem value="Toronto Green Standard (v4) (Tier 2)">
                              Toronto Green Standard (v4) (Tier 2)
                            </SelectItem>
                            <SelectItem value="Passive House Institute – EnerPHit">
                              Passive House Institute – EnerPHit
                            </SelectItem>
                            <SelectItem value="BC Energy Step Code (Step 3)">BC Energy Step Code (Step 3)</SelectItem>
                            <SelectItem value="UK EPC (A)">UK EPC (A)</SelectItem>
                            <SelectItem value="UK EPC (B)">UK EPC (B)</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* LTV Range */}
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-4 block">
                          LTV Range: {filters.ltvRange[0]}% - {filters.ltvRange[1]}%
                        </Label>
                        <div className="px-3">
                          <Slider
                            value={filters.ltvRange}
                            onValueChange={(value) => setFilters({ ...filters, ltvRange: value as [number, number] })}
                            max={100}
                            min={0}
                            step={5}
                            className="w-full"
                          />
                        </div>
                      </div>

                      {/* DSCR Range */}
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-4 block">
                          DSCR Range: {filters.dscrRange[0].toFixed(1)} - {filters.dscrRange[1].toFixed(1)}
                        </Label>
                        <div className="px-3">
                          <Slider
                            value={filters.dscrRange}
                            onValueChange={(value) => setFilters({ ...filters, dscrRange: value as [number, number] })}
                            max={5}
                            min={0}
                            step={0.1}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Selected Property Pill */}
            {selectedProperty && selectedProp && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3" style={{ color: "#112A43" }}>
                  Selected Property
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Badge
                    className="rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2"
                    style={{ backgroundColor: "#99EFE4", color: "#112A43" }}
                  >
                    {selectedProp.address}
                    <X className="w-4 h-4 cursor-pointer hover:text-red-600" onClick={removeProperty} />
                  </Badge>
                </div>
              </div>
            )}

            {/* Search Results */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6" style={{ color: "#112A43" }}>
                Search Results ({filteredProperties.length})
              </h2>

              {filteredProperties.length === 0 ? (
                <Card className="rounded-2xl shadow-lg">
                  <CardContent className="p-12 text-center">
                    <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2 text-gray-600">No properties found</h3>
                    <p className="text-gray-500">Try adjusting your search criteria or filters</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredProperties.map((property) => {
                    const riskColors = getRiskColor(property.riskLevel)
                    const isSelected = selectedProperty === property.id
                    const canSelect = !selectedProperty || isSelected // Can select if none selected or this one is selected

                    return (
                      <Card
                        key={property.id}
                        className={`rounded-2xl card-shadow hover:shadow-xl transition-all duration-300 ${
                          !canSelect ? "opacity-50" : ""
                        } ${isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) => handlePropertySelect(property.id, checked as boolean)}
                                className="w-6 h-6"
                                disabled={!canSelect}
                              />
                              <div className="flex-1">
                                <h3 className="font-bold text-xl mb-2" style={{ color: "#112A43" }}>
                                  {property.address}
                                </h3>
                                <div className="flex items-center space-x-2 mb-2">
                                  <MapPin className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-600">
                                    {property.city}, {property.state}, {property.country}
                                  </span>
                                </div>
                                {/* Added Client Name Line */}
                                <div className="flex items-center space-x-2 mb-2">
                                  <User className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-600 font-medium">{property.clientName}</span>
                                </div>
                                <div className="flex items-center space-x-6 text-gray-600 text-lg">
                                  <span className="font-medium">{property.type}</span>
                                  <span>•</span>
                                  <span className="font-semibold text-green-600">{formatCurrency(property.value)}</span>
                                  <span>•</span>
                                  <span>{formatSquareFootage(property.size)}</span>
                                  <span>•</span>
                                  <span>Built {property.yearBuilt}</span>
                                </div>
                                <div className="flex items-center space-x-4 mt-3">
                                  <Badge
                                    className="rounded-full px-3 py-1 text-xs font-bold"
                                    style={{ backgroundColor: "#66DCCC", color: "#112A43" }}
                                  >
                                    LTV: {property.ltv.toFixed(1)}%
                                  </Badge>
                                  <Badge
                                    className="rounded-full px-3 py-1 text-xs font-bold"
                                    style={{ backgroundColor: "#99EFE4", color: "#112A43" }}
                                  >
                                    DSCR: {property.dscr.toFixed(2)}
                                  </Badge>
                                  <Badge
                                    className="rounded-full px-3 py-1 text-xs font-bold"
                                    style={{ backgroundColor: "#10b981", color: "white" }}
                                  >
                                    {getCertificationLabel(property.greenCertifications)}
                                  </Badge>
                                  {property.isUserImported && (
                                    <Badge
                                      className="rounded-full px-3 py-1 text-xs font-bold"
                                      style={{ backgroundColor: "#8b5cf6", color: "white" }}
                                    >
                                      User Imported
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge
                                className="rounded-full px-6 py-3 text-sm font-bold shadow-lg mb-2"
                                style={{ backgroundColor: riskColors.bg, color: riskColors.text }}
                              >
                                {property.riskLevel.charAt(0).toUpperCase() + property.riskLevel.slice(1)} Risk
                              </Badge>
                              <div className="text-sm text-gray-500">Score: {property.riskScore.toFixed(1)}/10</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Sticky Bottom Button */}
            {selectedProperty && (
              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                <Link href={getDetailsUrl()}>
                  <Button
                    className="rounded-full px-12 py-6 text-xl font-bold text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1"
                    style={{ backgroundColor: "#2B6CA9" }}
                  >
                    Continue to Details
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div>
            <Card className="rounded-2xl sticky top-8 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6" style={{ color: "#112A43" }}>
                  Selection Summary
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Property Selected</span>
                    <span className="font-bold text-2xl" style={{ color: "#2B6CA9" }}>
                      {selectedProperty ? "1" : "0"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Property Value</span>
                    <span className="font-bold text-xl text-green-600">
                      {selectedProperty ? formatCurrency(totalValue) : "$0"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Search Results</span>
                    <span className="font-bold text-lg" style={{ color: "#2B6CA9" }}>
                      {filteredProperties.length}
                    </span>
                  </div>
                </div>

                {selectedProperty && selectedProp && (
                  <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: "#99EFE4" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5" style={{ color: "#112A43" }} />
                      <span className="font-semibold" style={{ color: "#112A43" }}>
                        Selected Property
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: "#112A43" }}>
                      <strong>{selectedProp.clientName}</strong>
                      <br />
                      {selectedProp.address}
                      <br />
                      Risk Level: {selectedProp.riskLevel.charAt(0).toUpperCase() + selectedProp.riskLevel.slice(1)}
                    </p>
                  </div>
                )}

                {activeFiltersCount > 0 && (
                  <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: "#66DCCC" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Filter className="w-5 h-5" style={{ color: "#112A43" }} />
                      <span className="font-semibold" style={{ color: "#112A43" }}>
                        Active Filters
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: "#112A43" }}>
                      {activeFiltersCount} filter{activeFiltersCount !== 1 ? "s" : ""} applied
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
