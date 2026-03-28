// src/utils/crmEngine.js

export function calculatePipelineMetrics(leads) {
  // If no leads exist yet from Supabase, inject high-quality mock data for the UI
  const activeLeads = leads && leads.length > 0 ? leads : [
    { id: 1, name: "Dr. R. Sharma", project: "Sharma Multi-Specialty", value: 120000000, stage: 'lead', phone: "+91 9876543210", email: "dr.sharma@example.com", source: "DPR Download", time: "2 Hrs Ago" },
    { id: 2, name: "Apex Health Group", project: "Apex Greenfield", value: 450000000, stage: 'qualified', phone: "+91 9988776655", email: "director@apexhealth.in", source: "AI Architect Planner", time: "Yesterday" },
    { id: 3, name: "City Care Trust", project: "City Care Expansion", value: 85000000, stage: 'proposal', phone: "+91 9123456789", email: "admin@citycare.com", source: "Equipment BOQ Quote", time: "2 Days Ago" },
    { id: 4, name: "Dr. K. Patel", project: "Patel Ortho & Trauma", value: 220000000, stage: 'closed', phone: "+91 9998887776", email: "k.patel@clinic.in", source: "Direct Referral", time: "1 Week Ago" },
    { id: 5, name: "Lifeline Oncology", project: "Lifeline Cancer Center", value: 650000000, stage: 'lead', phone: "+91 9876512345", email: "projects@lifeline.org", source: "DPR Download", time: "Just Now" }
  ];

  const totalValue = activeLeads.reduce((sum, l) => sum + (l.value || 0), 0);
  const closedValue = activeLeads.filter(l => l.stage === 'closed').reduce((sum, l) => sum + (l.value || 0), 0);
  
  const pipelineDistribution = {
    lead: activeLeads.filter(l => l.stage === 'lead'),
    qualified: activeLeads.filter(l => l.stage === 'qualified'),
    proposal: activeLeads.filter(l => l.stage === 'proposal'),
    closed: activeLeads.filter(l => l.stage === 'closed')
  };

  const conversionRate = activeLeads.length > 0 ? (pipelineDistribution.closed.length / activeLeads.length) * 100 : 0;

  return {
    rawLeads: activeLeads,
    totalLeads: activeLeads.length,
    totalValue,
    closedValue,
    conversionRate,
    pipeline: pipelineDistribution
  };
}