import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
// We will call the email function we built earlier
const EMAIL_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/send-nurture-sequence`

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

serve(async (req) => {
  try {
    // 1. Calculate the exact timestamps for Day 2 and Day 4
    const today = new Date();
    
    const day2Start = new Date(today); day2Start.setDate(today.getDate() - 2); day2Start.setHours(0,0,0,0);
    const day2End = new Date(today); day2End.setDate(today.getDate() - 2); day2End.setHours(23,59,59,999);

    const day4Start = new Date(today); day4Start.setDate(today.getDate() - 4); day4Start.setHours(0,0,0,0);
    const day4End = new Date(today); day4End.setDate(today.getDate() - 4); day4End.setHours(23,59,59,999);

    // 2. Fetch Day 2 Leads from Supabase
    const { data: day2Leads } = await supabase
      .from('transactions')
      .select('leads(email, name, city, beds)')
      .eq('payment_status', 'successful')
      .gte('created_at', day2Start.toISOString())
      .lte('created_at', day2End.toISOString());

    // 3. Fetch Day 4 Leads from Supabase
    const { data: day4Leads } = await supabase
      .from('transactions')
      .select('leads(email, name, city, beds)')
      .eq('payment_status', 'successful')
      .gte('created_at', day4Start.toISOString())
      .lte('created_at', day4End.toISOString());

    // 4. Fire the Emails for Day 2
    if (day2Leads) {
      for (const tx of day2Leads) {
        const lead = tx.leads;
        await fetch(EMAIL_FUNCTION_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
          body: JSON.stringify({ email: lead.email, name: lead.name, city: lead.city, beds: lead.beds, sequence_step: 2 })
        });
      }
    }

    // 5. Fire the Emails for Day 4
    if (day4Leads) {
      for (const tx of day4Leads) {
        const lead = tx.leads;
        await fetch(EMAIL_FUNCTION_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
          body: JSON.stringify({ email: lead.email, name: lead.name, city: lead.city, beds: lead.beds, sequence_step: 4 })
        });
      }
    }

    return new Response(JSON.stringify({ status: "Batch Processed Successfully", day2Count: day2Leads?.length || 0, day4Count: day4Leads?.length || 0 }), { status: 200 })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})