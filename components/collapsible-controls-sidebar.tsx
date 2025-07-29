"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronLeft, ChevronRight, HelpCircle, ChevronDown } from "lucide-react"
import { ScenarioModal, type CustomScenario } from "./scenario-modal"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface CollapsibleControlsSidebarProps {
  onScenarioChange: (scenario: string, customData?: CustomScenario) => void
  onPaymentChange: (method: "upfront" | "loan", loanCoverage?: number, loanTerm?: number, interestRate?: number) => void
}

export function CollapsibleControlsSidebar({ onScenarioChange, onPaymentChange }: CollapsibleControlsSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [scenario, setScenario] = useState("baseline")
  const [locationAdjustment, setLocationAdjustment] = useState("moderate")
  const [paymentMethod, setPaymentMethod] = useState<"upfront" | "loan">("upfront")
  const [loanCoverage, setLoanCoverage] = useState([75])
  const [loanTerm, setLoanTerm] = useState([25])
  const [interestRate, setInterestRate] = useState([5.5])
  const [showScenarioModal, setShowScenarioModal] = useState(false)
  const [installationYear, setInstallationYear] = useState("2025")

  const handleScenarioChange = (newScenario: string) => {
    setScenario(newScenario)
    if (newScenario === "custom") {
      setShowScenarioModal(true)
    } else {
      onScenarioChange(newScenario)
    }
  }

  const handleCustomScenario = (customData: CustomScenario) => {
    onScenarioChange(`custom-${Date.now()}`, customData)
    setShowScenarioModal(false)
  }

  const handlePaymentMethodChange = (method: "upfront" | "loan") => {
    setPaymentMethod(method)
    if (method === "loan") {
      onPaymentChange(method, loanCoverage[0], loanTerm[0], interestRate[0])
    } else {
      onPaymentChange(method)
    }
  }

  const handleLoanParameterChange = () => {
    if (paymentMethod === "loan") {
      onPaymentChange(paymentMethod, loanCoverage[0], loanTerm[0], interestRate[0])
    }
  }

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 z-50 ${
          isCollapsed ? "w-12" : "w-80"
        }`}
      >
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute -right-10 top-4 bg-white shadow-md rounded-r-lg"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>

        {!isCollapsed && (
          <div className="p-6 space-y-6 h-full overflow-y-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2" style={{ color: "#112A43" }}>
                Analysis Controls
              </h2>
              <p className="text-sm text-gray-600">Adjust scenario and payment parameters</p>
            </div>

            {/* Climate Scenario */}
            <Card className="rounded-2xl shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg" style={{ color: "#112A43" }}>
                  Transition Scenario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Scenario</label>
                  <Select value={scenario} onValueChange={handleScenarioChange}>
                    <SelectTrigger className="rounded-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baseline">Baseline</SelectItem>
                      <SelectItem value="2-degree-delayed">2 Degree Delayed</SelectItem>
                      <SelectItem value="2-degree-immediate">2 Degree Immediate</SelectItem>
                      <SelectItem value="custom">Custom Scenario</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium">Location Adjustment</label>
                    <Popover>
                      <PopoverTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <p className="text-sm">
                          Adjusts climate risk projections based on local geographic factors and regional climate
                          patterns. Mild: Conservative regional adjustments. Moderate: Standard regional factors.
                          Aggressive: Enhanced regional climate sensitivity.
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Select value={locationAdjustment} onValueChange={setLocationAdjustment}>
                    <SelectTrigger className="rounded-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mild">Mild</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Payment Structure */}
            <Card className="rounded-2xl shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg" style={{ color: "#112A43" }}>
                  Payment Structure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Payment Method</label>
                  <Select value={paymentMethod} onValueChange={handlePaymentMethodChange}>
                    <SelectTrigger className="rounded-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upfront">Pay Upfront</SelectItem>
                      <SelectItem value="loan">Finance with Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod === "loan" && (
                  <div className="space-y-4 pt-2 border-t">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Loan Coverage: {loanCoverage[0]}%</label>
                      <Slider
                        value={loanCoverage}
                        onValueChange={(value) => {
                          setLoanCoverage(value)
                          handleLoanParameterChange()
                        }}
                        max={100}
                        min={50}
                        step={5}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Loan Term: {loanTerm[0]} years</label>
                      <Slider
                        value={loanTerm}
                        onValueChange={(value) => {
                          setLoanTerm(value)
                          handleLoanParameterChange()
                        }}
                        max={30}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Interest Rate: {interestRate[0]}%</label>
                      <Slider
                        value={interestRate}
                        onValueChange={(value) => {
                          setInterestRate(value)
                          handleLoanParameterChange()
                        }}
                        max={8}
                        min={3}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Retrofit Choices */}
            <Card className="rounded-2xl shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg" style={{ color: "#112A43" }}>
                    Retrofit Choices
                  </CardTitle>
                  <div className="flex flex-col items-end">
                    <label className="text-xs font-medium mb-1 text-gray-600">Installation Year</label>
                    <Select value={installationYear} onValueChange={setInstallationYear}>
                      <SelectTrigger className="w-20 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-32">
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                        <SelectItem value="2027">2027</SelectItem>
                        <SelectItem value="2028">2028</SelectItem>
                        <SelectItem value="2029">2029</SelectItem>
                        <SelectItem value="2030">2030</SelectItem>
                        <SelectItem value="2031">2031</SelectItem>
                        <SelectItem value="2032">2032</SelectItem>
                        <SelectItem value="2033">2033</SelectItem>
                        <SelectItem value="2034">2034</SelectItem>
                        <SelectItem value="2035">2035</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Upgrade heating & cooling systems */}
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left rounded-xl hover:bg-gray-50 transition-colors">
                      <span className="font-semibold text-sm">Upgrade heating & cooling systems</span>
                      <ChevronDown className="w-4 h-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4 pt-3 space-y-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox id="heat-pump-electric" className="w-4 h-4" />
                        <div className="flex items-center gap-2 flex-1">
                          <div className="flex gap-1">
                            <div className="w-8 h-4 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-800">
                              $12
                            </div>
                            <div className="w-8 h-4 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-800">
                              -25%
                            </div>
                          </div>
                          <label htmlFor="heat-pump-electric" className="text-sm cursor-pointer">
                            Heat pump (electric)
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="heat-pump-hybrid" className="w-4 h-4" />
                        <div className="flex items-center gap-2 flex-1">
                          <div className="flex gap-1">
                            <div className="w-8 h-4 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-800">
                              $15
                            </div>
                            <div className="w-8 h-4 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-800">
                              -20%
                            </div>
                          </div>
                          <label htmlFor="heat-pump-hybrid" className="text-sm cursor-pointer">
                            Heat pump (hybrid)
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="replace-chiller" className="w-4 h-4" />
                        <div className="flex items-center gap-2 flex-1">
                          <div className="flex gap-1">
                            <div className="w-8 h-4 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-800">
                              $18
                            </div>
                            <div className="w-8 h-4 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-800">
                              -30%
                            </div>
                          </div>
                          <label htmlFor="replace-chiller" className="text-sm cursor-pointer">
                            Replace chiller
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="smart-thermostat" className="w-4 h-4" />
                        <div className="flex items-center gap-2 flex-1">
                          <div className="flex gap-1">
                            <div className="w-8 h-4 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-800">
                              $2
                            </div>
                            <div className="w-8 h-4 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-800">
                              -8%
                            </div>
                          </div>
                          <label htmlFor="smart-thermostat" className="text-sm cursor-pointer">
                            Smart thermostat
                          </label>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Improve insulation */}
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left rounded-xl hover:bg-gray-50 transition-colors">
                      <span className="font-semibold text-sm">Improve insulation</span>
                      <ChevronDown className="w-4 h-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4 pt-3 space-y-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox id="solar-shading" className="w-4 h-4" />
                        <div className="flex items-center gap-2 flex-1">
                          <div className="flex gap-1">
                            <div className="w-8 h-4 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-800">
                              $8
                            </div>
                            <div className="w-8 h-4 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-800">
                              -12%
                            </div>
                          </div>
                          <label htmlFor="solar-shading" className="text-sm cursor-pointer">
                            Install solar shading
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="replace-glazing" className="w-4 h-4" />
                        <div className="flex items-center gap-2 flex-1">
                          <div className="flex gap-1">
                            <div className="w-8 h-4 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-800">
                              $25
                            </div>
                            <div className="w-8 h-4 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-800">
                              -18%
                            </div>
                          </div>
                          <label htmlFor="replace-glazing" className="text-sm cursor-pointer">
                            Replace glazing
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="insulate-walls" className="w-4 h-4" />
                        <div className="flex items-center gap-2 flex-1">
                          <div className="flex gap-1">
                            <div className="w-8 h-4 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-800">
                              $14
                            </div>
                            <div className="w-8 h-4 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-800">
                              -15%
                            </div>
                          </div>
                          <label htmlFor="insulate-walls" className="text-sm cursor-pointer">
                            Insulate walls
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="insulate-roof" className="w-4 h-4" />
                        <div className="flex items-center gap-2 flex-1">
                          <div className="flex gap-1">
                            <div className="w-8 h-4 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-800">
                              $10
                            </div>
                            <div className="w-8 h-4 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-800">
                              -10%
                            </div>
                          </div>
                          <label htmlFor="insulate-roof" className="text-sm cursor-pointer">
                            Insulate roof
                          </label>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Make other interventions */}
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left rounded-xl hover:bg-gray-50 transition-colors">
                      <span className="font-semibold text-sm">Make other interventions</span>
                      <ChevronDown className="w-4 h-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4 pt-3 space-y-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox id="led-lighting" className="w-4 h-4" />
                        <div className="flex items-center gap-2 flex-1">
                          <div className="flex gap-1">
                            <div className="w-8 h-4 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-800">
                              $3
                            </div>
                            <div className="w-8 h-4 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-800">
                              -5%
                            </div>
                          </div>
                          <label htmlFor="led-lighting" className="text-sm cursor-pointer">
                            Upgrade to LED lighting
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="solar-panels" className="w-4 h-4" />
                        <div className="flex items-center gap-2 flex-1">
                          <div className="flex gap-1">
                            <div className="w-8 h-4 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-800">
                              $20
                            </div>
                            <div className="w-8 h-4 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-800">
                              -35%
                            </div>
                          </div>
                          <label htmlFor="solar-panels" className="text-sm cursor-pointer">
                            Install solar panels
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="solar-thermal" className="w-4 h-4" />
                        <div className="flex items-center gap-2 flex-1">
                          <div className="flex gap-1">
                            <div className="w-8 h-4 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-800">
                              $16
                            </div>
                            <div className="w-8 h-4 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-800">
                              -22%
                            </div>
                          </div>
                          <label htmlFor="solar-thermal" className="text-sm cursor-pointer">
                            Install solar thermal collector
                          </label>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <ScenarioModal
        isOpen={showScenarioModal}
        onClose={() => setShowScenarioModal(false)}
        onSave={handleCustomScenario}
      />
    </>
  )
}
