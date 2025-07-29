import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Building, PieChart, Zap, CheckCircle, Users } from "lucide-react"

export default function AboutPage() {
  const features = [
    {
      icon: Building,
      title: "Individual Asset Analysis",
      description:
        "Comprehensive climate risk assessment for individual commercial properties with detailed financial modeling.",
    },
    {
      icon: PieChart,
      title: "Portfolio Aggregation",
      description: "Advanced portfolio-level analysis with risk segmentation and exposure management insights.",
    },
    {
      icon: Zap,
      title: "Energy Efficiency Insights",
      description: "Detailed energy consumption analysis and efficiency improvement recommendations.",
    },
    {
      icon: CheckCircle,
      title: "Regulatory Compliance",
      description: "Stay ahead of evolving climate regulations and compliance requirements.",
    },
    {
      icon: Users,
      title: "Stakeholder Reporting",
      description: "Generate comprehensive reports for investors, lenders, and regulatory bodies.",
    },
    {
      icon: Shield,
      title: "Risk Forecasting",
      description: "Advanced transition scenario modeling with financial impact projections to 2050.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4" style={{ color: "#112A43" }}>
              About Transition Risk Analytics
            </h1>
            <p className="text-xl text-gray-600">
              Leading the future of transition-financial risk assessment for commercial real estate
            </p>
          </div>

          {/* Our Purpose Section */}
          <Card className="rounded-2xl mb-12">
            <CardHeader>
              <CardTitle className="text-2xl" style={{ color: "#112A43" }}>
                Our Purpose
              </CardTitle>
            </CardHeader>
            <CardContent className="text-lg leading-relaxed text-gray-700">
              <p className="mb-4">
                Transition Risk Analytics empowers commercial real estate professionals with advanced tools to assess,
                understand, and mitigate transition-related financial risks. Our platform combines cutting-edge
                transition science with sophisticated financial modeling to provide actionable insights for individual
                assets and entire portfolios.
              </p>
              <p className="mb-4">
                As transition change accelerates and regulatory requirements evolve, property owners, investors, and
                lenders need comprehensive solutions to navigate the complex landscape of transition risk. Our platform
                bridges the gap between transition data and financial decision-making, enabling stakeholders to make
                informed choices that protect value and ensure long-term resilience.
              </p>
              <p>
                We believe that proactive transition risk management is not just an environmental imperative, but a
                financial necessity. Our mission is to democratize access to sophisticated transition risk analytics,
                making it possible for organizations of all sizes to build transition-resilient real estate portfolios.
              </p>
            </CardContent>
          </Card>

          {/* Key Features Section */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl mb-6" style={{ color: "#112A43" }}>
                Key Features & Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "#99EFE4" }}
                      >
                        <Icon className="w-6 h-6" style={{ color: "#112A43" }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2" style={{ color: "#112A43" }}>
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: "#2B6CA9" }}>
                  500+
                </div>
                <div className="text-gray-600">Properties Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: "#2B6CA9" }}>
                  $50B+
                </div>
                <div className="text-gray-600">Assets Under Analysis</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: "#2B6CA9" }}>
                  2050
                </div>
                <div className="text-gray-600">Climate Projections</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
