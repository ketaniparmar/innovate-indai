import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

serve(async (req) => {
  try {
    const payload = await req.json()
    const project = payload.record 

    if (!project?.lead_id) return new Response("Invalid payload", { status: 400 })

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('email')
      .eq('id', project.lead_id)
      .single()

    if (leadError || !lead?.email) throw new Error("Lead email not found")

    const htmlContent = `
      <div style="font-family: sans-serif; color: #0A2540; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D4AF37;">🔒 Feasibility Snapshot Unlocked</h2>
        <p>Your <strong>${project.planned_beds}-Bed</strong> project for <strong>${project.city}</strong> has been processed.</p>
        <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #D4AF37; margin: 20px 0;">
           <strong>Est. CAPEX:</strong> ₹${project.estimated_capex_cr} Crores
        </div>
        <a href="https://app.hospitalprojectconsultancy.com/upgrade?project=${project.id}" 
           style="background: #0A2540; color: #D4AF37; padding: 12px 20px; text-decoration: none; font-weight: bold; border-radius: 5px;">
           Get Premium 50-Page DPR (₹4,999)
        </a>
      </div>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Ketan Parmar <consulting@hospitalprojectconsultancy.com>',
        to: [lead.email],
        subject: `Project Snapshot: ${project.planned_beds} Beds in ${project.city}`,
        html: htmlContent,
      })
    })

    return new Response(JSON.stringify(await res.json()), { 
      headers: { "Content-Type": "application/json" },
      status: 200 
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})