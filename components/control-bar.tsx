"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HelpCircle, Settings } from "lucide-react"
import { ScenarioModal, type CustomScenario } from "./scenario-modal"
import { Input } from "@/components/ui/input"

interface ControlBarProps {
  onScenarioChange: (scenario: string, customData?: CustomScenario) => void
  onPaymentChange: (method: "upfront" | "loan", loanCoverage?: number, loanTerm?: number, interestRate?: number) => void
}

export function ControlBar({ onScenarioChange, onPaymentChange }: ControlBarProps) {
  const [scenario, setScenario] = useState("baseline")
  const [paymentMethod, setPaymentMethod] = useState<"upfront" | "loan">("upfront")
  const [loanCoverage, setLoanCoverage] = useState(80)
  const [loanTerm, setLoanTerm] = useState(25)
  const [interestRate, setInterestRate] = useState(5.5)
  const [showScenarioModal, setShowScenarioModal] = useState(false)
  const [customScenarios, setCustomScenarios] = useState<CustomScenario[]>([])

  const handleScenarioChange = (value: string) => {
    setScenario(value)
    if (value === "custom") {
      setShowScenarioModal(true)
    } else {
      onScenarioChange(value)
    }
  }

  const handlePaymentMethodChange = (isLoan: boolean) => {
    const method = isLoan ? "loan" : "upfront"
    setPaymentMethod(method)
    onPaymentChange(method, isLoan ? loanCoverage : undefined, isLoan ? loanTerm : undefined)
  }

  const handleLoanCoverageChange = (value: number[]) => {
    setLoanCoverage(value[0])
    onPaymentChange("loan", value[0], loanTerm, interestRate)
  }

  const handleLoanTermChange = (value: string) => {
    const term = Number.parseInt(value) || 25
    setLoanTerm(term)
    onPaymentChange("loan", loanCoverage, term, interestRate)
  }

  const handleInterestRateChange = (value: string) => {
    const rate = Number.parseFloat(value) || 5.5
    setInterestRate(rate)
    onPaymentChange("loan", loanCoverage, loanTerm, rate)
  }

  const handleCustomScenarioSave = (customScenario: CustomScenario) => {
    setCustomScenarios([...customScenarios, customScenario])
    setScenario(`custom-${customScenario.name}`)
    onScenarioChange(`custom-${customScenario.name}`, customScenario)
  }

  return (
    <>
      <Card className="rounded-2xl shadow-lg mb-8" style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Climate Scenario Controls */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5" style={{ color: "#2B6CA9" }} />
                <h3 className="text-lg font-bold" style={{ color: "#112A43" }}>
                  Transition Scenario Controls
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <Label htmlFor="scenario" className="text-sm font-semibold text-gray-700 min-w-[80px]">
                  Scenario
                </Label>
                <Select value={scenario} onValueChange={handleScenarioChange}>
                  <SelectTrigger className="rounded-full h-10 flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baseline">Baseline</SelectItem>
                    <SelectItem value="aggressive">Aggressive Transition</SelectItem>
                    <SelectItem value="delayed">Delayed Policy</SelectItem>
                    {customScenarios.map((cs) => (
                      <SelectItem key={cs.name} value={`custom-${cs.name}`}>
                        {cs.name} (Custom)
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">+ Create Custom Scenario</SelectItem>
                  </SelectContent>
                </Select>
                <Popover>
                  <PopoverTrigger>
                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Baseline:</strong> Current policy trajectory with moderate climate action
                      </p>
                      <p>
                        <strong>Aggressive Transition:</strong> Rapid decarbonization with strong policy support
                      </p>
                      <p>
                        <strong>Delayed Policy:</strong> Slower climate action with policy uncertainty
                      </p>
                      <p>
                        <strong>Custom:</strong> Define your own energy prices, carbon tax, and regulatory timeline
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {scenario.startsWith("custom-") && (
                <div className="p-4 rounded-xl" style={{ backgroundColor: "#99EFE4" }}>
                  <div className="text-sm font-semibold mb-2" style={{ color: "#112A43" }}>
                    Active Custom Scenario
                  </div>
                  <div className="text-xs" style={{ color: "#112A43" }}>
                    {customScenarios.find((cs) => `custom-${cs.name}` === scenario)?.name || "Custom scenario active"}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Structure Controls */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5" style={{ color: "#2B6CA9" }} />
                <h3 className="text-lg font-bold" style={{ color: "#112A43" }}>
                  Payment Structure Controls
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <Label htmlFor="payment-method" className="text-sm font-semibold text-gray-700 min-w-[120px]">
                  Payment Method
                </Label>
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${paymentMethod === "upfront" ? "font-bold" : "text-gray-500"}`}>
                    Upfront
                  </span>
                  <Switch
                    id="payment-method"
                    checked={paymentMethod === "loan"}
                    onCheckedChange={handlePaymentMethodChange}
                  />
                  <span className={`text-sm ${paymentMethod === "loan" ? "font-bold" : "text-gray-500"}`}>Loan</span>
                </div>
                <Popover>
                  <PopoverTrigger>
                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Upfront:</strong> Full payment of climate adaptation costs immediately
                      </p>
                      <p>
                        <strong>Loan:</strong> Finance climate investments over time with customizable terms
                      </p>
                      <p>This affects DSCR, LTV ratios, and NOI forecasting calculations</p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {paymentMethod === "loan" && (
                <div className="space-y-4 p-4 rounded-xl" style={{ backgroundColor: "#66DCCC" }}>
                  <div className="flex items-center gap-3">
                    <Label className="text-sm font-semibold min-w-[140px]" style={{ color: "#112A43" }}>
                      Loan Coverage (%)
                    </Label>
                    <div className="flex-1 px-3">
                      <Slider
                        value={[loanCoverage]}
                        onValueChange={handleLoanCoverageChange}
                        max={100}
                        min={50}
                        step={5}
                        className="w-full"
                      />
                    </div>
                    <span className="text-sm font-bold min-w-[40px]" style={{ color: "#112A43" }}>
                      {loanCoverage}%
                    </span>
                    <Popover>
                      <PopoverTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-600 hover:text-gray-800" />
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <p className="text-sm">
                          Percentage of climate adaptation costs covered by loan financing. Higher coverage reduces
                          upfront capital requirements but increases debt service.
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex items-center gap-3">
                    <Label className="text-sm font-semibold min-w-[140px]" style={{ color: "#112A43" }}>
                      Interest Rate (%)
                    </Label>
                    <Input
                      type="number"
                      value={interestRate}
                      onChange={(e) => handleInterestRateChange(e.target.value)}
                      className="rounded-full h-10 flex-1"
                      placeholder="5.5"
                      step="0.1"
                      min="0"
                      max="20"
                    />
                    <Popover>
                      <PopoverTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-600 hover:text-gray-800" />
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <p className="text-sm">
                          Annual interest rate for the climate adaptation loan. This affects monthly payments and total
                          cost of financing.
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex items-center gap-3">
                    <Label className="text-sm font-semibold min-w-[140px]" style={{ color: "#112A43" }}>
                      Loan Term (Years)
                    </Label>
                    <Input
                      type="number"
                      value={loanTerm}
                      onChange={(e) => handleLoanTermChange(e.target.value)}
                      className="rounded-full h-10 flex-1"
                      placeholder="25"
                      min="1"
                      max="50"
                    />
                    <Popover>
                      <PopoverTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-600 hover:text-gray-800" />
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <p className="text-sm">
                          Loan repayment period in years. Longer terms reduce annual payments but increase total
                          interest costs and affect long-term DSCR calculations.
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Impact Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">Active Configuration:</span> {scenario.replace("custom-", "")} scenario,{" "}
                {paymentMethod} payment
                {paymentMethod === "loan" && ` (${loanCoverage}% coverage, ${loanTerm}yr term, ${interestRate}% rate)`}
              </div>
              <div className="text-xs text-gray-500">Changes affect DSCR, LTV, and NOI projections in real-time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ScenarioModal
        isOpen={showScenarioModal}
        onClose={() => setShowScenarioModal(false)}
        onSave={handleCustomScenarioSave}
      />
    </>
  )
}
