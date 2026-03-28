// src/utils/analyticsEngine.js

export function generatePortfolioAnalytics(projects) {
  // Fallback to a "Demo Portfolio" if no projects exist yet to show off the UI
  const data = projects && projects.length > 0 ? projects : [
    { config: { beds: 150 }, engine: { totalProjectCost: 450000000, dscr: 1.4, ebitda: 85000000, loanScore: 82 }, created_at: new Date(Date.now() - 86400000 * 2) },
    { config: { beds: 50 }, engine: { totalProjectCost: 120000000, dscr: 1.1, ebitda: 15000000, loanScore: 55 }, created_at: new Date(Date.now() - 86400000 * 5) },
    { config: { beds: 300 }, engine: { totalProjectCost: 1250000000, dscr: 1.8, ebitda: 320000000, loanScore: 94 }, created_at: new Date(Date.now() - 86400000 * 12) }
  ];

  const totalProjects = data.length;
  const totalBeds = data.reduce((sum, p) => sum + (p.config?.beds || 0), 0);
  const totalCapex = data.reduce((sum, p) => sum + (p.engine?.totalProjectCost || 0), 0);
  
  // Averages & Predictive Scoring
  const avgDscr = data.reduce((sum, p) => sum + (p.engine?.dscr || 0), 0) / totalProjects;
  const avgEbitdaMargin = 22.5; // Simulated portfolio average
  
  // Risk Distribution
  const riskProfile = {
    low: data.filter(p => (p.engine?.loanScore || 0) >= 80).length,
    medium: data.filter(p => (p.engine?.loanScore || 0) >= 60 && (p.engine?.loanScore || 0) < 80).length,
    high: data.filter(p => (p.engine?.loanScore || 0) < 60).length,
  };

  // Simulated Time-Series for Charting (Last 6 Months pipeline)
  const pipelineGrowth = [
    { month: 'Oct', value: 2 }, { month: 'Nov', value: 4 }, { month: 'Dec', value: 7 },
    { month: 'Jan', value: 12 }, { month: 'Feb', value: 18 }, { month: 'Mar', value: totalProjects }
  ];

  // Global Cost Distribution (Civil vs Equip vs MEP)
  const costDistribution = {
    civil: totalCapex * 0.45,
    equipment: totalCapex * 0.35,
    mep: totalCapex * 0.20
  };

  return {
    totalProjects,
    totalBeds,
    totalCapex,
    avgDscr,
    avgEbitdaMargin,
    riskProfile,
    pipelineGrowth,
    costDistribution,
    raw: data
  };
}