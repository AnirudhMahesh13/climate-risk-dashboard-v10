export interface Property {
  id: number
  address: string
  city: string
  state: string
  country: string
  type: "Multi-family" | "Office" | "Industrial" | "Retail" | "Healthcare" | "Hospitality" | "Other"
  value: number // in dollars
  size: number // in square feet
  yearBuilt: number
  riskLevel: "high" | "medium" | "low"
  riskScore: number // 1-10
  ltv: number // percentage
  dscr: number
  heatSource: "Fossil Fuel" | "Electric" | "Hybrid"
  greenCertifications:
    | "none"
    | "LEED Gold"
    | "LEED Platinum"
    | "BOMA BEST Gold"
    | "BOMA BEST Platinum"
    | "BREEAM Excellent"
    | "BREEAM Outstanding"
    | "ENERGY STAR (>85)"
    | "ENERGY STAR for New Homes (v12.6+)"
    | "Toronto Green Standard (v4) (≥Tier 2)"
    | "Passive House Institute – EnerPHit"
    | "BC Energy Step Code (≥Step 3)"
    | "UK EPC (A)"
    | "UK EPC (B)"
  ttmRevenue: number
  annualDebtPayment: number
  netOperatingIncome: number
  operatingExpenses: number
  clientName: string // Added client name field
}

export const mockProperties: Property[] = [
  // New York Properties
  {
    id: 1,
    address: "432 Park Avenue",
    city: "New York",
    state: "NY",
    country: "USA",
    type: "Office",
    value: 125000000,
    size: 450000,
    yearBuilt: 2015,
    riskLevel: "medium",
    riskScore: 6.8,
    ltv: 72.5,
    dscr: 1.85,
    heatSource: "Fossil Fuel",
    greenCertifications: "LEED Gold",
    ttmRevenue: 18500000,
    annualDebtPayment: 8200000,
    netOperatingIncome: 12800000,
    operatingExpenses: 5700000,
    clientName: "Manhattan Real Estate Corp",
  },
  {
    id: 2,
    address: "1 World Trade Center",
    city: "New York",
    state: "NY",
    country: "USA",
    type: "Office",
    value: 285000000,
    size: 850000,
    yearBuilt: 2014,
    riskLevel: "high",
    riskScore: 8.2,
    ltv: 68.3,
    dscr: 2.15,
    heatSource: "Electric",
    greenCertifications: "LEED Platinum",
    ttmRevenue: 42000000,
    annualDebtPayment: 16800000,
    netOperatingIncome: 28500000,
    operatingExpenses: 13500000,
    clientName: "Global Investment Partners",
  },
  {
    id: 3,
    address: "555 Fifth Avenue",
    city: "New York",
    state: "NY",
    country: "USA",
    type: "Retail",
    value: 95000000,
    size: 180000,
    yearBuilt: 2008,
    riskLevel: "high",
    riskScore: 7.9,
    ltv: 75.2,
    dscr: 1.65,
    heatSource: "Fossil Fuel",
    greenCertifications: "ENERGY STAR (>85)",
    ttmRevenue: 14200000,
    annualDebtPayment: 7800000,
    netOperatingIncome: 9800000,
    operatingExpenses: 4400000,
    clientName: "Fifth Avenue Holdings LLC",
  },

  // San Francisco Properties
  {
    id: 4,
    address: "101 California Street",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    type: "Office",
    value: 165000000,
    size: 520000,
    yearBuilt: 2018,
    riskLevel: "medium",
    riskScore: 5.8,
    ltv: 69.8,
    dscr: 2.05,
    heatSource: "Electric",
    greenCertifications: "LEED Platinum",
    ttmRevenue: 24500000,
    annualDebtPayment: 11200000,
    netOperatingIncome: 17800000,
    operatingExpenses: 6700000,
    clientName: "Pacific Coast Properties",
  },
  {
    id: 5,
    address: "350 Mission Street",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    type: "Other",
    value: 220000000,
    size: 680000,
    yearBuilt: 2020,
    riskLevel: "low",
    riskScore: 4.2,
    ltv: 65.5,
    dscr: 2.45,
    heatSource: "Hybrid",
    greenCertifications: "LEED Platinum",
    ttmRevenue: 32800000,
    annualDebtPayment: 12500000,
    netOperatingIncome: 24200000,
    operatingExpenses: 8600000,
    clientName: "Bay Area Development Group",
  },

  // Chicago Properties
  {
    id: 6,
    address: "875 North Michigan Avenue",
    city: "Chicago",
    state: "IL",
    country: "USA",
    type: "Other",
    value: 145000000,
    size: 420000,
    yearBuilt: 2012,
    riskLevel: "medium",
    riskScore: 6.5,
    ltv: 71.8,
    dscr: 1.92,
    heatSource: "Fossil Fuel",
    greenCertifications: "LEED Gold",
    ttmRevenue: 21500000,
    annualDebtPayment: 9800000,
    netOperatingIncome: 15200000,
    operatingExpenses: 6300000,
    clientName: "Windy City Investments",
  },
  {
    id: 7,
    address: "150 North Riverside Plaza",
    city: "Chicago",
    state: "IL",
    country: "USA",
    type: "Office",
    value: 185000000,
    size: 580000,
    yearBuilt: 2017,
    riskLevel: "low",
    riskScore: 4.8,
    ltv: 67.2,
    dscr: 2.28,
    heatSource: "Electric",
    greenCertifications: "LEED Gold",
    ttmRevenue: 27500000,
    annualDebtPayment: 11800000,
    netOperatingIncome: 20100000,
    operatingExpenses: 7400000,
    clientName: "Riverside Commercial Trust",
  },

  // Boston Properties
  {
    id: 8,
    address: "200 Clarendon Street",
    city: "Boston",
    state: "MA",
    country: "USA",
    type: "Office",
    value: 135000000,
    size: 380000,
    yearBuilt: 2016,
    riskLevel: "medium",
    riskScore: 6.2,
    ltv: 73.5,
    dscr: 1.88,
    heatSource: "Fossil Fuel",
    greenCertifications: "ENERGY STAR (>85)",
    ttmRevenue: 19800000,
    annualDebtPayment: 9200000,
    netOperatingIncome: 14500000,
    operatingExpenses: 5300000,
    clientName: "New England Property Fund",
  },
  {
    id: 9,
    address: "100 Federal Street",
    city: "Boston",
    state: "MA",
    country: "USA",
    type: "Office",
    value: 98000000,
    size: 320000,
    yearBuilt: 2010,
    riskLevel: "high",
    riskScore: 7.6,
    ltv: 76.8,
    dscr: 1.72,
    heatSource: "Electric",
    greenCertifications: "LEED Gold",
    ttmRevenue: 14500000,
    annualDebtPayment: 7600000,
    netOperatingIncome: 10800000,
    operatingExpenses: 3700000,
    clientName: "Federal Street Associates",
  },

  // Seattle Properties
  {
    id: 10,
    address: "2001 Eighth Avenue",
    city: "Seattle",
    state: "WA",
    country: "USA",
    type: "Office",
    value: 175000000,
    size: 480000,
    yearBuilt: 2019,
    riskLevel: "low",
    riskScore: 3.9,
    ltv: 64.2,
    dscr: 2.52,
    heatSource: "Electric",
    greenCertifications: "LEED Platinum",
    ttmRevenue: 26200000,
    annualDebtPayment: 10100000,
    netOperatingIncome: 19800000,
    operatingExpenses: 6400000,
    clientName: "Emerald City Holdings",
  },
  {
    id: 11,
    address: "1918 Eighth Avenue",
    city: "Seattle",
    state: "WA",
    country: "USA",
    type: "Retail",
    value: 85000000,
    size: 220000,
    yearBuilt: 2013,
    riskLevel: "medium",
    riskScore: 5.5,
    ltv: 70.5,
    dscr: 1.95,
    heatSource: "Electric",
    greenCertifications: "ENERGY STAR (>85)",
    ttmRevenue: 12800000,
    annualDebtPayment: 6200000,
    netOperatingIncome: 9500000,
    operatingExpenses: 3300000,
    clientName: "Northwest Retail Partners",
  },

  // Austin Properties
  {
    id: 12,
    address: "300 West Sixth Street",
    city: "Austin",
    state: "TX",
    country: "USA",
    type: "Office",
    value: 125000000,
    size: 350000,
    yearBuilt: 2021,
    riskLevel: "low",
    riskScore: 4.1,
    ltv: 66.8,
    dscr: 2.35,
    heatSource: "Hybrid",
    greenCertifications: "LEED Platinum",
    ttmRevenue: 18500000,
    annualDebtPayment: 7800000,
    netOperatingIncome: 14200000,
    operatingExpenses: 4300000,
    clientName: "Lone Star Development",
  },
  {
    id: 13,
    address: "500 West Second Street",
    city: "Austin",
    state: "TX",
    country: "USA",
    type: "Other",
    value: 95000000,
    size: 280000,
    yearBuilt: 2018,
    riskLevel: "medium",
    riskScore: 5.8,
    ltv: 72.2,
    dscr: 2.05,
    heatSource: "Electric",
    greenCertifications: "LEED Gold",
    ttmRevenue: 14200000,
    annualDebtPayment: 6800000,
    netOperatingIncome: 10500000,
    operatingExpenses: 3700000,
    clientName: "Austin Commercial Ventures",
  },

  // Toronto Properties
  {
    id: 14,
    address: "123 Bay Street",
    city: "Toronto",
    state: "ON",
    country: "Canada",
    type: "Office",
    value: 45000000,
    size: 250000,
    yearBuilt: 2015,
    riskLevel: "medium",
    riskScore: 7.2,
    ltv: 71.1,
    dscr: 2.21,
    heatSource: "Fossil Fuel",
    greenCertifications: "LEED Gold",
    ttmRevenue: 8500000,
    annualDebtPayment: 2800000,
    netOperatingIncome: 6200000,
    operatingExpenses: 2300000,
    clientName: "Toronto Financial District Corp",
  },
  {
    id: 15,
    address: "456 King Street West",
    city: "Toronto",
    state: "ON",
    country: "Canada",
    type: "Retail",
    value: 28000000,
    size: 180000,
    yearBuilt: 2010,
    riskLevel: "high",
    riskScore: 8.1,
    ltv: 78.5,
    dscr: 1.68,
    heatSource: "Electric",
    greenCertifications: "ENERGY STAR (>85)",
    ttmRevenue: 5200000,
    annualDebtPayment: 2100000,
    netOperatingIncome: 3800000,
    operatingExpenses: 1400000,
    clientName: "King Street Retail Group",
  },
  {
    id: 16,
    address: "789 Queen Street West",
    city: "Toronto",
    state: "ON",
    country: "Canada",
    type: "Other",
    value: 62000000,
    size: 320000,
    yearBuilt: 2018,
    riskLevel: "low",
    riskScore: 4.5,
    ltv: 65.8,
    dscr: 2.42,
    heatSource: "Fossil Fuel",
    greenCertifications: "LEED Platinum",
    ttmRevenue: 11500000,
    annualDebtPayment: 4200000,
    netOperatingIncome: 8800000,
    operatingExpenses: 2700000,
    clientName: "Queen West Properties Ltd",
  },

  // Vancouver Properties
  {
    id: 17,
    address: "654 Water Street",
    city: "Vancouver",
    state: "BC",
    country: "Canada",
    type: "Office",
    value: 52000000,
    size: 180000,
    yearBuilt: 2020,
    riskLevel: "low",
    riskScore: 3.8,
    ltv: 63.2,
    dscr: 2.58,
    heatSource: "Electric",
    greenCertifications: "LEED Gold",
    ttmRevenue: 9800000,
    annualDebtPayment: 3200000,
    netOperatingIncome: 7500000,
    operatingExpenses: 2300000,
    clientName: "Waterfront Holdings Inc",
  },
  {
    id: 18,
    address: "1055 West Georgia Street",
    city: "Vancouver",
    state: "BC",
    country: "Canada",
    type: "Office",
    value: 78000000,
    size: 280000,
    yearBuilt: 2016,
    riskLevel: "medium",
    riskScore: 6.1,
    ltv: 69.5,
    dscr: 2.12,
    heatSource: "Electric",
    greenCertifications: "LEED Platinum",
    ttmRevenue: 14500000,
    annualDebtPayment: 5800000,
    netOperatingIncome: 10800000,
    operatingExpenses: 3700000,
    clientName: "Georgia Street Investments",
  },

  // Calgary Properties
  {
    id: 19,
    address: "321 Main Street",
    city: "Calgary",
    state: "AB",
    country: "Canada",
    type: "Industrial",
    value: 35000000,
    size: 400000,
    yearBuilt: 2012,
    riskLevel: "medium",
    riskScore: 6.8,
    ltv: 74.2,
    dscr: 1.85,
    heatSource: "Fossil Fuel",
    greenCertifications: "BOMA BEST Gold",
    ttmRevenue: 6500000,
    annualDebtPayment: 2800000,
    netOperatingIncome: 4800000,
    operatingExpenses: 1700000,
    clientName: "Prairie Industrial Partners",
  },
  {
    id: 20,
    address: "888 Third Street SW",
    city: "Calgary",
    state: "AB",
    country: "Canada",
    type: "Office",
    value: 42000000,
    size: 220000,
    yearBuilt: 2014,
    riskLevel: "high",
    riskScore: 7.8,
    ltv: 76.8,
    dscr: 1.72,
    heatSource: "Fossil Fuel",
    greenCertifications: "ENERGY STAR (>85)",
    ttmRevenue: 7800000,
    annualDebtPayment: 3600000,
    netOperatingIncome: 5500000,
    operatingExpenses: 2300000,
    clientName: "Calgary Business Centre Ltd",
  },

  // Montreal Properties
  {
    id: 21,
    address: "1000 Rue de la Gauchetière",
    city: "Montreal",
    state: "QC",
    country: "Canada",
    type: "Office",
    value: 38000000,
    size: 195000,
    yearBuilt: 2011,
    riskLevel: "medium",
    riskScore: 6.5,
    ltv: 72.8,
    dscr: 1.95,
    heatSource: "Electric",
    greenCertifications: "LEED Gold",
    ttmRevenue: 7200000,
    annualDebtPayment: 3100000,
    netOperatingIncome: 5400000,
    operatingExpenses: 1800000,
    clientName: "Montreal Commercial Realty",
  },
  {
    id: 22,
    address: "800 René-Lévesque Boulevard",
    city: "Montreal",
    state: "QC",
    country: "Canada",
    type: "Other",
    value: 55000000,
    size: 240000,
    yearBuilt: 2017,
    riskLevel: "low",
    riskScore: 4.8,
    ltv: 68.5,
    dscr: 2.25,
    heatSource: "Electric",
    greenCertifications: "LEED Platinum",
    ttmRevenue: 10200000,
    annualDebtPayment: 4100000,
    netOperatingIncome: 7800000,
    operatingExpenses: 2400000,
    clientName: "Boulevard Properties REIT",
  },

  // Ottawa Properties
  {
    id: 23,
    address: "150 Elgin Street",
    city: "Ottawa",
    state: "ON",
    country: "Canada",
    type: "Office",
    value: 32000000,
    size: 165000,
    yearBuilt: 2013,
    riskLevel: "medium",
    riskScore: 6.2,
    ltv: 73.5,
    dscr: 1.88,
    heatSource: "Fossil Fuel",
    greenCertifications: "ENERGY STAR (>85)",
    ttmRevenue: 6000000,
    annualDebtPayment: 2600000,
    netOperatingIncome: 4400000,
    operatingExpenses: 1600000,
    clientName: "Capital Region Properties",
  },
  {
    id: 24,
    address: "275 Slater Street",
    city: "Ottawa",
    state: "ON",
    country: "Canada",
    type: "Office",
    value: 28000000,
    size: 140000,
    yearBuilt: 2009,
    riskLevel: "high",
    riskScore: 7.5,
    ltv: 77.2,
    dscr: 1.75,
    heatSource: "Electric",
    greenCertifications: "BOMA BEST Gold",
    ttmRevenue: 5200000,
    annualDebtPayment: 2400000,
    netOperatingIncome: 3800000,
    operatingExpenses: 1400000,
    clientName: "Slater Street Holdings",
  },
]

export const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(0)}M`
  }
  return `$${(value / 1000).toFixed(0)}K`
}

export const formatSquareFootage = (value: number): string => {
  return `${value.toLocaleString()} sq ft`
}

export const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case "high":
      return { bg: "#ef4444", text: "white" }
    case "medium":
      return { bg: "#f59e0b", text: "white" }
    case "low":
      return { bg: "#10b981", text: "white" }
    default:
      return { bg: "#6b7280", text: "white" }
  }
}

export const getCertificationLabel = (cert: string): string => {
  switch (cert) {
    case "LEED Gold":
      return "LEED Gold"
    case "LEED Platinum":
      return "LEED Platinum"
    case "BOMA BEST Gold":
      return "BOMA BEST Gold"
    case "BOMA BEST Platinum":
      return "BOMA BEST Platinum"
    case "BREEAM Excellent":
      return "BREEAM Excellent"
    case "BREEAM Outstanding":
      return "BREEAM Outstanding"
    case "ENERGY STAR (>85)":
      return "ENERGY STAR (>85)"
    case "ENERGY STAR for New Homes (v12.6+)":
      return "ENERGY STAR for New Homes (v12.6+)"
    case "Toronto Green Standard (v4) (≥Tier 2)":
      return "Toronto Green Standard (v4) (≥Tier 2)"
    case "Passive House Institute – EnerPHit":
      return "Passive House Institute – EnerPHit"
    case "BC Energy Step Code (≥Step 3)":
      return "BC Energy Step Code (≥Step 3)"
    case "UK EPC (A)":
      return "UK EPC (A)"
    case "UK EPC (B)":
      return "UK EPC (B)"
    case "none":
      return "None"
    default:
      return "Unknown"
  }
}
