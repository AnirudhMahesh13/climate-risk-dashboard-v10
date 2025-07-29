"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from "recharts"
import { MultiAssetStepper } from "@/components/multi-asset-stepper"
import { CollapsibleControlsSidebar } from "@/components/collapsible-controls-sidebar"
import {
  HelpCircle,
  Download,
  MapPin,
  TrendingUp,
  DollarSign,
  Shield,
  Zap,
  Leaf,
  X,
  Building,
  AlertTriangle,
} from "lucide-react"
import type { CustomScenario } from "@/components/scenario-modal"
import { mockProperties } from "@/lib/mock-data"

const baseRiskData = [
  {
    year: 2024,
    risk: 7.2,
    benchmark: 6.8,
    revenue: 8.5,
    expenses: 2.3,
    revenuePayFines: 8.2,
    revenueRetrofit: 8.8,
    expensePayFines: 2.8,
    expenseRetrofit: 1.8,
  },
  {
    year: 2026,
    risk: 7.8,
    benchmark: 7.2,
    revenue: 8.8,
    expenses: 2.5,
    revenuePayFines: 8.4,
    revenueRetrofit: 9.2,
    expensePayFines: 3.2,
    expenseRetrofit: 1.8,
  },
  {
    year: 2028,
    risk: 8.4,
    benchmark: 7.8,
    revenue: 9.2,
    expenses: 2.8,
    revenuePayFines: 8.6,
    revenueRetrofit: 9.8,
    expensePayFines: 3.8,
    expenseRetrofit: 1.8,
  },
  {
    year: 2030,
    risk: 9.1,
    benchmark: 8.5,
    revenue: 9.6,
    expenses: 3.2,
    revenuePayFines: 8.8,
    revenueRetrofit: 10.4,
    expensePayFines: 4.5,
    expenseRetrofit: 1.9,
  },
  {
    year: 2035,
    risk: 10.2,
    benchmark: 9.8,
    revenue: 10.5,
    expenses: 3.8,
    revenuePayFines: 9.2,
    revenueRetrofit: 11.8,
    expensePayFines: 5.8,
    expenseRetrofit: 1.8,
  },
  {
    year: 2040,
    risk: 11.5,
    benchmark: 11.1,
    revenue: 11.2,
    expenses: 4.5,
    revenuePayFines: 9.8,
    revenueRetrofit: 12.6,
    expensePayFines: 7.2,
    expenseRetrofit: 1.8,
  },
  {
    year: 2045,
    risk: 12.8,
    benchmark: 12.4,
    revenue: 11.8,
    expenses: 5.2,
    revenuePayFines: 10.2,
    revenueRetrofit: 13.4,
    expensePayFines: 8.8,
    expenseRetrofit: 1.6,
  },
  {
    year: 2050,
    risk: 14.2,
    benchmark: 13.8,
    revenue: 12.4,
    expenses: 6.1,
    revenuePayFines: 10.8,
    revenueRetrofit: 14.0,
    expensePayFines: 10.5,
    expenseRetrofit: 1.7,
  },
]

// Add these helper functions at the top of the component, after the imports
const generateCSVData = (selectedAssets: string[], riskData: any[], financialMetrics: any) => {
  const csvData = []

  // Header row
  csvData.push([
    "Property Address",
    "Year",
    "NOI Expected ($M)",
    "NOI Minimum ($M)",
    "NOI Maximum ($M)",
    "Revenue Expected ($M)",
    "Revenue Minimum ($M)",
    "Revenue Maximum ($M)",
    "Expenses Expected ($M)",
    "Expenses Minimum ($M)",
    "Expenses Maximum ($M)",
    "Energy Intensity (kWh/m²/yr)",
    "CREM Energy Pathway",
    "Jump Rate (%)",
    "Jump Rate Green Premium Adj (%)",
    "Jump Rate Heat Source Adj (%)",
    "Jump Magnitude Fines ($)",
    "Jump Magnitude Retrofit ($)",
    "Carbon Pricing ($/tonne)",
    "Baseline Inflation (%)",
    "Annual Revenue Growth (%)",
    "Revenue Vacancy Rate Adj (%)",
    "Revenue Green Premium Adj (%)",
  ])

  // Data rows for each property and year
  selectedAssets.forEach((asset, assetIndex) => {
    riskData.forEach((yearData) => {
      csvData.push([
        asset,
        yearData.year,
        yearData.revenue.toFixed(2),
        (yearData.revenue * 0.85).toFixed(2), // Min scenario
        (yearData.revenue * 1.15).toFixed(2), // Max scenario
        yearData.revenue.toFixed(2),
        (yearData.revenue * 0.8).toFixed(2),
        (yearData.revenue * 1.2).toFixed(2),
        yearData.expenses.toFixed(2),
        (yearData.expenses * 0.9).toFixed(2),
        (yearData.expenses * 1.3).toFixed(2),
        (85 + assetIndex * 5).toFixed(1), // Energy intensity
        "Moderate Transition",
        (2.5 + yearData.year * 0.1).toFixed(1),
        (1.2).toFixed(1),
        (0.8).toFixed(1),
        (50000 + yearData.year * 2000).toFixed(0),
        (25000 + yearData.year * 1000).toFixed(0),
        (45 + yearData.year * 2).toFixed(0),
        (2.1).toFixed(1),
        (3.2).toFixed(1),
        (1.5).toFixed(1),
        (2.8).toFixed(1),
      ])
    })
  })

  return csvData
}

const generatePDFContent = (selectedAssets: string[], financialMetrics: any) => {
  const retrofitOptions = [
    {
      name: "Upgrade windows & insulation",
      cost: "$850K",
      revenueImpact: "+$120K annually",
      expenseImpact: "-$45K annually",
      paybackPeriod: "6.2 years",
      description: "Improved thermal efficiency reduces heating/cooling costs and increases tenant comfort",
    },
    {
      name: "Upgrade cooling & heating",
      cost: "$1.2M",
      revenueImpact: "+$180K annually",
      expenseImpact: "-$85K annually",
      paybackPeriod: "4.8 years",
      description: "High-efficiency HVAC systems with smart controls optimize energy usage",
    },
    {
      name: "Upgrade lighting & energy management",
      cost: "$320K",
      revenueImpact: "+$65K annually",
      expenseImpact: "-$35K annually",
      paybackPeriod: "3.2 years",
      description: "LED lighting and automated systems reduce electricity consumption by 40%",
    },
    {
      name: "Install solar panels",
      cost: "$950K",
      revenueImpact: "+$95K annually",
      expenseImpact: "-$75K annually",
      paybackPeriod: "5.6 years",
      description: "On-site renewable energy generation with grid tie-in and battery storage",
    },
  ]

  return {
    title: "Climate Risk Analysis Report",
    properties: selectedAssets,
    executiveSummary: {
      totalAssetValue: financialMetrics.assetValue,
      riskScore: financialMetrics.riskScore,
      recommendedInvestment: "$2.1M",
      projectedSavings: financialMetrics.netSavings,
    },
    retrofitOptions,
    recommendation:
      "Based on the analysis, we recommend implementing all four retrofit measures in phases: Start with lighting & energy management (highest ROI), followed by HVAC upgrades, then windows & insulation, and finally solar installation. This phased approach will generate positive cash flow to fund subsequent improvements while maximizing long-term value creation.",
  }
}

const exportToCSV = (selectedAssets: string[], riskData: any[], financialMetrics: any) => {
  const csvData = generateCSVData(selectedAssets, riskData, financialMetrics)
  const csvContent = csvData.map((row) => row.join(",")).join("\n")
  const blob = new Blob([csvContent], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `climate-risk-analysis-${new Date().toISOString().split("T")[0]}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

const exportToPDF = (selectedAssets: string[], financialMetrics: any) => {
  const retrofitOptions = [
    {
      name: "Upgrade windows & insulation",
      cost: "$850K",
      annualRevenue: "+$120K",
      annualExpenses: "-$45K",
      netAnnualBenefit: "+$165K",
      paybackPeriod: "5.2 years",
      description:
        "Enhanced thermal performance reduces HVAC load by 25-30%, improving tenant comfort and reducing energy costs. Premium insulation and high-performance windows create a more stable indoor environment.",
      revenueDetails: "Increased rent premiums from improved comfort and energy efficiency ratings",
      expenseDetails: "Reduced heating/cooling costs, lower maintenance on HVAC systems",
    },
    {
      name: "Upgrade cooling & heating",
      cost: "$1.2M",
      annualRevenue: "+$180K",
      annualExpenses: "-$85K",
      netAnnualBenefit: "+$265K",
      paybackPeriod: "4.5 years",
      description:
        "High-efficiency HVAC systems with smart controls and zoning optimize energy usage. Variable refrigerant flow (VRF) systems provide precise temperature control while reducing energy consumption by 35-40%.",
      revenueDetails: "Higher tenant retention, premium rents for climate-controlled spaces",
      expenseDetails: "40% reduction in energy costs, lower maintenance and repair expenses",
    },
    {
      name: "Upgrade lighting & energy management",
      cost: "$320K",
      annualRevenue: "+$65K",
      annualExpenses: "-$35K",
      netAnnualBenefit: "+$100K",
      paybackPeriod: "3.2 years",
      description:
        "LED lighting retrofit with occupancy sensors and daylight harvesting reduces electricity consumption by 60%. Smart building management systems optimize all electrical loads automatically.",
      revenueDetails: "Green building certifications enable rent premiums and attract quality tenants",
      expenseDetails: "60% lighting electricity savings, reduced lamp replacement costs",
    },
    {
      name: "Install solar panels",
      cost: "$950K",
      annualRevenue: "+$95K",
      annualExpenses: "-$75K",
      netAnnualBenefit: "+$170K",
      paybackPeriod: "5.6 years",
      description:
        "Rooftop solar installation with battery storage and grid tie-in. 500kW system generates approximately 650 MWh annually, covering 40-50% of building electricity needs.",
      revenueDetails: "Net metering credits, green energy certificates, marketing advantages",
      expenseDetails: "Reduced grid electricity purchases, stable energy costs over 25 years",
    },
  ]

  // Calculate portfolio totals
  const totalInvestment = "$3.32M"
  const totalAnnualBenefit = "+$700K"
  const averagePayback = "4.6 years"
  const totalNOIIncrease = "+$700K annually"

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Climate Risk Analysis Report - Asset Level</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background: white;
          font-size: 12px;
        }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
          padding: 20px;
          background: linear-gradient(135deg, #112A43 0%, #2B6CA9 100%);
          color: white;
          border-radius: 8px;
        }
        .header h1 { font-size: 24px; margin-bottom: 8px; font-weight: 700; }
        .header p { font-size: 14px; opacity: 0.9; }
        .section { margin-bottom: 25px; }
        .section-title { 
          font-size: 18px; 
          font-weight: 700; 
          color: #112A43; 
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #99EFE4;
        }
        .executive-summary {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #2B6CA9;
          margin-bottom: 25px;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin: 20px 0;
        }
        .metric-card {
          background: white;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .metric-value {
          font-size: 20px;
          font-weight: 700;
          color: #2B6CA9;
          margin-bottom: 5px;
        }
        .metric-label {
          font-size: 11px;
          color: #64748b;
          font-weight: 500;
        }
        .retrofit-option {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .retrofit-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e2e8f0;
        }
        .retrofit-name {
          font-size: 16px;
          font-weight: 700;
          color: #112A43;
        }
        .retrofit-cost {
          font-size: 16px;
          font-weight: 700;
          color: #dc2626;
        }
        .retrofit-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 15px;
        }
        .detail-item {
          text-align: center;
          padding: 10px;
          background: #f1f5f9;
          border-radius: 6px;
        }
        .detail-value {
          font-size: 14px;
          font-weight: 700;
          color: #059669;
          margin-bottom: 3px;
        }
        .detail-label {
          font-size: 10px;
          color: #64748b;
          font-weight: 500;
        }
        .retrofit-description {
          font-size: 12px;
          color: #475569;
          margin-bottom: 10px;
          line-height: 1.5;
        }
        .impact-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 10px;
        }
        .impact-item {
          padding: 10px;
          background: #fefefe;
          border-left: 3px solid #99EFE4;
          border-radius: 4px;
        }
        .impact-title {
          font-size: 11px;
          font-weight: 600;
          color: #112A43;
          margin-bottom: 3px;
        }
        .impact-text {
          font-size: 10px;
          color: #64748b;
          line-height: 1.4;
        }
        .properties-list {
          background: #f8fafc;
          padding: 15px;
          border-radius: 6px;
          margin: 15px 0;
        }
        .properties-list ul {
          list-style: none;
          padding-left: 0;
        }
        .properties-list li {
          padding: 5px 0;
          font-size: 12px;
          color: #475569;
        }
        .properties-list li:before {
          content: "•";
          color: #2B6CA9;
          font-weight: bold;
          margin-right: 8px;
        }
        .recommendation {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #0ea5e9;
          margin-top: 25px;
        }
        .recommendation h3 {
          color: #0c4a6e;
          font-size: 16px;
          margin-bottom: 10px;
        }
        .recommendation p {
          font-size: 12px;
          color: #0f172a;
          line-height: 1.6;
        }
        .implementation-phases {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin: 15px 0;
        }
        .phase {
          background: white;
          padding: 15px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }
        .phase-title {
          font-size: 12px;
          font-weight: 700;
          color: #112A43;
          margin-bottom: 8px;
        }
        .phase-content {
          font-size: 11px;
          color: #64748b;
          line-height: 1.4;
        }
        @media print {
          body { font-size: 11px; }
          .container { padding: 15px; }
          .retrofit-option { page-break-inside: avoid; }
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Climate Risk Analysis Report</h1>
          <p>Asset-Level Retrofit Analysis & Recommendations</p>
          <p>Generated: ${new Date().toLocaleDateString()} | Properties: ${selectedAssets.length}</p>
        </div>

        <div class="executive-summary">
          <h2 class="section-title">Executive Summary</h2>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-value">${totalInvestment}</div>
              <div class="metric-label">Total Investment Required</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${totalAnnualBenefit}</div>
              <div class="metric-label">Annual NOI Increase</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${averagePayback}</div>
              <div class="metric-label">Average Payback Period</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${financialMetrics.riskScore}</div>
              <div class="metric-label">Current Risk Score</div>
            </div>
          </div>
          <p style="font-size: 12px; color: #475569; margin-top: 15px;">
            This analysis evaluates four strategic retrofit interventions across ${selectedAssets.length} properties. 
            The recommended approach will reduce climate transition risk while generating positive returns through 
            improved operational efficiency and enhanced asset value.
          </p>
        </div>

        <div class="section">
          <h2 class="section-title">Properties Under Analysis</h2>
          <div class="properties-list">
            <ul>
              ${selectedAssets.map((asset) => `<li>${asset}</li>`).join("")}
            </ul>
          </div>
        </div>

        <div class="section">
          <h2 class="section-title">Retrofit Options Analysis</h2>
          ${retrofitOptions
            .map(
              (option) => `
            <div class="retrofit-option">
              <div class="retrofit-header">
                <div class="retrofit-name">${option.name}</div>
                <div class="retrofit-cost">${option.cost}</div>
              </div>
              
              <div class="retrofit-details">
                <div class="detail-item">
                  <div class="detail-value">${option.annualRevenue}</div>
                  <div class="detail-label">Annual Revenue Impact</div>
                </div>
                <div class="detail-item">
                  <div class="detail-value">${option.annualExpenses}</div>
                  <div class="detail-label">Annual Expense Savings</div>
                </div>
                <div class="detail-item">
                  <div class="detail-value">${option.paybackPeriod}</div>
                  <div class="detail-label">Payback Period</div>
                </div>
              </div>

              <div class="retrofit-description">
                ${option.description}
              </div>

              <div class="impact-details">
                <div class="impact-item">
                  <div class="impact-title">Revenue Enhancement</div>
                  <div class="impact-text">${option.revenueDetails}</div>
                </div>
                <div class="impact-item">
                  <div class="impact-title">Expense Reduction</div>
                  <div class="impact-text">${option.expenseDetails}</div>
                </div>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>

        <div class="section">
          <h2 class="section-title">Implementation Strategy</h2>
          <div class="implementation-phases">
            <div class="phase">
              <div class="phase-title">Phase 1: Quick Wins (Months 1-6)</div>
              <div class="phase-content">
                Start with lighting & energy management upgrades. Lowest cost, fastest payback, 
                immediate operational savings to fund subsequent phases.
              </div>
            </div>
            <div class="phase">
              <div class="phase-title">Phase 2: HVAC Systems (Months 7-18)</div>
              <div class="phase-content">
                Upgrade heating and cooling systems during optimal weather windows. 
                Coordinate with lighting controls for maximum efficiency gains.
              </div>
            </div>
            <div class="phase">
              <div class="phase-title">Phase 3: Building Envelope (Months 19-30)</div>
              <div class="phase-content">
                Windows and insulation upgrades complement HVAC improvements. 
                Schedule during favorable weather to minimize tenant disruption.
              </div>
            </div>
            <div class="phase">
              <div class="phase-title">Phase 4: Renewable Energy (Months 31-36)</div>
              <div class="phase-content">
                Solar installation as final phase maximizes benefits from reduced 
                baseline consumption achieved through earlier efficiency measures.
              </div>
            </div>
          </div>
        </div>

        <div class="recommendation">
          <h3>Final Recommendation</h3>
          <p>
            <strong>Recommended Approach:</strong> Implement all four retrofit measures in the phased sequence outlined above. 
            This strategy optimizes cash flow by using early-phase savings to fund later investments while minimizing 
            operational disruption.
          </p>
          <br>
          <p>
            <strong>Expected Outcomes:</strong> The complete retrofit program will reduce the portfolio's climate risk score 
            from ${financialMetrics.riskScore} to approximately 4.2/10, while generating ${totalNOIIncrease} in additional 
            net operating income. The ${totalInvestment} investment will achieve full payback in ${averagePayback} and 
            continue generating positive returns for 15-25 years.
          </p>
          <br>
          <p>
            <strong>Risk Mitigation:</strong> These improvements will significantly reduce exposure to carbon pricing, 
            energy cost volatility, and regulatory compliance risks while positioning the assets as premium, 
            climate-resilient properties in an increasingly competitive market.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  // Open in new window for printing/saving as PDF
  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }
}

export default function AssetAnalysisPage() {
  const searchParams = useSearchParams()
  const [showBenchmark, setShowBenchmark] = useState(false)
  const [expandedCharts, setExpandedCharts] = useState(false)
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [riskData, setRiskData] = useState(baseRiskData)
  const [isInitialized, setIsInitialized] = useState(false)
  const [financialMetrics, setFinancialMetrics] = useState({
    assetValue: "$45M",
    riskScore: "7.2/10",
    annualRiskCost: "$2.1M",
    netSavings: "$8.4M",
    ltv: "71.1%",
    dscr: "2.21",
  })

  // Load property data from URL params - only run once
  useEffect(() => {
    if (isInitialized) return

    const propertyIds = searchParams.get("properties")?.split(",").map(Number) || []
    const propertyDataParam = searchParams.get("data")

    // Get property addresses for display
    const addresses = propertyIds.map((id) => {
      const property = mockProperties.find((p) => p.id === id)
      return property?.address || `Property ${id}`
    })

    if (addresses.length > 0) {
      setSelectedAssets(addresses)
    } else {
      // Default fallback for direct navigation
      setSelectedAssets(["123 Bay Street, Toronto, ON"])
    }

    // Parse and use property data if available
    if (propertyDataParam) {
      try {
        const propertyData = JSON.parse(decodeURIComponent(propertyDataParam))
        console.log("Loaded property data:", propertyData)

        // Calculate aggregate metrics from all properties
        const totalValue = Object.values(propertyData).reduce((sum: number, data: any) => {
          return sum + (Number.parseFloat(data.propertyValue) || 0)
        }, 0)

        if (totalValue > 0) {
          setFinancialMetrics((prev) => ({
            ...prev,
            assetValue: `$${(totalValue / 1000000).toFixed(0)}M`,
          }))
        }
      } catch (error) {
        console.error("Error parsing property data:", error)
      }
    }

    setIsInitialized(true)
  }, [searchParams, isInitialized])

  const removeAsset = (asset: string) => {
    setSelectedAssets((prev) => prev.filter((a) => a !== asset))
  }

  const handleScenarioChange = (scenario: string, customData?: CustomScenario) => {
    // Simulate scenario impact on data
    let multiplier = 1
    switch (scenario) {
      case "aggressive":
        multiplier = 0.8 // Lower risk due to aggressive transition
        break
      case "delayed":
        multiplier = 1.3 // Higher risk due to delayed policy
        break
      default:
        if (scenario.startsWith("custom-") && customData) {
          // Custom scenario logic based on sliders
          const energyImpact = (customData.energyPrices - 50) / 100
          const carbonImpact = customData.carbonTax / 100
          const regulatoryImpact = (customData.regulatoryIntensity - 50) / 100
          multiplier = 1 + energyImpact + carbonImpact + regulatoryImpact
        }
        break
    }

    const updatedData = baseRiskData.map((item) => ({
      ...item,
      risk: item.risk * multiplier,
      expenses: item.expenses * (1 + (multiplier - 1) * 0.5),
      revenue: item.revenue * (1 + (multiplier - 1) * 0.2),
      revenuePayFines: item.revenuePayFines * (1 + (multiplier - 1) * 0.1),
      revenueRetrofit: item.revenueRetrofit * (1 + (multiplier - 1) * 0.3),
      expensePayFines: item.expensePayFines * multiplier,
      expenseRetrofit: item.expenseRetrofit * (1 + (multiplier - 1) * 0.2),
    }))

    setRiskData(updatedData)

    // Update financial metrics
    setFinancialMetrics((prev) => ({
      ...prev,
      riskScore: `${(7.2 * multiplier).toFixed(1)}/10`,
      annualRiskCost: `$${(2.1 * multiplier).toFixed(1)}M`,
      netSavings: `$${(8.4 / multiplier).toFixed(1)}M`,
    }))
  }

  const handlePaymentChange = (
    method: "upfront" | "loan",
    loanCoverage?: number,
    loanTerm?: number,
    interestRate?: number,
  ) => {
    if (method === "loan" && loanCoverage && loanTerm && interestRate) {
      // Simulate loan impact on LTV and DSCR with interest rate consideration
      const baseLTV = 71.1
      const baseDSCR = 2.21

      const ltvImpact = (loanCoverage / 100) * 0.15 // Loan increases LTV
      const dscrImpact = (loanCoverage / 100) * (interestRate / 5.5) * (30 / loanTerm) * 0.1 // Interest rate affects DSCR

      setFinancialMetrics((prev) => ({
        ...prev,
        ltv: `${(baseLTV + ltvImpact).toFixed(1)}%`,
        dscr: `${(baseDSCR - dscrImpact).toFixed(2)}`,
      }))
    } else {
      // Reset to base values for upfront payment
      setFinancialMetrics((prev) => ({
        ...prev,
        ltv: "71.1%",
        dscr: "2.21",
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Collapsible Controls Sidebar */}
      <div className="fixed top-4 left-4 z-50">
        <CollapsibleControlsSidebar onScenarioChange={handleScenarioChange} onPaymentChange={handlePaymentChange} />
      </div>

      <div className="container mx-auto px-6 py-8">
        <MultiAssetStepper currentAsset={selectedAssets.length} totalAssets={selectedAssets.length} currentStep={2} />

        {/* Multi-Asset Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#112A43" }}>
            Asset View
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive analysis across {selectedAssets.length} selected{" "}
            {selectedAssets.length === 1 ? "property" : "properties"}
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8 max-w-6xl mx-auto">
          {[
            { label: "Asset Value", value: financialMetrics.assetValue, icon: Building, color: "#2B6CA9" },
            { label: "Loan Value", value: "$32M", icon: DollarSign, color: "#10b981" },
            {
              label: "Risk Score", // Changed from "Average Risk Classification"
              value: financialMetrics.riskScore.replace("/10", ""), // Remove "/10" suffix
              icon: Shield,
              color: "#f59e0b",
              showInfo: true, // Add info icon
            },
            { label: "Percent Change to NOI", value: financialMetrics.netSavings, icon: TrendingUp, color: "#8b5cf6" },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Icon className="w-8 h-8" style={{ color: stat.color }} />
                    {stat.showInfo && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm">Risk Score Methodology</h4>
                            <p className="text-xs text-gray-600">
                              The risk score (1-10) combines multiple transition risk factors:
                            </p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              <li>• Physical risks: flooding, extreme weather exposure</li>
                              <li>• Transition risks: carbon pricing, regulatory changes</li>
                              <li>• Building characteristics: age, efficiency, systems</li>
                              <li>• Location factors: transition zone, policy environment</li>
                              <li>• Operational factors: energy use, tenant mix</li>
                            </ul>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                  <div className="text-3xl font-bold mb-2" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8">
          {/* Main Content - 3 columns */}
          <div className="col-span-3 space-y-8">
            {/* Map Section */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3" style={{ color: "#112A43" }}>
                  <MapPin className="w-6 h-6" />
                  Interactive Multi-Asset Map
                  <Popover>
                    <PopoverTrigger>
                      <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p className="text-sm">
                        Interactive transition risk visualization showing flood zones, temperature projections, and
                        environmental hazards for all selected properties with comparative analysis.
                      </p>
                    </PopoverContent>
                  </Popover>
                </CardTitle>
                <p className="text-gray-600 text-lg">
                  Transition zones, flood risks, and environmental factors across {selectedAssets.length} properties
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl flex items-center justify-center mb-6 border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <div className="text-xl text-gray-500 font-medium">Interactive Multi-Asset Transition Risk Map</div>
                    <div className="text-gray-400">Comparative analysis across {selectedAssets.length} properties</div>
                  </div>
                </div>

                {/* Replace Current Asset Under Analysis with Selected Properties */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3" style={{ color: "#112A43" }}>
                    Replace Asset Under Analysis
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedAssets.map((asset, index) => (
                      <Badge
                        key={index}
                        className="rounded-full px-6 py-3 text-sm font-medium flex items-center gap-2 shadow-md"
                        style={{ backgroundColor: "#2B6CA9", color: "white" }}
                      >
                        {asset}
                        <X className="w-4 h-4 cursor-pointer hover:text-red-300" onClick={() => removeAsset(asset)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Select>
                    <SelectTrigger className="rounded-full w-48">
                      <SelectValue placeholder="Select Scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baseline">Baseline Scenario</SelectItem>
                      <SelectItem value="optimistic">Optimistic Scenario</SelectItem>
                      <SelectItem value="pessimistic">Pessimistic Scenario</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    className="rounded-full shadow-md hover:shadow-lg bg-white"
                    onClick={() => exportToCSV(selectedAssets, riskData, financialMetrics)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Portfolio Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Risk Forecast Timeline */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between" style={{ color: "#112A43" }}>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6" />
                    Asset Risk Forecast Timeline
                    <Popover>
                      <PopoverTrigger>
                        <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <p className="text-sm">
                          Transition risk projections from 2024 to 2050 with financial impact modeling. Updates in
                          real-time based on scenario and payment structure selections.
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant={expandedCharts ? "default" : "outline"}
                      size="sm"
                      className="rounded-full"
                      onClick={() => setExpandedCharts(!expandedCharts)}
                      style={{ backgroundColor: expandedCharts ? "#2B6CA9" : "transparent" }}
                    >
                      Expand
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-bold mb-4" style={{ color: "#112A43" }}>
                  Asset NOI
                </h3>
                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={riskData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="year" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" tickFormatter={(value) => `$${value}M`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "12px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      {/* Add area chart for range */}
                      <defs>
                        <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2B6CA9" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#2B6CA9" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="risk" stroke="none" fill="url(#riskGradient)" />
                      <Line
                        type="monotone"
                        dataKey="risk"
                        stroke="#2B6CA9"
                        strokeWidth={3}
                        dot={{ fill: "#2B6CA9", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "#2B6CA9", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Remove the interest rate, term, and annual payment fields */}

                {/* Update expanded charts section with percentage drift information */}
                {expandedCharts && (
                  <div className="space-y-8 mt-8 pt-8 border-t border-gray-200">
                    {/* Asset Revenue Trends */}
                    <div>
                      <h3 className="text-xl font-bold mb-4" style={{ color: "#112A43" }}>
                        Asset Revenue Trends
                      </h3>
                      <Card className="rounded-2xl shadow-md">
                        <CardHeader className="pb-4">
                          <CardTitle className="text-lg flex items-center gap-2">
                            Revenue Projections
                            <Popover>
                              <PopoverTrigger>
                                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <p className="text-sm">
                                  Revenue projections showing baseline scenario (solid line) and potential retrofit
                                  benefits (dashed line) based on selected retrofit options.
                                </p>
                              </PopoverContent>
                            </Popover>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-64 mb-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={riskData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis tickFormatter={(value) => `$${value}M`} />
                                <Tooltip />
                                <defs>
                                  <linearGradient id="revenueBaselineGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2B6CA9" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#2B6CA9" stopOpacity={0.1} />
                                  </linearGradient>
                                </defs>
                                <Area
                                  type="monotone"
                                  dataKey="revenue"
                                  stroke="none"
                                  fill="url(#revenueBaselineGradient)"
                                />
                                <Line
                                  type="monotone"
                                  dataKey="revenue"
                                  stroke="#2B6CA9"
                                  strokeWidth={3}
                                  dot={{ fill: "#2B6CA9", r: 4 }}
                                  name="Baseline Revenue"
                                />
                                <Line
                                  type="monotone"
                                  dataKey="revenueRetrofit"
                                  stroke="#10b981"
                                  strokeWidth={3}
                                  strokeDasharray="8 4"
                                  dot={{ fill: "#10b981", r: 4 }}
                                  name="With Retrofits"
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                                <TrendingUp className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-sm">Baseline revenue trajectory</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                                <Leaf className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-sm">Revenue with retrofit benefits</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Asset Expense Trends */}
                    <div>
                      <h3 className="text-xl font-bold mb-4" style={{ color: "#112A43" }}>
                        Asset Expense Trends
                      </h3>
                      <Card className="rounded-2xl shadow-md">
                        <CardHeader className="pb-4">
                          <CardTitle className="text-lg flex items-center gap-2">
                            Expense Projections
                            <Popover>
                              <PopoverTrigger>
                                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <p className="text-sm">
                                  Operating expense projections showing baseline scenario (solid line) and potential
                                  savings from retrofit investments (dashed line).
                                </p>
                              </PopoverContent>
                            </Popover>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-64 mb-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={riskData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis tickFormatter={(value) => `$${value}M`} />
                                <Tooltip />
                                <defs>
                                  <linearGradient id="expenseBaselineGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                                  </linearGradient>
                                </defs>
                                <Area
                                  type="monotone"
                                  dataKey="expenses"
                                  stroke="none"
                                  fill="url(#expenseBaselineGradient)"
                                />
                                <Line
                                  type="monotone"
                                  dataKey="expenses"
                                  stroke="#ef4444"
                                  strokeWidth={3}
                                  dot={{ fill: "#ef4444", r: 4 }}
                                  name="Baseline Expenses"
                                />
                                <Line
                                  type="monotone"
                                  dataKey="expenseRetrofit"
                                  stroke="#10b981"
                                  strokeWidth={3}
                                  strokeDasharray="8 4"
                                  dot={{ fill: "#10b981", r: 4 }}
                                  name="With Retrofits"
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                                <Zap className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-sm">Baseline expense trajectory</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                                <Shield className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-sm">Expenses with retrofit savings</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Update Asset Risk KPIs */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between" style={{ color: "#112A43" }}>
                  Asset Risk KPIs
                  <Select defaultValue="energy-efficiency">
                    <SelectTrigger className="w-48 rounded-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="energy-efficiency">Energy Efficiency</SelectItem>
                      <SelectItem value="retrofit-cost">Retrofit Cost</SelectItem>
                      <SelectItem value="regulatory-shocks">Regulatory Shocks</SelectItem>
                    </SelectContent>
                  </Select>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Asset Average</span>
                    <span className="font-bold text-lg" style={{ color: "#2B6CA9" }}>
                      85 kWh/m²/yr
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Local Benchmark</span>
                    <span className="text-gray-600">95 kWh/m²/yr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Potential Improvement</span>
                    <span className="font-bold text-green-600">-15 kWh/m²/yr</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Update Key Takeaways */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle style={{ color: "#112A43" }}>Key Takeaways</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#99EFE4" }}
                  >
                    <AlertTriangle className="w-6 h-6" style={{ color: "#112A43" }} />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold mb-1">Retrofit Recommended</div>
                    <div className="text-gray-600">Upgrade windows & insulation</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#66DCCC" }}
                  >
                    <DollarSign className="w-6 h-6" style={{ color: "#112A43" }} />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold mb-1">Cost of Retrofit</div>
                    <div className="text-gray-600">$2.1M estimated total cost</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#99EFE4" }}
                  >
                    <TrendingUp className="w-6 h-6" style={{ color: "#112A43" }} />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold mb-1">Effects on Cashflows</div>
                    <div className="text-gray-600">+$180K revenue, -$95K expenses annually</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Update Asset Financial Impact - remove TTM revenue */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle style={{ color: "#112A43" }}>Asset Financial Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Change to DSCR</span>
                  <span className="font-bold text-lg text-red-600">{financialMetrics.dscr}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">LTV Directionality</span>
                  <span className="font-bold text-lg text-orange-600">{financialMetrics.ltv}</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Annual Debt Payment</span>
                    <span className="font-bold text-lg" style={{ color: "#2B6CA9" }}>
                      $2.8M
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Add export buttons at the bottom of the page */}
      {/* Export Buttons */}
      <div className="flex justify-center gap-4 mt-8 pt-8 border-t border-gray-200">
        <Button
          onClick={() => exportToCSV(selectedAssets, riskData, financialMetrics)}
          variant="outline"
          className="rounded-full bg-transparent px-8 py-3"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
        <Button
          onClick={() => exportToPDF(selectedAssets, financialMetrics)}
          variant="outline"
          className="rounded-full bg-transparent px-8 py-3"
        >
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>
    </div>
  )
}
