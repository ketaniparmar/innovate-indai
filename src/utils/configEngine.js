// src/utils/configEngine.js

export const defaultSystemConfig = {
  // 1. Core Cost Assumptions (Feeds the Feasibility Engine)
  costEngine: {
    tier1Construction: 4200,
    tier2Construction: 3500,
    tier3Construction: 2800,
    standardEquipPerBed: 1200000,
    icuEquipPremium: 2000000,
    interestRate: 10.5,
    inflationRate: 8.0
  },
  
  // 2. NABH Compliance Rules (Feeds the Architect Engine)
  nabhRules: {
    minAreaPerBed: 850,
    icuBedPercentage: 20,
    corridorWidth: 2.4,
    stretcherLiftRequired: true
  },

  // 3. AI System Prompts (Feeds the AIAssistant)
  aiPrompts: {
    financialAnalyst: "You are an elite healthcare investment banker. Analyze the following CAPEX and optimize for a 1.3x DSCR...",
    architect: "You are a master hospital planner strictly adhering to NABH 6th Edition Jan 2025 guidelines...",
    marketing: "Draft an investor pitch highlighting the gap in tertiary care in Tier 2 Indian cities..."
  },

  // 4. Integrations (API Status)
  integrations: {
    supabase: { connected: true, envKey: "VITE_SUPABASE_URL" },
    razorpay: { connected: false, envKey: "VITE_RAZORPAY_KEY" },
    openai: { connected: true, envKey: "VITE_OPENAI_API_KEY" },
    resend: { connected: true, envKey: "VITE_RESEND_API_KEY" }
  }
};