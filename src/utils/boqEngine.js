// src/utils/boqEngine.js

export function generateSmartBOQ(config, qualityPackage = 'nabh') {
  const area = Math.max(1000, Number(config.areaSqFt));
  const beds = Math.max(1, Number(config.beds));
  
  // 1. DYNAMIC REGIONAL & QUALITY MULTIPLIERS
  const cityMultiplier = config.cityTier === 1 ? 1.25 : config.cityTier === 2 ? 1.0 : 0.85;
  const qualityMultiplier = qualityPackage === 'premium' ? 1.4 : qualityPackage === 'nabh' ? 1.15 : 1.0;
  const combinedMultiplier = cityMultiplier * qualityMultiplier;

  // 2. INTELLIGENT ITEM GENERATION
  const createItem = (desc, unit, qty, baseRate, benchmarkRate, isEquip = false, veSuggestion = null) => {
    const adjustedRate = Math.round(baseRate * combinedMultiplier);
    const amount = qty * adjustedRate;
    const priceAlert = adjustedRate > benchmarkRate * 1.15 ? 'high' : adjustedRate < benchmarkRate * 0.85 ? 'low' : 'optimal';
    
    return { desc, unit, qty, rate: adjustedRate, benchmark: benchmarkRate, amount, priceAlert, veSuggestion, isEquip };
  };

  const categories = [
    { 
      id: 'civil', 
      name: '1. Civil & Structural', 
      items: [
        createItem('Site Clearing & Excavation', 'LS', 1, area * 45, area * 50),
        createItem('RCC Columns & Slabs (M30 Grade)', 'Sq.Ft', area, 1100, 1250, false, "Consider M25 grade for non-load bearing zones to save 8%."),
        createItem('Brickwork & Plastering', 'Sq.Ft', area * 2.5, 170, 160)
      ] 
    },
    { 
      id: 'mep', 
      name: '2. MEP Systems', 
      items: [
        createItem('HVAC (AHU & HEPA for Sterile Zones)', 'TR', Math.ceil(area / 400), 55000, 50000, true, "Use domestic BlueStar units over Daikin for 15% CAPEX reduction."),
        createItem('Electrical Panels & Armored Cabling', 'LS', 1, area * 350, area * 320),
        createItem('Fire Safety & Sprinkler System', 'LS', 1, area * 110, area * 130)
      ] 
    },
    { 
      id: 'specialized', 
      name: '3. Hospital Systems', 
      items: [
        createItem('Medical Gas Pipeline System (MGPS)', 'Beds', beds, 22000, 25000),
        createItem('Modular OTs (Laminar Flow, Anti-static)', 'Nos', Math.max(1, Math.ceil(beds / 30)), 3200000, 2800000, true, "Swap imported steel panels with high-grade PUF panels."),
        createItem('Pneumatic Tube System', 'Nodes', Math.ceil(beds / 15), 150000, 140000, true)
      ] 
    },
    { 
      id: 'equip', 
      name: '4. High-Value Medical Equipment', 
      items: [
        createItem('1.5T MRI Machine', 'Nos', beds > 50 ? 1 : 0, 45000000, 50000000, true, "Consider refurbished Siemens/GE units with warranty to save up to 40%."),
        createItem('32-Slice CT Scanner', 'Nos', 1, 15000000, 14000000, true),
        createItem('ICU Ventilators (Advanced)', 'Nos', Math.ceil(beds * 0.15), 750000, 700000, true)
      ] 
    }
  ];

  // Clean out items with Qty 0 (like MRI for small hospitals)
  const processedCats = categories.map(cat => {
    const validItems = cat.items.filter(i => i.qty > 0);
    const catTotal = validItems.reduce((sum, i) => sum + i.amount, 0);
    return { ...cat, items: validItems, catTotal };
  });

  const grandTotal = processedCats.reduce((sum, cat) => sum + cat.catTotal, 0);

  // Calculate potential Value Engineering savings
  const veSavings = processedCats.flatMap(c => c.items).reduce((sum, item) => {
    if (item.priceAlert === 'high') return sum + (item.amount * 0.12); // Assume 12% saving on overpriced items
    return sum;
  }, 0);

  return { categories: processedCats, grandTotal, veSavings };
}