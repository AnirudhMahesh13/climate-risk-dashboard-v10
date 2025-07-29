"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
} from "recharts"
import { Stepper } from "@/components/stepper"
import { CollapsibleControlsSidebar } from "@/components/collapsible-controls-sidebar"
import { HelpCircle, TrendingUp, DollarSign, Shield, Building, Settings, Zap, Leaf, Download } from "lucide-react"
import type { CustomScenario } from "@/components/scenario-modal"
import { mockProperties } from "@/lib/mock-data"

const basePortfolioData = [
  { category: "Ontario", propertyCount: 45, dollarValue: 2.1, highRisk: 15, mediumRisk: 60, lowRisk: 25 },
  { category: "Quebec", propertyCount: 32, dollarValue: 1.8, highRisk: 20, mediumRisk: 55, lowRisk: 25 },
  { category: "BC", propertyCount: 28, dollarValue: 2.4, highRisk: 10, mediumRisk: 65, lowRisk: 25 },
  { category: "Alberta", propertyCount: 18, dollarValue: 1.2, highRisk: 25, mediumRisk: 50, lowRisk: 25 },
]

const baseRiskTrendData = [
  {
    year: 2024,
    risk: 6.8,
    revenue: 45.2,
    expenses: 18.3,
    noi: 26.9,
    revenuePayFines: 8.2,
    revenueRetrofit: 8.8,
    expensePayFines: 2.8,
    expenseRetrofit: 1.8,
  },
  {
    year: 2026,
    risk: 7.2,
    revenue: 47.1,
    expenses: 19.8,
    noi: 27.3,
    revenuePayFines: 8.4,
    revenueRetrofit: 9.2,
    expensePayFines: 3.2,
    expenseRetrofit: 1.8,
  },
  {
    year: 2028,
    risk: 7.8,
    revenue: 49.3,
    expenses: 21.5,
    noi: 27.8,
    revenuePayFines: 8.6,
    revenueRetrofit: 9.8,
    expensePayFines: 3.8,
    expenseRetrofit: 1.8,
  },
  {
    year: 2030,
    risk: 8.4,
    revenue: 51.8,
    expenses: 23.4,
    noi: 28.4,
    revenuePayFines: 8.8,
    revenueRetrofit: 10.4,
    expensePayFines: 4.5,
    expenseRetrofit: 1.9,
  },
  {
    year: 2035,
    risk: 9.6,
    revenue: 58.2,
    expenses: 28.1,
    noi: 30.1,
    revenuePayFines: 9.2,
    revenueRetrofit: 11.8,
    expensePayFines: 5.8,
    expenseRetrofit: 1.8,
  },
  {
    year: 2040,
    risk: 10.8,
    revenue: 65.4,
    expenses: 33.8,
    noi: 31.6,
    revenuePayFines: 9.8,
    revenueRetrofit: 12.6,
    expensePayFines: 7.2,
    expenseRetrofit: 1.8,
  },
  {
    year: 2045,
    risk: 12.1,
    revenue: 73.2,
    expenses: 40.2,
    noi: 33.0,
    revenuePayFines: 10.2,
    revenueRetrofit: 13.4,
    expensePayFines: 8.8,
    expenseRetrofit: 1.6,
  },
  {
    year: 2050,
    risk: 13.5,
    revenue: 81.8,
    expenses: 47.5,
    noi: 34.3,
    revenuePayFines: 10.8,
    revenueRetrofit: 14.0,
    expensePayFines: 10.5,
    expenseRetrofit: 1.7,
  },
]

const allTableColumns = [
  { key: "address", label: "Address", enabled: true },
  { key: "risk", label: "Risk Rating", enabled: true },
  { key: "noiChange", label: "NOI Change", enabled: true },
  { key: "dscrChange", label: "DSCR Change", enabled: true },
  { key: "ltvDirection", label: "LTV Direction", enabled: false },
  { key: "efficiency", label: "Energy Efficiency", enabled: false },
  { key: "retrofitCost", label: "Cost per Retrofit", enabled: false },
  { key: "regulatoryShocks", label: "Avg. Regulatory Shocks", enabled: false },
]

const tableData = [
  {
    address: "123 Bay Street, Toronto",
    risk: "Medium",
    noiChange: "+2.3%",
    dscrChange: "-0.15",
    ltvDirection: "↑",
    efficiency: "B+",
    retrofitCost: "$2.1M",
    regulatoryShocks: "3.2",
  },
  {
    address: "456 King Street, Vancouver",
    risk: "High",
    noiChange: "-1.8%",
    dscrChange: "-0.22",
    ltvDirection: "↑",
    efficiency: "C",
    retrofitCost: "$3.4M",
    regulatoryShocks: "4.1",
  },
  {
    address: "789 Queen Street, Montreal",
    risk: "Low",
    noiChange: "+4.1%",
    dscrChange: "+0.08",
    ltvDirection: "↓",
    efficiency: "A-",
    retrofitCost: "$1.2M",
    regulatoryShocks: "2.1",
  },
  {
    address: "321 Main Street, Calgary",
    risk: "Medium",
    noiChange: "+1.2%",
    dscrChange: "-0.05",
    ltvDirection: "→",
    efficiency: "B",
    retrofitCost: "$1.8M",
    regulatoryShocks: "2.8",
  },
]

// Generate mock time series data for CSV export
const generateTimeSeriesData = (property: any) => {
  const years = Array.from({ length: 27 }, (_, i) => 2024 + i)
  return years.map((year) => {
    const baseMultiplier = 1 + (year - 2024) * 0.02
    const volatility = 0.1

    return {
      year,
      propertyId: property.id,
      address: property.address,
      // Financial metrics
      noiMax: property.netOperatingIncome * baseMultiplier * (1 + volatility),
      noiMin: property.netOperatingIncome * baseMultiplier * (1 - volatility),
      noiExpected: property.netOperatingIncome * baseMultiplier,
      revenueMax: property.ttmRevenue * baseMultiplier * (1 + volatility),
      revenueMin: property.ttmRevenue * baseMultiplier * (1 - volatility),
      revenueExpected: property.ttmRevenue * baseMultiplier,
      expenseMax: property.operatingExpenses * baseMultiplier * (1 + volatility),
      expenseMin: property.operatingExpenses * baseMultiplier * (1 - volatility),
      expenseExpected: property.operatingExpenses * baseMultiplier,
      // Determinant variables
      estimatedEnergyIntensity: 85 + Math.random() * 20,
      cremEnergyIntensityPathway: 0.95 + Math.random() * 0.1,
      jumpRate: 0.15 + Math.random() * 0.1,
      jumpRateGreenPremiumAdj: property.greenCertifications !== "none" ? 0.85 : 1.0,
      jumpRateHeatSourceAdj: property.heatSource === "solar" ? 0.8 : property.heatSource === "natural-gas" ? 1.2 : 1.0,
      jumpMagnitudeFines: 50000 + Math.random() * 100000,
      jumpMagnitudeRetrofit: 25000 + Math.random() * 50000,
      carbonPricing: 50 + (year - 2024) * 5 + Math.random() * 10,
      baselineInflationExpectations: 0.02 + Math.random() * 0.01,
      annualRevenueGrowthRate: 0.03 + Math.random() * 0.02,
      revenueVacancyRateAdj: 0.95 + Math.random() * 0.05,
      revenueGreenPremiumAdj: property.greenCertifications !== "none" ? 1.05 : 1.0,
    }
  })
}

export default function PortfolioOverviewPage() {
  const [chartView, setChartView] = useState("propertyCount")
  const [breakdownBy, setBreakdownBy] = useState("province")
  const [expandedCharts, setExpandedCharts] = useState(false)
  const [tableColumns, setTableColumns] = useState(allTableColumns)
  const [portfolioData, setPortfolioData] = useState(basePortfolioData)
  const [riskTrendData, setRiskTrendData] = useState(baseRiskTrendData)
  const [portfolioMetrics, setPortfolioMetrics] = useState({
    totalProperties: "123",
    portfolioValue: "$7.5B",
    avgRiskNumber: "6.8",
    avgNOIChange: "+1.4%",
    avgDSCR: "-0.08",
    ltvDirection: "↑ Increasing",
    riskExposure: "$1.2B",
  })

  const toggleColumn = (key: string) => {
    setTableColumns((prev) => prev.map((col) => (col.key === key ? { ...col, enabled: !col.enabled } : col)))
  }

  const enabledColumns = tableColumns.filter((col) => col.enabled)

  const handleScenarioChange = (scenario: string, customData?: CustomScenario) => {
    let multiplier = 1
    switch (scenario) {
      case "aggressive":
        multiplier = 0.8
        break
      case "delayed":
        multiplier = 1.3
        break
      default:
        if (scenario.startsWith("custom-") && customData) {
          const energyImpact = (customData.energyPrices - 50) / 100
          const carbonImpact = customData.carbonTax / 100
          const regulatoryImpact = (customData.regulatoryIntensity - 50) / 100
          multiplier = 1 + energyImpact + carbonImpact + regulatoryImpact
        }
        break
    }

    const updatedRiskData = baseRiskTrendData.map((item) => ({
      ...item,
      risk: item.risk * multiplier,
      expenses: item.expenses * (1 + (multiplier - 1) * 0.5),
      revenue: item.revenue * (1 + (multiplier - 1) * 0.2),
      noi: item.noi * (1 + (multiplier - 1) * 0.3),
    }))

    const updatedPortfolioData = basePortfolioData.map((item) => ({
      ...item,
      highRisk: Math.min(100, item.highRisk * multiplier),
      mediumRisk: Math.max(0, item.mediumRisk * (2 - multiplier)),
      lowRisk: Math.max(0, item.lowRisk * (2 - multiplier)),
    }))

    setRiskTrendData(updatedRiskData)
    setPortfolioData(updatedPortfolioData)

    setPortfolioMetrics({
      ...portfolioMetrics,
      avgRiskNumber: (6.8 * multiplier).toFixed(1),
      avgNOIChange: `${multiplier > 1 ? "-" : "+"}${Math.abs((multiplier - 1) * 2).toFixed(1)}%`,
      riskExposure: `$${(1.2 * multiplier).toFixed(1)}B`,
    })
  }

  const handlePaymentChange = (
    method: "upfront" | "loan",
    loanCoverage?: number,
    loanTerm?: number,
    interestRate?: number,
  ) => {
    if (method === "loan" && loanCoverage && loanTerm && interestRate) {
      const dscrImpact = (loanCoverage / 100) * (interestRate / 5.5) * (30 / loanTerm) * 0.1
      const ltvImpact = loanCoverage > 75 ? "↑ Increasing" : "→ Stable"

      setPortfolioMetrics({
        ...portfolioMetrics,
        avgDSCR: `-${(0.08 + dscrImpact).toFixed(2)}`,
        ltvDirection: ltvImpact,
      })
    } else {
      setPortfolioMetrics({
        ...portfolioMetrics,
        avgDSCR: "-0.08",
        ltvDirection: "↑ Increasing",
      })
    }
  }

  const exportCSV = () => {
    const allTimeSeriesData = mockProperties.flatMap((property) => generateTimeSeriesData(property))

    const headers = [
      "Year",
      "Property ID",
      "Address",
      "NOI Max",
      "NOI Min",
      "NOI Expected",
      "Revenue Max",
      "Revenue Min",
      "Revenue Expected",
      "Expense Max",
      "Expense Min",
      "Expense Expected",
      "Estimated Energy Intensity",
      "CREM Energy Intensity Pathway",
      "Jump Rate",
      "Jump Rate Green Premium Adj",
      "Jump Rate Heat Source Adj",
      "Jump Magnitude (Fines)",
      "Jump Magnitude (Retrofit)",
      "Carbon Pricing",
      "Baseline Inflation Expectations",
      "Annual Revenue Growth Rate",
      "Revenue Vacancy Rate Adj",
      "Revenue Green Premium Adj",
    ]

    const csvContent = [
      headers.join(","),
      ...allTimeSeriesData.map((row) =>
        [
          row.year,
          row.propertyId,
          `"${row.address}"`,
          row.noiMax.toFixed(2),
          row.noiMin.toFixed(2),
          row.noiExpected.toFixed(2),
          row.revenueMax.toFixed(2),
          row.revenueMin.toFixed(2),
          row.revenueExpected.toFixed(2),
          row.expenseMax.toFixed(2),
          row.expenseMin.toFixed(2),
          row.expenseExpected.toFixed(2),
          row.estimatedEnergyIntensity.toFixed(2),
          row.cremEnergyIntensityPathway.toFixed(4),
          row.jumpRate.toFixed(4),
          row.jumpRateGreenPremiumAdj.toFixed(4),
          row.jumpRateHeatSourceAdj.toFixed(4),
          row.jumpMagnitudeFines.toFixed(2),
          row.jumpMagnitudeRetrofit.toFixed(2),
          row.carbonPricing.toFixed(2),
          row.baselineInflationExpectations.toFixed(4),
          row.annualRevenueGrowthRate.toFixed(4),
          row.revenueVacancyRateAdj.toFixed(4),
          row.revenueGreenPremiumAdj.toFixed(4),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "portfolio-climate-risk-analysis.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportPDF = () => {
    // Generate comprehensive PDF report content as HTML
    const retrofitOptions = [
      {
        name: "Upgrade windows & insulation",
        cost: "$1.2M - $2.8M",
        revenueImpact: "+2.5% to +4.2%",
        expenseImpact: "-8% to -15%",
        annualRevenue: "+$180K - $320K",
        annualExpense: "-$65K - $120K",
        bestFor: "Older buildings (pre-2010) in colder climates",
        paybackPeriod: "5.2 - 7.8 years",
        description:
          "Enhanced thermal performance through high-efficiency windows and improved insulation reduces heating and cooling loads while increasing tenant comfort and satisfaction.",
      },
      {
        name: "Upgrade cooling & heating",
        cost: "$800K - $2.1M",
        revenueImpact: "+1.8% to +3.5%",
        expenseImpact: "-12% to -22%",
        annualRevenue: "+$140K - $280K",
        annualExpense: "-$95K - $180K",
        bestFor: "Large office buildings with high energy consumption",
        paybackPeriod: "3.8 - 6.2 years",
        description:
          "Modern HVAC systems with smart controls and variable frequency drives optimize energy usage and reduce operational costs significantly.",
      },
      {
        name: "Upgrade lighting & energy management",
        cost: "$400K - $900K",
        revenueImpact: "+1.2% to +2.8%",
        expenseImpact: "-5% to -12%",
        annualRevenue: "+$85K - $210K",
        annualExpense: "-$40K - $95K",
        bestFor: "Retail and mixed-use properties with extended operating hours",
        paybackPeriod: "2.8 - 4.5 years",
        description:
          "LED lighting systems with occupancy sensors and daylight harvesting reduce electricity consumption by up to 40% while improving lighting quality.",
      },
      {
        name: "Install solar panels",
        cost: "$1.5M - $3.2M",
        revenueImpact: "+3.2% to +5.8%",
        expenseImpact: "-15% to -28%",
        annualRevenue: "+$240K - $450K",
        annualExpense: "-$120K - $230K",
        bestFor: "Properties with large roof areas in sunny locations",
        paybackPeriod: "4.2 - 8.1 years",
        description:
          "On-site renewable energy generation with battery storage and grid tie-in capabilities provides long-term energy cost stability and carbon reduction.",
      },
    ]

    const propertyRecommendations = [
      {
        type: "Office Buildings (45 properties)",
        primaryRecommendation: "Upgrade cooling & heating",
        secondaryRecommendation: "Upgrade lighting & energy management",
        rationale:
          "High energy consumption from HVAC systems makes heating/cooling upgrades most impactful. Extended operating hours benefit from lighting efficiency.",
        expectedROI: "18-24%",
        totalInvestment: "$68M",
        annualSavings: "$14.2M",
      },
      {
        type: "Retail Properties (32 properties)",
        primaryRecommendation: "Upgrade lighting & energy management",
        secondaryRecommendation: "Install solar panels",
        rationale:
          "Extended operating hours and high lighting loads make LED upgrades most cost-effective. Large roof areas suitable for solar installation.",
        expectedROI: "22-28%",
        totalInvestment: "$42M",
        annualSavings: "$10.8M",
      },
      {
        type: "Mixed-Use (28 properties)",
        primaryRecommendation: "Upgrade windows & insulation",
        secondaryRecommendation: "Upgrade cooling & heating",
        rationale:
          "Diverse tenant mix benefits from improved thermal comfort. Building envelope improvements provide consistent benefits across all uses.",
        expectedROI: "16-21%",
        totalInvestment: "$58M",
        annualSavings: "$11.4M",
      },
      {
        type: "Industrial (18 properties)",
        primaryRecommendation: "Install solar panels",
        secondaryRecommendation: "Upgrade lighting & energy management",
        rationale:
          "Large roof areas and high daytime energy consumption make solar highly effective. Industrial lighting upgrades offer significant savings.",
        expectedROI: "20-26%",
        totalInvestment: "$35M",
        annualSavings: "$8.1M",
      },
    ]

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Portfolio Climate Risk Analysis Report</title>
  <style>
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      margin: 0; 
      padding: 40px; 
      line-height: 1.6; 
      color: #333;
      background: white;
    }
    .header { 
      text-align: center; 
      margin-bottom: 40px; 
      border-bottom: 3px solid #2B6CA9;
      padding-bottom: 30px;
      page-break-after: avoid;
    }
    .header h1 {
      color: #112A43;
      font-size: 2.5em;
      margin-bottom: 10px;
      font-weight: 700;
    }
    .header p {
      color: #666;
      font-size: 1.2em;
      margin: 5px 0;
    }
    .executive-summary {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 40px;
      border-left: 5px solid #2B6CA9;
      page-break-inside: avoid;
      page-break-after: avoid;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin: 25px 0;
      page-break-inside: avoid;
    }
    .metric-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-top: 3px solid #2B6CA9;
    }
    .metric-value {
      font-size: 2em;
      font-weight: bold;
      color: #2B6CA9;
      margin-bottom: 5px;
    }
    .metric-label {
      color: #666;
      font-size: 0.9em;
      font-weight: 600;
    }
    .section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }
    .section h2 {
      color: #112A43;
      font-size: 1.8em;
      margin-bottom: 20px;
      border-bottom: 2px solid #99EFE4;
      padding-bottom: 10px;
      page-break-after: avoid;
    }
    .retrofit-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 25px;
      margin: 25px 0;
      page-break-inside: avoid;
    }
    .retrofit-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      transition: transform 0.2s;
      page-break-inside: avoid;
    }
    .retrofit-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.12);
    }
    .retrofit-card h3 {
      color: #112A43;
      font-size: 1.3em;
      margin-bottom: 15px;
      font-weight: 600;
    }
    .retrofit-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin: 15px 0;
    }
    .detail-item {
      background: #f8fafc;
      padding: 12px;
      border-radius: 6px;
      border-left: 3px solid #66DCCC;
    }
    .detail-label {
      font-weight: 600;
      color: #112A43;
      font-size: 0.9em;
      margin-bottom: 3px;
    }
    .detail-value {
      color: #2B6CA9;
      font-weight: 700;
    }
    .description {
      background: #f0f9ff;
      padding: 15px;
      border-radius: 8px;
      margin-top: 15px;
      font-style: italic;
      color: #1e40af;
      border-left: 4px solid #3b82f6;
    }
    .property-recommendations {
      background: #fefefe;
      border-radius: 12px;
      padding: 30px;
      margin: 30px 0;
      border: 1px solid #e2e8f0;
      page-break-inside: avoid;
    }
    .property-card {
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border-radius: 10px;
      padding: 25px;
      margin: 20px 0;
      border-left: 5px solid #10b981;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      page-break-inside: avoid;
    }
    .property-card h4 {
      color: #112A43;
      font-size: 1.2em;
      margin-bottom: 15px;
      font-weight: 600;
    }
    .recommendation-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 15px 0;
    }
    .recommendation-item {
      background: white;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .recommendation-label {
      font-weight: 600;
      color: #059669;
      font-size: 0.9em;
      margin-bottom: 5px;
    }
    .recommendation-value {
      color: #112A43;
      font-weight: 500;
    }
    .financial-summary {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      padding: 25px;
      border-radius: 12px;
      margin: 20px 0;
      border: 1px solid #10b981;
    }
    .financial-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 15px;
    }
    .financial-item {
      text-align: center;
      background: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    }
    .financial-item .value {
      font-size: 1.4em;
      font-weight: bold;
      color: #059669;
      margin-bottom: 5px;
    }
    .financial-item .label {
      color: #666;
      font-size: 0.9em;
    }
    .conclusion {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      padding: 30px;
      border-radius: 12px;
      margin-top: 40px;
      border-left: 5px solid #f59e0b;
      page-break-inside: avoid;
    }
    .conclusion h3 {
      color: #92400e;
      font-size: 1.4em;
      margin-bottom: 15px;
    }
    @media print {
      body { margin: 20px; }
      .retrofit-grid { 
        grid-template-columns: 1fr; 
        page-break-inside: avoid;
      }
      .metrics-grid { 
        grid-template-columns: repeat(2, 1fr); 
        page-break-inside: avoid;
      }
      .section {
        page-break-inside: avoid;
      }
      .property-recommendations {
        page-break-before: auto;
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Portfolio Climate Risk Analysis Report</h1>
    <p>Comprehensive Retrofit Investment Analysis</p>
    <p>Generated: ${new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}</p>
  </div>
  
  <div class="executive-summary">
    <h2 style="margin-top: 0; color: #112A43;">Executive Summary</h2>
    <p>This report analyzes the climate risk exposure and retrofit opportunities across your ${portfolioMetrics.totalProperties}-property portfolio valued at ${portfolioMetrics.portfolioValue}. Our analysis identifies significant opportunities to reduce operational costs, increase revenue, and mitigate climate-related financial risks through strategic building improvements.</p>
    
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-value">${portfolioMetrics.totalProperties}</div>
        <div class="metric-label">Total Properties</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${portfolioMetrics.portfolioValue}</div>
        <div class="metric-label">Portfolio Value</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${portfolioMetrics.avgRiskNumber}</div>
        <div class="metric-label">Average Risk Score</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${portfolioMetrics.avgNOIChange}</div>
        <div class="metric-label">Projected NOI Impact</div>
      </div>
    </div>
  </div>
  
  <div class="section">
    <h2>Retrofit Investment Analysis</h2>
    <p>The following analysis presents four key retrofit strategies, their associated costs, and projected financial impacts on your portfolio's future revenues and expenses compared to baseline performance.</p>
    
    <div class="retrofit-grid">
      ${retrofitOptions
        .map(
          (option) => `
        <div class="retrofit-card">
          <h3>${option.name}</h3>
          <div class="retrofit-details">
            <div class="detail-item">
              <div class="detail-label">Investment Cost</div>
              <div class="detail-value">${option.cost}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Payback Period</div>
              <div class="detail-value">${option.paybackPeriod}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Annual Revenue Impact</div>
              <div class="detail-value">${option.annualRevenue}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Annual Expense Savings</div>
              <div class="detail-value">${option.annualExpense}</div>
            </div>
          </div>
          <div class="description">
            <strong>Best Suited For:</strong> ${option.bestFor}<br><br>
            ${option.description}
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
  </div>
  
  <div class="section">
    <h2>Property Type Recommendations</h2>
    <p>Based on our analysis of building characteristics, energy consumption patterns, and operational requirements, the following recommendations are tailored to maximize ROI for each property type in your portfolio.</p>
    
    <div class="property-recommendations">
      ${propertyRecommendations
        .map(
          (property) => `
        <div class="property-card">
          <h4>${property.type}</h4>
          <div class="recommendation-grid">
            <div class="recommendation-item">
              <div class="recommendation-label">Primary Recommendation</div>
              <div class="recommendation-value">${property.primaryRecommendation}</div>
            </div>
            <div class="recommendation-item">
              <div class="recommendation-label">Secondary Recommendation</div>
              <div class="recommendation-value">${property.secondaryRecommendation}</div>
            </div>
          </div>
          <p style="margin: 15px 0; color: #374151;"><strong>Rationale:</strong> ${property.rationale}</p>
          <div class="financial-summary">
            <div class="financial-grid">
              <div class="financial-item">
                <div class="value">${property.expectedROI}</div>
                <div class="label">Expected ROI</div>
              </div>
              <div class="financial-item">
                <div class="value">${property.totalInvestment}</div>
                <div class="label">Total Investment</div>
              </div>
              <div class="financial-item">
                <div class="value">${property.annualSavings}</div>
                <div class="label">Annual Savings</div>
              </div>
            </div>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
  </div>
  
  <div class="conclusion">
    <h3>Strategic Implementation Roadmap</h3>
    <p><strong>Phase 1 (Year 1):</strong> Begin with lighting & energy management upgrades across retail and mixed-use properties. These improvements offer the shortest payback period and generate immediate cash flow to fund subsequent phases.</p>
    
    <p><strong>Phase 2 (Years 2-3):</strong> Implement HVAC system upgrades in office buildings and industrial properties. Focus on buildings with the highest energy consumption and oldest systems for maximum impact.</p>
    
    <p><strong>Phase 3 (Years 3-5):</strong> Execute building envelope improvements (windows & insulation) in older properties, particularly in colder climates where heating loads are significant.</p>
    
    <p><strong>Phase 4 (Years 4-6):</strong> Install solar panel systems on properties with optimal roof conditions and high daytime energy consumption, prioritizing industrial and retail properties with large roof areas.</p>
    
    <p><strong>Expected Portfolio Impact:</strong> Full implementation of this roadmap is projected to reduce portfolio-wide operating expenses by 15-25%, increase net operating income by $44.5M annually, and significantly improve climate resilience across all properties.</p>
  </div>
</body>
</html>
`

    // Create a new window and write the HTML content
    const printWindow = window.open("", "_blank", "width=800,height=600")
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()

      // Wait for content to load, then trigger print dialog
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.focus()
          printWindow.print()
        }, 500)
      }
    } else {
      // Fallback: create downloadable HTML file
      const blob = new Blob([htmlContent], { type: "text/html" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "portfolio-climate-risk-report.html"
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Collapsible Controls Sidebar */}
      <div className="fixed top-0 left-0 z-50">
        <CollapsibleControlsSidebar onScenarioChange={handleScenarioChange} onPaymentChange={handlePaymentChange} />
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Page Title and Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: "#112A43" }}>
            Portfolio View
          </h1>
          <p className="text-xl text-gray-600">Explore your filtered portfolio's climate and financial risk summary.</p>
        </div>

        <Stepper steps={["Filter", "View"]} currentStep={1} type="portfolio" />

        {/* Top Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8 max-w-6xl mx-auto">
          {[
            { label: "Total Properties", value: portfolioMetrics.totalProperties, icon: Building, color: "#2B6CA9" },
            { label: "Total Loan Value", value: "$5.4B", icon: DollarSign, color: "#10b981" },
            {
              label: "Average Risk Number",
              value: portfolioMetrics.avgRiskNumber,
              icon: Shield,
              color: "#f59e0b",
            },
            {
              label: "Average Change to NOI",
              value: portfolioMetrics.avgNOIChange,
              icon: TrendingUp,
              color: "#8b5cf6",
            },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <Icon className="w-8 h-8 mx-auto mb-3" style={{ color: stat.color }} />
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
            {/* Portfolio Distribution Chart */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between" style={{ color: "#112A43" }}>
                  <div className="flex items-center gap-3">
                    <Building className="w-6 h-6" />
                    Portfolio Distribution
                    <Popover>
                      <PopoverTrigger>
                        <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <p className="text-sm">
                          Portfolio breakdown showing property distribution and risk segmentation across different
                          categories with customizable views. Updates based on scenario selections.
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex gap-4">
                    <Select value={chartView} onValueChange={setChartView}>
                      <SelectTrigger className="w-40 rounded-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="propertyCount">Property Count</SelectItem>
                        <SelectItem value="dollarValue">Dollar Value</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={breakdownBy} onValueChange={setBreakdownBy}>
                      <SelectTrigger className="w-40 rounded-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="province">Province</SelectItem>
                        <SelectItem value="country">Country</SelectItem>
                        <SelectItem value="certification">Green Certification</SelectItem>
                        <SelectItem value="lob">LOB / Sub-LOB</SelectItem>
                        <SelectItem value="efficiency">Efficiency Range</SelectItem>
                        <SelectItem value="energy">Energy Source</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={portfolioData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="category" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "12px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Bar dataKey="highRisk" stackId="risk" fill="#ef4444" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="mediumRisk" stackId="risk" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="lowRisk" stackId="risk" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Risk Trend Analysis */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between" style={{ color: "#112A43" }}>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6" />
                    Risk Trend Analysis
                  </div>
                  <Popover>
                    <PopoverTrigger>
                      <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p className="text-sm">
                        Portfolio-wide transition risk trends from 2024 to 2050 with expandable revenue, expense, and
                        NOI projections. Updates in real-time based on scenario and payment structure selections.
                      </p>
                    </PopoverContent>
                  </Popover>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                      Add Benchmark
                    </Button>
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
                  Portfolio NOI
                </h3>
                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={riskTrendData}>
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
                      <Line
                        type="monotone"
                        dataKey="risk"
                        stroke="#2B6CA9"
                        strokeWidth={4}
                        dot={{ fill: "#2B6CA9", strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, stroke: "#2B6CA9", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {expandedCharts && (
                  <div className="space-y-12 mt-8 pt-8 border-t border-gray-200">
                    {/* Portfolio Revenue Trends - Single Chart */}
                    <div>
                      <h3 className="text-2xl font-bold mb-6" style={{ color: "#112A43" }}>
                        Portfolio Revenue Trends
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
                                  Portfolio revenue projections showing baseline scenario (solid line) and potential
                                  retrofit benefits (dashed line) based on selected retrofit options in Analysis
                                  Controls.
                                </p>
                              </PopoverContent>
                            </Popover>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-64 mb-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={riskTrendData}>
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
                                <defs>
                                  <linearGradient id="portfolioRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2B6CA9" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#2B6CA9" stopOpacity={0.1} />
                                  </linearGradient>
                                </defs>
                                <Area
                                  type="monotone"
                                  dataKey="revenue"
                                  stroke="none"
                                  fill="url(#portfolioRevenueGradient)"
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

                    {/* Portfolio Expense Trends - Single Chart */}
                    <div>
                      <h3 className="text-2xl font-bold mb-6" style={{ color: "#112A43" }}>
                        Portfolio Expense Trends
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
                                  Portfolio operating expense projections showing baseline scenario (solid line) and
                                  potential savings from retrofit investments (dashed line) selected in Analysis
                                  Controls.
                                </p>
                              </PopoverContent>
                            </Popover>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-64 mb-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={riskTrendData}>
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
                                <defs>
                                  <linearGradient id="portfolioExpenseGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                                  </linearGradient>
                                </defs>
                                <Area
                                  type="monotone"
                                  dataKey="expenses"
                                  stroke="none"
                                  fill="url(#portfolioExpenseGradient)"
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

            {/* Portfolio Table */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between" style={{ color: "#112A43" }}>
                  <div className="flex items-center gap-3">
                    <Building className="w-6 h-6" />
                    Portfolio Properties
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                        <Settings className="w-4 h-4 mr-2" />
                        Columns ({enabledColumns.length})
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Select Columns to Display</h4>
                        {tableColumns.map((column) => (
                          <div key={column.key} className="flex items-center space-x-2">
                            <Checkbox
                              id={column.key}
                              checked={column.enabled}
                              onCheckedChange={() => toggleColumn(column.key)}
                              disabled={column.key === "address" || column.key === "risk"}
                            />
                            <label htmlFor={column.key} className="text-sm cursor-pointer">
                              {column.label}
                            </label>
                          </div>
                        ))}
                        <p className="text-xs text-gray-500 mt-2">Address and Risk Rating are always shown</p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        {enabledColumns.map((column) => (
                          <th key={column.key} className="text-left p-4 font-bold text-gray-700">
                            {column.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                          {enabledColumns.map((column) => (
                            <td key={column.key} className="p-4">
                              {column.key === "address" && (
                                <span className="font-semibold text-gray-900">{row.address}</span>
                              )}
                              {column.key === "risk" && (
                                <Badge
                                  className="rounded-full text-white font-bold px-3 py-1"
                                  style={{
                                    backgroundColor:
                                      row.risk === "High" ? "#ef4444" : row.risk === "Medium" ? "#f59e0b" : "#10b981",
                                  }}
                                >
                                  {row.risk}
                                </Badge>
                              )}
                              {column.key === "noiChange" && (
                                <span
                                  className={`font-bold ${row.noiChange.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                                >
                                  {row.noiChange}
                                </span>
                              )}
                              {column.key === "dscrChange" && (
                                <span
                                  className={`font-bold ${row.dscrChange.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                                >
                                  {row.dscrChange}
                                </span>
                              )}
                              {column.key === "ltvDirection" && (
                                <span className="text-2xl font-bold">{row.ltvDirection}</span>
                              )}
                              {column.key === "efficiency" && (
                                <Badge
                                  className="rounded-full font-bold"
                                  style={{ backgroundColor: "#99EFE4", color: "#112A43" }}
                                >
                                  {row.efficiency}
                                </Badge>
                              )}
                              {column.key === "retrofitCost" && (
                                <span className="font-semibold text-blue-600">{row.retrofitCost}</span>
                              )}
                              {column.key === "regulatoryShocks" && (
                                <span className="font-semibold">{row.regulatoryShocks}</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between" style={{ color: "#112A43" }}>
                  Portfolio Risk KPIs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 font-semibold text-sm border-b pb-2">
                    <div>Metric</div>
                    <div>Value</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Portfolio Average</div>
                    <div className="font-semibold" style={{ color: "#2B6CA9" }}>
                      85 kWh/m²/yr
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Benchmark</div>
                    <div className="text-gray-600">95 kWh/m²/yr</div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Retrofit Cost Average</div>
                      <div className="font-semibold" style={{ color: "#2B6CA9" }}>
                        $2.1M
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                      <div>Benchmark</div>
                      <div className="text-gray-600">$2.5M</div>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Regulatory Shocks</div>
                      <div className="font-semibold" style={{ color: "#2B6CA9" }}>
                        3.2 events/yr
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                      <div>Benchmark</div>
                      <div className="text-gray-600">2.8 events/yr</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle style={{ color: "#112A43" }}>Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#99EFE4" }}
                  >
                    <Shield className="w-4 h-4" style={{ color: "#112A43" }} />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold mb-1">NOI Breakdown</div>
                    <div className="text-gray-600">Rising expenses (65%) outpacing revenue growth (35%)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#66DCCC" }}
                  >
                    <Zap className="w-4 h-4" style={{ color: "#112A43" }} />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold mb-1">Main Drivers</div>
                    <div className="text-gray-600">Energy costs (40%), regulatory fines (35%), maintenance (25%)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#99EFE4" }}
                  >
                    <DollarSign className="w-4 h-4" style={{ color: "#112A43" }} />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold mb-1">Risk Concentration</div>
                    <div className="text-gray-600">Office buildings in Alberta show highest risk exposure</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle style={{ color: "#112A43" }}>Top Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="text-sm">
                    <div className="font-semibold mb-1">Retrofit Recommended</div>
                    <div className="text-gray-600">Upgrade cooling & heating systems</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="text-sm">
                    <div className="font-semibold mb-1">Cost of Retrofit</div>
                    <div className="text-gray-600">Estimated total cost: $2.8M</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="text-sm">
                    <div className="font-semibold mb-1">Effects on Cashflows</div>
                    <div className="text-gray-600">Revenue +3.2%, Expenses -18%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle style={{ color: "#112A43" }}>Portfolio Financial Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Average Change to DSCR</span>
                  <span className="font-bold text-lg text-red-600">{portfolioMetrics.avgDSCR}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">LTV Directionality</span>
                  <span className="font-bold text-lg text-orange-600">
                    {portfolioMetrics.ltvDirection.includes("↑")
                      ? "Up"
                      : portfolioMetrics.ltvDirection.includes("↓")
                        ? "Down"
                        : "Flat"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex justify-center gap-4 mt-8 pt-8 border-t border-gray-200">
          <Button onClick={exportCSV} variant="outline" className="rounded-full bg-transparent px-8 py-3">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={exportPDF} variant="outline" className="rounded-full bg-transparent px-8 py-3">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
