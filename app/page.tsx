import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, PieChart } from "lucide-react"

export default function HomePage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: `
          linear-gradient(135deg, 
            #1D3C51 0%, 
            #112A43 12.11%, 
            #348095 32.93%, 
            #99EFE4 65.87%, 
            #66DCCC 84.13%, 
            #2B6CA9 100%
          )
        `,
      }}
    >
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <svg width="120" height="120" viewBox="0 0 301 301" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#paint0_angular_109_2_clip_path)" data-figma-skip-parse="true">
                <g transform="matrix(0.0247662 0.0314107 -0.0773489 0.0609869 143.5 124)">
                  <foreignObject x="-2345.05" y="-2345.05" width="4690.1" height="4690.1">
                    <div
                      xmlns="http://www.w3.org/1999/xhtml"
                      style={{
                        background:
                          "conic-gradient(from 90deg,rgba(29, 60, 81, 1) 0deg,rgba(17, 42, 67, 1) 12.1088deg,rgba(52, 128, 149, 1) 118.558deg,rgba(153, 239, 228, 1) 237.115deg,rgba(29, 60, 81, 1) 360deg)",
                        height: "100%",
                        width: "100%",
                        opacity: 1,
                      }}
                    ></div>
                  </foreignObject>
                </g>
              </g>
              <path
                d="M99.9159 164H45C45 164 55.896 142.365 75.9447 117.208C95.9934 92.0504 123.451 84 145.243 84C167.035 84 190.135 92.0503 211.491 117.208C232.847 142.365 242 164 242 164H186.212C176.976 89.7217 119.904 63.9235 99.9159 164Z"
                fill="url(#paint0_angular_gradient)"
              />
              <path
                d="M112.916 164H58C58 164 68.896 142.365 88.9447 117.208C108.993 92.0504 136.451 84 158.243 84C180.035 84 203.135 92.0503 224.491 117.208C245.847 142.365 255 164 255 164H199.212C189.976 89.7217 132.904 63.9235 112.916 164Z"
                fill="url(#paint1_linear_109_2)"
              />
              <path
                d="M99.288 178.54L108.055 178.693L126.662 223.825L117.511 223.665L103.233 187.25L87.7558 223.146L78.7971 222.989L99.288 178.54ZM89.3922 206.404L116.076 206.87L115.954 213.845L89.2705 213.379L89.3922 206.404ZM156.116 179.532C161.918 179.633 166.373 181.055 169.483 183.798C172.593 186.541 174.106 190.344 174.021 195.207C173.932 200.284 172.285 204.202 169.079 206.963C165.873 209.723 161.369 211.053 155.567 210.951L145.457 210.775L145.224 224.149L136.649 223.999L137.431 179.206L156.116 179.532ZM155.691 203.849C158.891 203.904 161.378 203.222 163.152 201.802C164.927 200.382 165.84 198.201 165.891 195.257C165.94 192.442 165.102 190.336 163.377 188.94C161.652 187.502 159.19 186.755 155.991 186.699L145.88 186.523L145.581 203.672L155.691 203.849ZM155.304 207.682L163.687 207.829L174.403 224.658L164.677 224.488L155.304 207.682ZM220.378 193.136C218.831 191.317 216.979 189.876 214.821 188.814C212.664 187.71 210.497 187.138 208.322 187.1C206.231 187.064 204.262 187.435 202.413 188.214C200.608 188.95 198.989 190.031 197.556 191.457C196.166 192.841 195.071 194.465 194.271 196.329C193.47 198.192 193.051 200.212 193.013 202.388C192.975 204.563 193.323 206.618 194.057 208.551C194.792 210.441 195.83 212.102 197.171 213.534C198.554 214.966 200.134 216.103 201.912 216.945C203.732 217.788 205.687 218.227 207.778 218.264C209.953 218.302 212.116 217.87 214.265 216.969C216.415 216.025 218.337 214.735 220.03 213.101L224.992 218.5C223.472 220.01 221.721 221.324 219.739 222.441C217.799 223.559 215.757 224.42 213.613 225.023C211.512 225.583 209.374 225.845 207.198 225.807C203.913 225.749 200.852 225.12 198.014 223.918C195.219 222.675 192.773 220.989 190.677 218.861C188.623 216.735 187.023 214.253 185.878 211.416C184.733 208.58 184.188 205.562 184.244 202.363C184.3 199.12 184.950 196.145 186.192 193.435C187.435 190.683 189.162 188.281 191.374 186.229C193.586 184.176 196.11 182.599 198.946 181.496C201.824 180.394 204.949 179.873 208.319 179.931C210.494 179.969 212.601 180.305 214.638 180.938C216.719 181.529 218.688 182.374 220.547 183.473C222.406 184.53 224.048 185.817 225.472 187.336L220.378 193.136Z"
                fill="#232323"
              />
              <defs>
                <clipPath id="paint0_angular_109_2_clip_path">
                  <path d="M99.9159 164H45C45 164 55.896 142.365 75.9447 117.208C95.9934 92.0504 123.451 84 145.243 84C167.035 84 190.135 92.0503 211.491 117.208C232.847 142.365 242 164 242 164H186.212C176.976 89.7217 119.904 63.9235 99.9159 164Z" />
                </clipPath>
                <linearGradient
                  id="paint1_linear_109_2"
                  x1="255"
                  y1="124"
                  x2="58"
                  y2="124"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#66DCCC" />
                  <stop offset="0.841346" stopColor="#2B6CA9" />
                </linearGradient>
                <radialGradient
                  id="paint0_angular_gradient"
                  cx="143.5"
                  cy="124"
                  r="98.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0.033636" stopColor="#112A43" />
                  <stop offset="0.329327" stopColor="#348095" />
                  <stop offset="0.658654" stopColor="#99EFE4" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          <h1 className="text-5xl font-bold mb-6 text-white drop-shadow-lg">Transition Risk Analytics</h1>
          <p className="text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
            Advanced transition-financial risk assessment for commercial real estate portfolios
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto h-[600px]">
          {/* Asset Analysis Card */}
          <Link href="/asset/search" className="group h-full">
            <Card className="h-full hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden rounded-3xl transform group-hover:-translate-y-2 bg-white/95 backdrop-blur-sm">
              <div className="h-48 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400">
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10"></div>
                <div className="absolute top-8 left-8">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
              <CardContent className="p-10 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-6" style={{ color: "#112A43" }}>
                    Asset Analysis
                  </h2>
                  <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                    Analyze individual commercial buildings for transition transition risks, energy efficiency, and
                    future resilience scenarios with comprehensive financial modeling.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Badge
                    variant="secondary"
                    className="rounded-full px-6 py-3 text-sm font-medium"
                    style={{ backgroundColor: "#99EFE4", color: "#112A43" }}
                  >
                    Risk Forecasting
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="rounded-full px-6 py-3 text-sm font-medium"
                    style={{ backgroundColor: "#66DCCC", color: "#112A43" }}
                  >
                    Financial Impact
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Portfolio Overview Card */}
          <Link href="/portfolio/filter" className="group h-full">
            <Card className="h-full hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden rounded-3xl transform group-hover:-translate-y-2 bg-white/95 backdrop-blur-sm">
              <div className="h-48 relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500">
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10"></div>
                <div className="absolute top-8 left-8">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <PieChart className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
              <CardContent className="p-10 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-6" style={{ color: "#112A43" }}>
                    Portfolio Overview
                  </h2>
                  <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                    Comprehensive portfolio analysis across multiple properties with risk segmentation, exposure
                    management insights, and advanced financial modeling.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Badge
                    variant="secondary"
                    className="rounded-full px-6 py-3 text-sm font-medium"
                    style={{ backgroundColor: "#99EFE4", color: "#112A43" }}
                  >
                    Portfolio Metrics
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="rounded-full px-6 py-3 text-sm font-medium"
                    style={{ backgroundColor: "#66DCCC", color: "#112A43" }}
                  >
                    Risk Aggregation
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
