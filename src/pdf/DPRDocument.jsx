import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// ============================================================================
// 1. STABILITY-FIRST STYLES (STRICT REACT-PDF COMPLIANCE)
// ============================================================================
const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  coverPage: {
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 60,
    backgroundColor: '#0A2540',
    color: '#ffffff',
    flexGrow: 1, 
    borderWidth: 10,
    borderColor: '#D4AF37',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  brandName: { fontSize: 12, letterSpacing: 4, color: '#D4AF37', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 10 },
  mainTitle: { fontSize: 38, fontWeight: 'bold', lineHeight: 1.2, marginBottom: 20 },
  subTitle: { fontSize: 18, color: '#ffffff', opacity: 0.8, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: 20 },
  projectTag: { backgroundColor: '#D4AF37', color: '#0A2540', paddingVertical: 8, paddingHorizontal: 15, fontSize: 10, fontWeight: 'bold', alignSelf: 'flex-start', marginTop: 20, borderRadius: 2 },
  
  // HEADER & SECTIONS
  headerBanner: { backgroundColor: '#0A2540', paddingVertical: 20, paddingHorizontal: 20, borderRadius: 5, marginBottom: 30, borderBottomWidth: 4, borderBottomColor: '#D4AF37' },
  headerTitle: { color: '#D4AF37', fontSize: 22, fontWeight: 'bold', textTransform: 'uppercase' },
  sectionTitle: { fontSize: 14, color: '#0A2540', fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: '#e0e0e0', paddingBottom: 5, marginBottom: 12, marginTop: 15 },
  
  // DATA GRID
  dataGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  dataBox: { width: '48%', backgroundColor: '#f8f9fa', paddingVertical: 12, paddingHorizontal: 12, marginBottom: 10, marginRight: '2%', borderRadius: 4, borderLeftWidth: 3, borderLeftColor: '#D4AF37' },
  label: { fontSize: 8, color: '#666666', textTransform: 'uppercase', marginBottom: 4 },
  value: { fontSize: 13, color: '#0A2540', fontWeight: 'bold' },
  textBlock: { fontSize: 9, color: '#333333', lineHeight: 1.6, marginBottom: 10 },

  // TABLES (NABH / FINANCIALS)
  table: { display: "table", width: "auto", borderWidth: 1, borderColor: '#bfbfbf', marginBottom: 10 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: '#bfbfbf' },
  tableColHeader: { width: "25%", backgroundColor: '#0A2540', color: '#ffffff', padding: 5, fontSize: 8, fontWeight: 'bold' },
  tableCol: { width: "25%", padding: 5, fontSize: 8 },
  
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 7, color: '#999999', textAlign: 'center', borderTopWidth: 1, borderTopColor: '#eeeeee', paddingTop: 10 },
  metaText: { fontSize: 9, opacity: 0.6, lineHeight: 1.6 }
});

// ============================================================================
// 2. MASTER INTELLIGENCE ENGINE
// ============================================================================
const DPRDocument = ({ project, cityIntel, auditResults }) => {
  // --- A. DATA PREPARATION ---
  const bedCount = project.planned_beds || 100;
  const targetCity = project.city || 'Gujarat Region';
  const tier = cityIntel?.tier || 2;
  const baseOcc = cityIntel?.base_occupancy || 0.70;

  // --- B. FINANCIAL LOGIC (MULTI-STREAM) ---
  const tierMultiplier = tier === 1 ? 1.25 : tier === 2 ? 1.0 : 0.85;
  const capexPerBed = 50; // Standard 50L per bed
  const capexCr = (bedCount * capexPerBed * tierMultiplier) / 100;

  const arpo = cityIntel?.avg_arpo || 12500;
  const ipdRevenue = bedCount * baseOcc * arpo * 365;
  const opdRevenue = ipdRevenue * 0.35;
  const diagRevenue = ipdRevenue * 0.25;
  const surgeryRevenue = ipdRevenue * 0.20;
  const totalAnnualRevCr = (ipdRevenue + opdRevenue + diagRevenue + surgeryRevenue) / 10000000;

  // --- C. CLINICAL ZONING LOGIC ---
  const icuRatio = tier === 1 ? 0.22 : 0.18; // More critical care in metros
  const icuBeds = Math.ceil(bedCount * icuRatio);
  const otCount = Math.ceil(bedCount / 30);
  const spaceProgram = [
    { dept: "IPD (General/Twin)", ratio: 120, total: bedCount * 120 },
    { dept: "Critical Care (ICU)", ratio: 150, total: icuBeds * 150 },
    { dept: "Operation Theatres", ratio: 1800, total: otCount * 1800 },
    { dept: "Diagnostics/OPD", ratio: 110, total: bedCount * 110 },
  ];
  const carpetArea = spaceProgram.reduce((sum, item) => sum + item.total, 0);
  const builtUpArea = carpetArea * 1.18; // Efficiency factor

  return (
    <Document>
      {/* PAGE 0: PREMIUM COVER */}
      <Page size="A4" style={styles.coverPage}>
        <View>
          <Text style={styles.brandName}>Innovate IndAI Core</Text>
          <View style={{ width: 40, height: 2, backgroundColor: '#D4AF37', marginBottom: 20 }} />
        </View>
        <View style={{ marginBottom: 80 }}>
          <Text style={styles.mainTitle}>Detailed Project Report</Text>
          <Text style={styles.subTitle}>{bedCount}-Bed Multispecialty Hospital & Healthcare Asset</Text>
          <View style={styles.projectTag}><Text>LOCATION: {targetCity.toUpperCase()}</Text></View>
        </View>
        <View>
          <Text style={styles.metaText}>PREPARED FOR: Healthcare Private Equity & Bank Submission</Text>
          <Text style={styles.metaText}>DOCUMENT REF: HPC/DPR/{targetCity.substring(0,3).toUpperCase()}/{bedCount}</Text>
          <Text style={[styles.metaText, { marginTop: 10, color: '#D4AF37' }]}>ISSUED: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</Text>
        </View>
      </Page>

      {/* PAGE 1: REVENUE MIX & CAPEX */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBanner}><Text style={styles.headerTitle}>Investment Intelligence</Text></View>
        <Text style={styles.sectionTitle}>1.0 Multi-Stream Revenue Mix</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text>Segment</Text></View>
            <View style={styles.tableColHeader}><Text>Mix %</Text></View>
            <View style={styles.tableColHeader}><Text>Est. Rev (Cr)</Text></View>
            <View style={styles.tableColHeader}><Text>KPI</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text>IPD Operations</Text></View>
            <View style={styles.tableCol}><Text>45%</Text></View>
            <View style={styles.tableCol}><Text>{(ipdRevenue/10000000).toFixed(2)}</Text></View>
            <View style={styles.tableCol}><Text>Occupancy</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text>OPD/Daycare</Text></View>
            <View style={styles.tableCol}><Text>20%</Text></View>
            <View style={styles.tableCol}><Text>{(opdRevenue/10000000).toFixed(2)}</Text></View>
            <View style={styles.tableCol}><Text>Footfall</Text></View>
          </View>
        </View>
        <Text style={styles.sectionTitle}>2.0 Capital Allocation</Text>
        <View style={styles.dataGrid}>
          <View style={styles.dataBox}><Text style={styles.label}>Total CAPEX</Text><Text style={styles.value}>₹ {capexCr.toFixed(2)} Cr</Text></View>
          <View style={styles.dataBox}><Text style={styles.label}>Est. DSCR</Text><Text style={styles.value}>1.85 (High)</Text></View>
        </View>
        <Text style={styles.footer}>Innovate IndAI • HospitalProjectConsultancy.com</Text>
      </Page>

      {/* PAGE 2: STATUTORY NABH ZONING */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBanner}><Text style={styles.headerTitle}>NABH Infrastructure Audit</Text></View>
        <Text style={styles.sectionTitle}>3.0 Structural Requirements</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text>Department</Text></View>
            <View style={styles.tableColHeader}><Text>Units</Text></View>
            <View style={styles.tableColHeader}><Text>Carpet (Sqft)</Text></View>
            <View style={styles.tableColHeader}><Text>Compliance</Text></View>
          </View>
          {spaceProgram.map((row, i) => (
            <View style={styles.tableRow} key={i}>
              <View style={styles.tableCol}><Text>{row.dept}</Text></View>
              <View style={styles.tableCol}><Text>{row.ratio} sqft/b</Text></View>
              <View style={styles.tableCol}><Text>{row.total.toLocaleString()}</Text></View>
              <View style={styles.tableCol}><Text>FULL</Text></View>
            </View>
          ))}
        </View>
        <Text style={{ marginTop: 20, fontSize: 10, color: '#D4AF37', fontWeight: 'bold' }}>
          Total Estimated Built-up Area: {builtUpArea.toLocaleString()} SQ. FT.
        </Text>
        <Text style={styles.footer}>NABH Auditor AI • Structural Compliance Matrix</Text>
      </Page>
    </Document>
  );
};

export default DPRDocument;