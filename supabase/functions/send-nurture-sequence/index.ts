import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { email, name, beds, city, sequence_step, pdfLink } = await req.json()

    if (!email || sequence_step === undefined) {
      return new Response("Missing required fields", { status: 400 })
    }

    let subject = "";
    let htmlContent = "";

    // ==========================================
    // EMAIL 1: IMMEDIATE DELIVERY (DAY 0)
    // ==========================================
    if (sequence_step === 0) {
      subject = `📄 Your ${beds}-Bed Hospital Feasibility Report is inside.`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #0A2540; line-height: 1.6;">
          <p>Hi ${name},</p>
          <p>Your initial feasibility and financial snapshot for the ${city} facility is ready. You can download your generated PDF here: <strong><a href="${pdfLink}" style="color: #D4AF37;">Download Your Report</a></strong></p>
          
          <p>Getting clarity on your CAPEX and projected revenue is the most critical first step in healthcare investment. However, as a Chief Systems Architect who has overseen multiple hospital projects across Gujarat, I need to give you a reality check.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0;">
            <strong>The numbers on this page represent a perfect world.</strong><br><br>
            In the real world, hospital budgets bleed in three places:<br>
            1. Architects drawing rooms that fail NABH 5th Edition clearance requirements.<br>
            2. Buying biomedical equipment at retail prices instead of distributor margins.<br>
            3. Banks rejecting the loan because the Debt Service Coverage Ratio (DSCR) isn't stress-tested.
          </div>
          
          <p>Review your report today. If you are serious about breaking ground in the next 6 months, you cannot rely on a basic snapshot.</p>
          <p>When you are ready for a bank-sanctionable document, you can <strong><a href="https://app.hospitalprojectconsultancy.com/upgrade" style="color: #0A2540;">Upgrade to the ₹75,000 Professional DPR Here</a></strong>, which includes your complete CMA data, loan structuring, and competitor gap analysis.</p>
          
          <p>To your success,<br><br><strong>Ketan Parmar</strong><br>Chief Architect, Innovate India<br>HospitalProjectConsultancy.com</p>
        </div>
      `;
    } 
    // ==========================================
    // EMAIL 2: THE NABH WARNING (DAY 2)
    // ==========================================
    else if (sequence_step === 2) {
      subject = `The ₹2 Crore mistake in hospital floor planning.`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #0A2540; line-height: 1.6;">
          <p>Hi ${name},</p>
          <p>I was reviewing the baseline metrics for your ${beds}-bed project in ${city}, and I wanted to share a quick warning about a trap I see promoters fall into constantly.</p>
          
          <h3 style="color: #ef4444;">It’s the Architectural Disconnect.</h3>
          
          <p>Most commercial architects know how to design a beautiful building. But they do not know clinical zoning.</p>
          <p>For example, an architect might draw your General Ward beds with a 1.0-meter clearance. It looks great on paper. But NABH 5th Edition mandates a strict 1.5-meter clearance for crash-cart access.</p>
          <p>The result? The NABH auditor fails your facility. You have to break down walls, lose 4 beds of revenue capacity, and delay your launch by 3 months. That is a multi-crore mistake.</p>
          
          <p>Before you finalize your CAD drawings or apply for your bank loan, you need a document that proves your infrastructure matches your financial projections.</p>
          
          <p>The <strong>DPR Professional</strong> isn't just a spreadsheet; it is a clinical and financial shield. It provides the exact departmental zoning matrix your architect needs to follow.</p>
          
          <p>👉 <strong><a href="https://app.hospitalprojectconsultancy.com/upgrade" style="color: #D4AF37; font-weight: bold;">Secure your Bank-Ready Professional DPR Here</a></strong></p>
          
          <p>Let’s build it right the first time.</p>
          
          <p>Best,<br><strong>Ketan Parmar</strong></p>
        </div>
      `;
    } 
    // ==========================================
    // EMAIL 3: THE HIGH-TICKET UPSELL (DAY 4)
    // ==========================================
    else if (sequence_step === 4) {
      subject = `Execution separates the visionary from the dreamer. Let's build.`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #0A2540; line-height: 1.6;">
          <p>Hi ${name},</p>
          <p>By now, you’ve reviewed the numbers for your upcoming hospital. You know the CAPEX required, you understand the target ARPOB, and you see the clinical potential in ${city}.</p>
          
          <p>The feasibility phase is over. Now comes the hard part: <strong>Execution.</strong></p>
          
          <p>A spreadsheet cannot negotiate with a biomedical equipment vendor. Software cannot manage your civil contractors or navigate the local health department's regulatory hurdles.</p>
          
          <div style="background-color: #0A2540; color: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin-top: 0; color: #D4AF37; font-weight: bold;">At Innovate India, we handle:</p>
            <ul style="padding-left: 20px;">
              <li>Institutional Investor Pitching & Bank Loan Structuring</li>
              <li>End-to-End Medical Equipment Procurement (at exclusive distributor margins)</li>
              <li>Interior Clinical Design & NABH Audit Preparation</li>
              <li>Vendor Marketplace Coordination</li>
            </ul>
          </div>
          
          <p>If you are ready to move from planning to execution, let's get on a strategy call.</p>
          
          <p>👉 <strong><a href="https://calendly.com/innovate-india/strategy" style="color: #D4AF37; font-weight: bold;">Book your 1-on-1 Project Strategy Session Here</a></strong></p>
          
          <p>I look forward to building this healthcare asset with you.</p>
          
          <p>Regards,<br><br><strong>Ketan Parmar</strong><br>Innovate India Core<br><em>Execution & Infrastructure Division</em></p>
        </div>
      `;
    }

    // ==========================================
    // THE RESEND API EXECUTION
    // ==========================================
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Ketan Parmar <consulting@hospitalprojectconsultancy.com>', 
        to: [email],
        subject: subject,
        html: htmlContent,
      })
    })

    const resData = await res.json()

    if (!res.ok) {
      throw new Error(resData.message || "Failed to send email");
    }

    return new Response(JSON.stringify({ success: true, id: resData.id }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })

  } catch (error: any) {
    console.error("Email Automation Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    })
  }
})