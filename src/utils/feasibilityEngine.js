// src/utils/feasibilityEngine.js

export function runFeasibilitySimulation(config) {
  const beds = Math.max(1, Number(config.beds));
  const area = Math.max(1000, Number(config.areaSqFt));
  const cps = config.cityTier === 1 ? 4200 : config.cityTier === 2 ? 3500 : 2800;
  const baseArpob = config.cityTier === 1 ? 22000 : config.cityTier === 2 ? 15000 : 10000;

  // 1. CAPEX Calculations
  const constructionCost = area * cps;
  const equipCost = beds * 1500000; // Simplified average
  const workingCapital = (beds * baseArpob * 30 * 0.5); // 1 month buffer
  const idc = constructionCost * 0.05; // Interest During Construction (5%)
  
  const totalCapex = constructionCost + equipCost + workingCapital + idc;
  const loanAmount = totalCapex * 0.7;
  const equity = totalCapex * 0.3;
  const annualEmi = (loanAmount * 0.105);

  // 2. Scenario Generator
  const generateScenario = (occY1, arpobGrowth, opexRatio) => {
    let cashflows = [-equity]; // Year 0 (Investment)
    let totalEbitda = 0;
    
    for(let year = 1; year <= 5; year++) {
      const occ = Math.min(occY1 + ((year - 1) * 10), 90) / 100; // Ramps up
      const currentArpob = baseArpob * Math.pow(1 + arpobGrowth, year - 1);
      const rev = beds * occ * currentArpob * 365;
      
      const ebitda = rev * (1 - opexRatio);
      const dep = (constructionCost * 0.05) + (equipCost * 0.15); // WDV proxy
      const tax = Math.max((ebitda - dep - annualEmi) * 0.25, 0); 
      const netCash = ebitda - annualEmi - tax;
      
      cashflows.push(netCash);
      if (year === 1) totalEbitda = ebitda;
    }

    // Simplified IRR & Break-even proxy
    const dscr = totalEbitda / annualEmi;
    const breakEven = totalCapex / totalEbitda;
    let irr = 0;
    if (cashflows[5] > 0) irr = ((cashflows[5] / equity) ** (1/5)) - 1; // Simplified CAGR

    return {
      ebitdaY1: totalEbitda,
      dscr,
      breakEven,
      irr: irr * 100,
      cashflows
    };
  };

  return {
    inputs: { beds, area, totalCapex, loanAmount, equity },
    scenarios: {
      conservative: generateScenario(45, 0.03, 0.80),
      base: generateScenario(60, 0.05, 0.75),
      aggressive: generateScenario(75, 0.08, 0.70)
    }
  };
}