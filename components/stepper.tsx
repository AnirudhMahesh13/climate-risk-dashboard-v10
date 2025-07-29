import { Check, Search, FileText, BarChart3, Filter, Eye } from "lucide-react"

interface StepperProps {
  steps: string[]
  currentStep: number
  type?: "asset" | "portfolio"
}

export function Stepper({ steps, currentStep, type = "asset" }: StepperProps) {
  const getIcon = (index: number, stepType: string) => {
    if (type === "asset") {
      switch (index) {
        case 0:
          return Search
        case 1:
          return FileText // This will now represent "Overview" instead of "Details"
        case 2:
          return BarChart3
        default:
          return Search
      }
    } else {
      switch (index) {
        case 0:
          return Filter
        case 1:
          return Eye
        default:
          return Filter
      }
    }
  }

  return (
    <div className="flex items-center justify-center mb-12">
      {steps.map((step, index) => {
        const Icon = getIcon(index, step)
        return (
          <div key={step} className="flex items-center">
            <div className="flex items-center">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
                  index < currentStep
                    ? "text-white shadow-lg"
                    : index === currentStep
                      ? "text-white shadow-xl"
                      : "bg-gray-200 text-gray-500 shadow-sm"
                }`}
                style={{
                  backgroundColor: index <= currentStep ? "#2B6CA9" : undefined,
                  boxShadow: index <= currentStep ? "0 4px 12px rgba(43, 108, 169, 0.3)" : undefined,
                }}
              >
                {index < currentStep ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
              </div>
              <span
                className={`ml-4 text-lg font-semibold ${index <= currentStep ? "text-gray-900" : "text-gray-500"}`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="w-20 h-1 bg-gray-200 mx-6 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500 rounded-full"
                  style={{
                    backgroundColor: index < currentStep ? "#2B6CA9" : "transparent",
                    width: index < currentStep ? "100%" : "0%",
                  }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
