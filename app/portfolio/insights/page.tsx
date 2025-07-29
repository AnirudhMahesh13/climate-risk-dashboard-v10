"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Building, DollarSign, TrendingDown, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react"

// Mock data for Canada risk breakdown by loan value
const canadaRiskData = [
  {
    region: "Canada",
    highRisk: 850,
    mediumRisk: 1200,
    lowRisk: 950,
    total: 3000,
  },
]

// Mock data for regional breakdown (top 3 regions with highest risk)
const regionalRiskData = [
  {
    region: "Alberta",
    highRisk: 320,
    mediumRisk: 280,
    lowRisk: 180,
    avgNOILoss: "8.2%",
    highRiskAmount: "$320M",
    lendingOpportunity: "$180M",
  },
  {
    region: "Ontario",
    highRisk: 280,
    mediumRisk: 450,
    lowRisk: 380,
    avgNOILoss: "6.8%",
    highRiskAmount: "$280M",
    lendingOpportunity: "$380M",
  },
  {
    region: "Quebec",
    highRisk: 250,
    mediumRisk: 470,
    lowRisk: 390,
    avgNOILoss: "7.1%",
    highRiskAmount: "$250M",
    lendingOpportunity: "$390M",
  },
]

export default function PortfolioInsightsPage() {
  const [isExpanded, setIsExpanded] = useState(false)

  const portfolioStats = {
    totalProperties: "1,247",
    loanValue: "$3.0B",
    noiLoss: "7.4%",
    probabilityChange: "+12.3%",
  }

  const keyInsights = [
    "Energy costs driving 45% of NOI decline",
    "Alberta properties show highest risk concentration",
    "Retrofit opportunities worth $520M identified",
    "Regulatory changes accelerating in 2024-2025",
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: "#112A43" }}>
            Portfolio Key Insights
          </h1>
          <p className="text-xl text-gray-600">Comprehensive climate risk analysis across your entire portfolio</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8 max-w-6xl mx-auto">
          {[
            {
              label: "Total Properties",
              value: portfolioStats.totalProperties,
              icon: Building,
              color: "#2B6CA9",
            },
            {
              label: "Loan Value",
              value: portfolioStats.loanValue,
              icon: DollarSign,
              color: "#10b981",
            },
            {
              label: "NOI Loss",
              value: portfolioStats.noiLoss,
              icon: TrendingDown,
              color: "#ef4444",
            },
            {
              label: "Change to Probability of Default",
              value: portfolioStats.probabilityChange,
              icon: AlertTriangle,
              color: "#f59e0b",
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

        {/* Main Analysis Card */}
        <div className="max-w-7xl mx-auto">
          <Card className="rounded-2xl shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl" style={{ color: "#112A43" }}>
                  Risk Analysis Dashboard
                </CardTitle>
                <Button variant="outline" onClick={() => setIsExpanded(!isExpanded)} className="rounded-full">
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Collapse
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Expand Regional View
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-8">
                {/* Risk Breakdown Chart */}
                <div className="col-span-2">
                  <Card className="rounded-2xl shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg" style={{ color: "#112A43" }}>
                        Risk Breakdown by Loan Value (Canada)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={canadaRiskData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="region" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" tickFormatter={(value) => `$${value}M`} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                              }}
                              formatter={(value) => [`$${value}M`, ""]}
                            />
                            <Bar dataKey="highRisk" stackId="risk" fill="#ef4444" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="mediumRisk" stackId="risk" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="lowRisk" stackId="risk" fill="#10b981" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                          <span className="text-sm">High Risk</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm">Medium Risk</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Low Risk</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Key Insights */}
                  <Card className="rounded-2xl shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg" style={{ color: "#112A43" }}>
                        Key Risk Drivers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {keyInsights.map((insight, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div
                              className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                              style={{ backgroundColor: "#2B6CA9" }}
                            />
                            <span className="text-sm text-gray-700">{insight}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* High Risk Loans */}
                  <Card className="rounded-2xl shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg" style={{ color: "#112A43" }}>
                        High Risk Exposure
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600 mb-2">$850M</div>
                        <div className="text-sm text-gray-600">Loans at High Risk</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Lending Opportunities */}
                  <Card className="rounded-2xl shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg" style={{ color: "#112A43" }}>
                        Lending Opportunities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">$950M</div>
                        <div className="text-sm text-gray-600">Low Risk Opportunities</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Expanded Regional View */}
              {isExpanded && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-2xl font-bold mb-6" style={{ color: "#112A43" }}>
                    Regional Risk Analysis - Top Risk Regions
                  </h3>
                  <div className="grid grid-cols-3 gap-8">
                    {regionalRiskData.map((region, index) => (
                      <Card key={index} className="rounded-2xl shadow-md">
                        <CardHeader>
                          <CardTitle className="text-lg" style={{ color: "#112A43" }}>
                            {region.region}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-48 mb-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={[region]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="region" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" tickFormatter={(value) => `$${value}M`} />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: "white",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                  }}
                                  formatter={(value) => [`$${value}M`, ""]}
                                />
                                <Bar dataKey="highRisk" stackId="risk" fill="#ef4444" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="mediumRisk" stackId="risk" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="lowRisk" stackId="risk" fill="#10b981" radius={[8, 8, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>

                          {/* Regional Metrics */}
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-600">Avg NOI Loss:</span>
                              <Badge
                                className="rounded-full px-3 py-1 text-xs font-bold"
                                style={{ backgroundColor: "#ef4444", color: "white" }}
                              >
                                {region.avgNOILoss}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-600">High Risk Amount:</span>
                              <Badge
                                className="rounded-full px-3 py-1 text-xs font-bold"
                                style={{ backgroundColor: "#f59e0b", color: "white" }}
                              >
                                {region.highRiskAmount}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-600">Lending Opportunity:</span>
                              <Badge
                                className="rounded-full px-3 py-1 text-xs font-bold"
                                style={{ backgroundColor: "#10b981", color: "white" }}
                              >
                                {region.lendingOpportunity}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
