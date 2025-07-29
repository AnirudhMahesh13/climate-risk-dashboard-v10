"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, X, Upload, Download, AlertCircle, HelpCircle } from "lucide-react"
import { Stepper } from "@/components/stepper"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function PortfolioFilterPage() {
  const [filters, setFilters] = useState({
    country: "canada",
    province: "ontario",
    city: "toronto",
    propertyTypes: ["Office", "Retail"] as string[],
    energySources: ["Natural Gas", "Electricity"] as string[],
    emissionRange: [20, 80],
    greenCertifications: ["LEED Gold"] as string[],
    lobs: {} as Record<string, string[]>,
  })

  const [uploadedPortfolio, setUploadedPortfolio] = useState<any[]>([])
  const [uploadError, setUploadError] = useState<string>("")
  const [showUploadSuccess, setShowUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const propertyTypes = ["Multi-family", "Office", "Industrial", "Retail", "Healthcare", "Hospitality", "Other"]
  const energySources = ["Fossil Fuel", "Electric", "Hybrid"]
  const greenCertifications = [
    "LEED Gold",
    "LEED Platinum",
    "BOMA BEST Gold",
    "BOMA BEST Platinum",
    "BREEAM Excellent",
    "BREEAM Outstanding",
    "ENERGY STAR (>85)",
    "ENERGY STAR for New Homes (v12.6+)",
    "Toronto Green Standard (v4) (≥Tier 2)",
    "Passive House Institute – EnerPHit",
    "BC Energy Step Code (≥Step 3)",
    "UK EPC (A)",
    "UK EPC (B)",
  ]

  const lobs = {
    "Commercial Real Estate": ["Office Buildings", "Retail Centers", "Industrial Parks"],
    Residential: ["Apartments", "Condominiums", "Single Family"],
    Hospitality: ["Hotels", "Resorts", "Conference Centers"],
  }

  const removeFilter = (category: string, value: string) => {
    switch (category) {
      case "propertyTypes":
        setFilters({ ...filters, propertyTypes: filters.propertyTypes.filter((t) => t !== value) })
        break
      case "energySources":
        setFilters({ ...filters, energySources: filters.energySources.filter((s) => s !== value) })
        break
      case "greenCertifications":
        setFilters({ ...filters, greenCertifications: filters.greenCertifications.filter((c) => c !== value) })
        break
      case "country":
        setFilters({ ...filters, country: "" })
        break
      case "province":
        setFilters({ ...filters, province: "" })
        break
      case "city":
        setFilters({ ...filters, city: "" })
        break
    }
  }

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
    ]

    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h))
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`)
    }

    const properties = []
    for (let i = 1; i < lines.length && i <= 101; i++) {
      const values = lines[i].split(",").map((v) => v.trim())
      if (values.length !== headers.length) continue

      try {
        const property = {
          id: Date.now() + i,
          address: values[headers.indexOf("address")],
          city: values[headers.indexOf("city")],
          province: values[headers.indexOf("province_or_state")],
          country: values[headers.indexOf("country")],
          type: values[headers.indexOf("type")],
          value: Number.parseFloat(values[headers.indexOf("value_millions")]),
          riskLevel:
            Number.parseFloat(values[headers.indexOf("expected_reg_shock")]) > 3.5
              ? "high"
              : Number.parseFloat(values[headers.indexOf("expected_reg_shock")]) > 2.5
                ? "medium"
                : "low",
          riskScore: Number.parseFloat(values[headers.indexOf("expected_reg_shock")]),
          ltv: Number.parseFloat(values[headers.indexOf("ltv")]),
          dscr: Number.parseFloat(values[headers.indexOf("dscr")]),
          heatSource: values[headers.indexOf("heat_source")],
          greenCertifications: values[headers.indexOf("green_certifications")],
          energyEfficiency: values[headers.indexOf("energy_efficiency")],
          retrofitCost: Number.parseFloat(values[headers.indexOf("retrofit_cost")]),
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
        setUploadedPortfolio(newProperties)
        setUploadError("")
        setShowUploadSuccess(true)
        setTimeout(() => setShowUploadSuccess(false), 3000)
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : "Failed to parse CSV")
      }
    }
    reader.readAsText(file)

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
    ]

    const csvContent = [headers.join(","), sampleRow.join(",")].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "portfolio_template.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  // Calculate portfolio metrics from uploaded data
  const calculatePortfolioMetrics = () => {
    if (uploadedPortfolio.length === 0) return null

    const totalValue = uploadedPortfolio.reduce((sum, prop) => sum + prop.value, 0)
    const avgRisk = uploadedPortfolio.reduce((sum, prop) => sum + prop.riskScore, 0) / uploadedPortfolio.length
    const avgDSCR = uploadedPortfolio.reduce((sum, prop) => sum + prop.dscr, 0) / uploadedPortfolio.length
    const avgLTV = uploadedPortfolio.reduce((sum, prop) => sum + prop.ltv, 0) / uploadedPortfolio.length

    const riskDistribution = {
      high: uploadedPortfolio.filter((p) => p.riskLevel === "high").length,
      medium: uploadedPortfolio.filter((p) => p.riskLevel === "medium").length,
      low: uploadedPortfolio.filter((p) => p.riskLevel === "low").length,
    }

    return {
      totalProperties: uploadedPortfolio.length,
      totalValue: `$${totalValue.toFixed(1)}B`,
      avgRisk: avgRisk.toFixed(1),
      avgDSCR: avgDSCR.toFixed(2),
      avgLTV: `${avgLTV.toFixed(1)}%`,
      riskDistribution,
    }
  }

  const portfolioMetrics = calculatePortfolioMetrics()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <Stepper steps={["Filter", "View"]} currentStep={0} type="portfolio" />

        {/* CSV Upload Section */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full shadow-md hover:shadow-lg bg-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Portfolio CSV
              </Button>
              <Popover>
                <PopoverTrigger>
                  <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold">Portfolio CSV Upload:</p>
                    <ul className="text-xs space-y-1 text-gray-600">
                      <li>• Upload your entire portfolio at once</li>
                      <li>• Max file size: 5MB, 100 properties</li>
                      <li>• Auto-calculates portfolio metrics</li>
                      <li>• Can combine with manual filters</li>
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
                </PopoverContent>
              </Popover>
              <Link href="/portfolio/insights">
                <Button
                  className="rounded-full shadow-md hover:shadow-lg text-white px-8 py-3"
                  style={{ backgroundColor: "#2B6CA9" }}
                >
                  I don't want to filter, give me the key insights!
                </Button>
              </Link>
            </div>

            {uploadedPortfolio.length > 0 && (
              <Badge
                className="rounded-full px-6 py-3 text-lg font-bold shadow-lg"
                style={{ backgroundColor: "#10b981", color: "white" }}
              >
                Imported Portfolio CSV ({uploadedPortfolio.length} properties)
              </Badge>
            )}
          </div>

          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />

          {/* Upload Alerts */}
          {uploadError && (
            <Alert className="mt-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{uploadError}</AlertDescription>
            </Alert>
          )}

          {showUploadSuccess && (
            <Alert className="mt-4 border-green-200 bg-green-50">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Successfully imported {uploadedPortfolio.length} properties from CSV. Portfolio metrics updated
                automatically.
              </AlertDescription>
            </Alert>
          )}

          {/* Portfolio Metrics Display */}
          {portfolioMetrics && (
            <Card className="mt-6 rounded-2xl shadow-lg" style={{ backgroundColor: "#f0f9ff", borderColor: "#0ea5e9" }}>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: "#112A43" }}>
                  Imported Portfolio Overview
                </h3>
                <div className="grid grid-cols-5 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: "#2B6CA9" }}>
                      {portfolioMetrics.totalProperties}
                    </div>
                    <div className="text-sm text-gray-600">Properties</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{portfolioMetrics.totalValue}</div>
                    <div className="text-sm text-gray-600">Total Value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{portfolioMetrics.avgRisk}/10</div>
                    <div className="text-sm text-gray-600">Avg Risk</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{portfolioMetrics.avgDSCR}</div>
                    <div className="text-sm text-gray-600">Avg DSCR</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: "#2B6CA9" }}>
                      {portfolioMetrics.avgLTV}
                    </div>
                    <div className="text-sm text-gray-600">Avg LTV</div>
                  </div>
                </div>
                <div className="mt-4 flex justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-sm">High Risk: {portfolioMetrics.riskDistribution.high}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Medium Risk: {portfolioMetrics.riskDistribution.medium}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Low Risk: {portfolioMetrics.riskDistribution.low}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8">
          {/* Filters - 3 columns */}
          <div className="col-span-3 grid grid-cols-2 gap-6">
            {/* Location Filters */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle style={{ color: "#112A43" }}>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block text-gray-700">Country</label>
                  <Select value={filters.country} onValueChange={(value) => setFilters({ ...filters, country: value })}>
                    <SelectTrigger className="rounded-full h-12">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="canada">Canada</SelectItem>
                      <SelectItem value="usa">United States</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block text-gray-700">Province/State</label>
                  <Select
                    value={filters.province}
                    onValueChange={(value) => setFilters({ ...filters, province: value })}
                  >
                    <SelectTrigger className="rounded-full h-12">
                      <SelectValue placeholder="Select province/state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ontario">Ontario</SelectItem>
                      <SelectItem value="quebec">Quebec</SelectItem>
                      <SelectItem value="california">California</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block text-gray-700">City</label>
                  <Select value={filters.city} onValueChange={(value) => setFilters({ ...filters, city: value })}>
                    <SelectTrigger className="rounded-full h-12">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="toronto">Toronto</SelectItem>
                      <SelectItem value="vancouver">Vancouver</SelectItem>
                      <SelectItem value="montreal">Montreal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Property Types */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle style={{ color: "#112A43" }}>Property Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {propertyTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-3">
                      <Checkbox
                        id={type}
                        checked={filters.propertyTypes.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilters({ ...filters, propertyTypes: [...filters.propertyTypes, type] })
                          } else {
                            setFilters({ ...filters, propertyTypes: filters.propertyTypes.filter((t) => t !== type) })
                          }
                        }}
                        className="w-5 h-5"
                      />
                      <label htmlFor={type} className="text-sm font-medium cursor-pointer">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Energy Sources */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle style={{ color: "#112A43" }}>Energy Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {energySources.map((source) => (
                    <div key={source} className="flex items-center space-x-3">
                      <Checkbox
                        id={source}
                        checked={filters.energySources.includes(source)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilters({ ...filters, energySources: [...filters.energySources, source] })
                          } else {
                            setFilters({ ...filters, energySources: filters.energySources.filter((s) => s !== source) })
                          }
                        }}
                        className="w-5 h-5"
                      />
                      <label htmlFor={source} className="text-sm font-medium cursor-pointer">
                        {source}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Energy Intensity Range */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle style={{ color: "#112A43" }}>Energy Intensity Range</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="px-4">
                    <Slider
                      value={filters.emissionRange}
                      onValueChange={(value) => setFilters({ ...filters, emissionRange: value })}
                      max={100}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: "#2B6CA9", borderColor: "#112A43" }}
                      >
                        {filters.emissionRange[0]}
                      </div>
                      <span className="text-sm font-medium text-gray-600">Min: {filters.emissionRange[0]} kWh/m²</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">Max: {filters.emissionRange[1]} kWh/m²</span>
                      <div
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: "#2B6CA9", borderColor: "#112A43" }}
                      >
                        {filters.emissionRange[1]}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Green Certifications */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle style={{ color: "#112A43" }}>Green Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {greenCertifications.map((cert) => (
                    <div key={cert} className="flex items-center space-x-3">
                      <Checkbox
                        id={cert}
                        checked={filters.greenCertifications.includes(cert)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilters({ ...filters, greenCertifications: [...filters.greenCertifications, cert] })
                          } else {
                            setFilters({
                              ...filters,
                              greenCertifications: filters.greenCertifications.filter((c) => c !== cert),
                            })
                          }
                        }}
                        className="w-5 h-5"
                      />
                      <label htmlFor={cert} className="text-sm font-medium cursor-pointer">
                        {cert}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* LOB / Sub-LOB */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle style={{ color: "#112A43" }}>LOB / Sub-LOB</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(lobs).map(([lob, subLobs]) => (
                    <Collapsible key={lob}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left rounded-xl hover:bg-gray-50 transition-colors">
                        <span className="font-semibold">{lob}</span>
                        <ChevronDown className="w-5 h-5" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-4 pt-3 space-y-3">
                        <div className="flex items-center space-x-3">
                          <Checkbox id={`${lob}-all`} className="w-5 h-5" />
                          <label htmlFor={`${lob}-all`} className="text-sm font-semibold cursor-pointer">
                            All
                          </label>
                        </div>
                        {subLobs.map((subLob) => (
                          <div key={subLob} className="flex items-center space-x-3">
                            <Checkbox id={subLob} className="w-5 h-5" />
                            <label htmlFor={subLob} className="text-sm font-medium cursor-pointer">
                              {subLob}
                            </label>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Filter Summary Sidebar */}
          <div>
            <Card className="rounded-2xl sticky top-8 shadow-lg">
              <CardHeader>
                <CardTitle style={{ color: "#112A43" }}>Filter Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Location Filters */}
                {filters.country && (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-700">Location</div>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        className="rounded-full px-3 py-1 text-xs flex items-center gap-1"
                        style={{ backgroundColor: "#99EFE4", color: "#112A43" }}
                      >
                        {filters.country}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-600"
                          onClick={() => removeFilter("country", filters.country)}
                        />
                      </Badge>
                      {filters.province && (
                        <Badge
                          className="rounded-full px-3 py-1 text-xs flex items-center gap-1"
                          style={{ backgroundColor: "#66DCCC", color: "#112A43" }}
                        >
                          {filters.province}
                          <X
                            className="w-3 h-3 cursor-pointer hover:text-red-600"
                            onClick={() => removeFilter("province", filters.province)}
                          />
                        </Badge>
                      )}
                      {filters.city && (
                        <Badge
                          className="rounded-full px-3 py-1 text-xs flex items-center gap-1"
                          style={{ backgroundColor: "#99EFE4", color: "#112A43" }}
                        >
                          {filters.city}
                          <X
                            className="w-3 h-3 cursor-pointer hover:text-red-600"
                            onClick={() => removeFilter("city", filters.city)}
                          />
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Property Types */}
                {filters.propertyTypes.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-700">Property Types</div>
                    <div className="flex flex-wrap gap-2">
                      {filters.propertyTypes.map((type) => (
                        <Badge
                          key={type}
                          className="rounded-full px-3 py-1 text-xs flex items-center gap-1"
                          style={{ backgroundColor: "#2B6CA9", color: "white" }}
                        >
                          {type}
                          <X
                            className="w-3 h-3 cursor-pointer hover:text-red-300"
                            onClick={() => removeFilter("propertyTypes", type)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Energy Sources */}
                {filters.energySources.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-700">Energy Sources</div>
                    <div className="flex flex-wrap gap-2">
                      {filters.energySources.map((source) => (
                        <Badge
                          key={source}
                          className="rounded-full px-3 py-1 text-xs flex items-center gap-1"
                          style={{ backgroundColor: "#66DCCC", color: "#112A43" }}
                        >
                          {source}
                          <X
                            className="w-3 h-3 cursor-pointer hover:text-red-600"
                            onClick={() => removeFilter("energySources", source)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Energy Range */}
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-700">Energy Range</div>
                  <Badge
                    className="rounded-full px-3 py-1 text-xs"
                    style={{ backgroundColor: "#99EFE4", color: "#112A43" }}
                  >
                    {filters.emissionRange[0]} - {filters.emissionRange[1]} kWh/m²
                  </Badge>
                </div>

                {/* Green Certifications */}
                {filters.greenCertifications.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-700">Certifications</div>
                    <div className="flex flex-wrap gap-2">
                      {filters.greenCertifications.map((cert) => (
                        <Badge
                          key={cert}
                          className="rounded-full px-3 py-1 text-xs flex items-center gap-1"
                          style={{ backgroundColor: "#10b981", color: "white" }}
                        >
                          {cert}
                          <X
                            className="w-3 h-3 cursor-pointer hover:text-red-300"
                            onClick={() => removeFilter("greenCertifications", cert)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary Stats */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Total Filters:</span>{" "}
                    {(filters.country ? 1 : 0) +
                      (filters.province ? 1 : 0) +
                      (filters.city ? 1 : 0) +
                      filters.propertyTypes.length +
                      filters.energySources.length +
                      filters.greenCertifications.length +
                      1}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Estimated Results:</span> 47 properties
                  </div>
                </div>

                {uploadedPortfolio.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold">Imported Data:</span> {uploadedPortfolio.length} properties from
                      CSV
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold">Combined Results:</span> {47 + uploadedPortfolio.length} total
                      properties
                    </div>
                  </div>
                )}

                <Link href="/portfolio/overview" className="block mt-6">
                  <Button
                    className="w-full rounded-full py-4 text-lg font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    style={{ backgroundColor: "#2B6CA9" }}
                  >
                    Continue to Portfolio View
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
