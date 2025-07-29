"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface ScenarioModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (scenario: CustomScenario) => void
}

export interface CustomScenario {
  name: string
  energyPrices: number
  carbonTax: number
  regulatoryIntensity: number
}

export function ScenarioModal({ isOpen, onClose, onSave }: ScenarioModalProps) {
  const [scenario, setScenario] = useState<CustomScenario>({
    name: "",
    energyPrices: 50,
    carbonTax: 30,
    regulatoryIntensity: 60,
  })

  const handleSave = () => {
    if (scenario.name.trim()) {
      onSave(scenario)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold" style={{ color: "#112A43" }}>
            Create Custom Scenario
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <Label htmlFor="scenarioName" className="text-sm font-semibold text-gray-700">
              Scenario Name
            </Label>
            <Input
              id="scenarioName"
              placeholder="Enter scenario name..."
              value={scenario.name}
              onChange={(e) => setScenario({ ...scenario, name: e.target.value })}
              className="rounded-full mt-2 h-12"
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-4 block">
              Energy Prices (% change from baseline)
            </Label>
            <div className="px-4">
              <Slider
                value={[scenario.energyPrices]}
                onValueChange={(value) => setScenario({ ...scenario, energyPrices: value[0] })}
                max={200}
                min={-50}
                step={5}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>-50%</span>
              <span className="font-bold" style={{ color: "#2B6CA9" }}>
                {scenario.energyPrices > 0 ? "+" : ""}
                {scenario.energyPrices}%
              </span>
              <span>+200%</span>
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-4 block">Carbon Tax ($/tonne CO2)</Label>
            <div className="px-4">
              <Slider
                value={[scenario.carbonTax]}
                onValueChange={(value) => setScenario({ ...scenario, carbonTax: value[0] })}
                max={150}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>$0</span>
              <span className="font-bold" style={{ color: "#2B6CA9" }}>
                ${scenario.carbonTax}
              </span>
              <span>$150</span>
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-4 block">
              Regulatory Intensity (implementation speed)
            </Label>
            <div className="px-4">
              <Slider
                value={[scenario.regulatoryIntensity]}
                onValueChange={(value) => setScenario({ ...scenario, regulatoryIntensity: value[0] })}
                max={100}
                min={0}
                step={10}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Slow</span>
              <span className="font-bold" style={{ color: "#2B6CA9" }}>
                {scenario.regulatoryIntensity}%
              </span>
              <span>Rapid</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onClose} className="rounded-full bg-transparent">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!scenario.name.trim()}
            className="rounded-full text-white"
            style={{ backgroundColor: "#2B6CA9" }}
          >
            Save Scenario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
