import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Grabs your Gemini API key from the secure Supabase vault
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

serve(async (req) => {
  try {
    const { projectData, financialData } = await req.json()

    const systemPrompt = `You are the Lead Healthcare Financial Consultant at Innovate India. Write a highly professional, bank-ready Executive Summary for a greenfield hospital project. Format the response in exactly 3 distinct paragraphs: 1. Market Opportunity, 2. Clinical Architecture, 3. Financial Viability.`;

    const userPrompt = `Project Parameters: Location: ${projectData.city} (Tier ${projectData.cityTier}). Capacity: ${projectData.beds} Beds. Total CAPEX: ₹${(financialData.capex / 10000000).toFixed(2)} Crores. Year 3 Projected EBITDA: ₹${(financialData.dscrSchedule[2].ebitda / 10000000).toFixed(2)} Crores. Minimum DSCR: ${financialData.dscrSchedule[2].dscr}`;

    // Calling the Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: { temperature: 0.3 } // Low temperature for an analytical, McKinsey-style tone
      })
    });

    const aiData = await response.json();
    const narrative = aiData.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ narrative }), { 
      headers: { "Content-Type": "application/json" },
      status: 200 
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})