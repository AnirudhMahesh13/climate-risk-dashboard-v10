import { Check, Search, FileText, BarChart3 } from "lucide-react"

interface MultiAssetStepperProps {
  currentAsset: number
  totalAssets: number
  currentStep: number
}

export function MultiAssetStepper({ currentAsset, totalAssets, currentStep }: MultiAssetStepperProps) {
  const steps = ["Search", "Overview", "Analysis"]

  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return Search
      case 1:
        return FileText
      case 2:
        return BarChart3
      default:
        return Search
    }
  }

  return (
    <div className="flex items-center justify-center mb-8">
      {/* Main Steps */}
      <div className="flex items-center">
        {steps.map((step, index) => {
          const Icon = getIcon(index)
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

      {/* Asset Progress Indicator */}
      {currentStep === 1 && totalAssets > 1 && (
        <div className="ml-12 flex items-center">
          <div className="w-px h-12 bg-gray-300 mx-4"></div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Property Progress</div>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalAssets }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${i + 1 === currentAsset ? "shadow-lg" : ""}`}
                  style={{
                    backgroundColor: i + 1 <= currentAsset ? "#66DCCC" : "#e5e7eb",
                    boxShadow: i + 1 === currentAsset ? "0 2px 8px rgba(102, 220, 204, 0.4)" : undefined,
                  }}
                />
              ))}
            </div>
            <div className="text-xs font-semibold mt-1" style={{ color: "#2B6CA9" }}>
              {currentAsset} of {totalAssets}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
