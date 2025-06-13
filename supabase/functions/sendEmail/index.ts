// supabase/functions/sendEmail/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend";

const AUTH_SECRET = Deno.env.get("AUTH_SECRET");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, Authorization, x-client-info, apikey, content-type, Content-Type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    ✅ AUTH CHECK
    const authHeader = req.headers.get("Authorization") || "";
    
    if (authHeader !== `Bearer ${AUTH_SECRET}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }



    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const body = await req.json();
    const { email, name, group, ID } = body;

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
to: email,
subject: "TOM's Camp 2025 - Registration Confirmation",
html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <p>Dear ${name},</p>
    
    <p>Your registration for TOM's Camp 2025 has been successfully processed!</p>
    
    <p><strong>Registration Details:</strong></p>
    <ul>
      <li>Camper ID: ${ID}</li>
      <li>Team Color: ${group}</li>
    </ul>
    
    <p>We're thrilled to have you join us for this exciting experience!</p>
    
    <p><strong>Payment Instructions:</strong></p>
    <p>As an early bird registrant, your camp fee is <strong>₦5,000</strong>.</p>
    
    <p>Please make payment to:</p>
    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
      <p><strong>Account Name:</strong> Teenagers Outreach Ministries</p>
      <p><strong>Account Number:</strong> 2037223476</p>
      <p><strong>Bank:</strong> First Bank</p>
    </div>
    
    <p><strong>After payment:</strong></p>
    <ol>
      <li>Take a screenshot or photo of your payment receipt</li>
      <li>Send it via WhatsApp to our registrar at <strong>+234 905 534 9173</strong></li>
      <li>Include the camper's name and ID in your message</li>
    </ol>
    
    <p>Your registration will be finalized upon payment confirmation.</p>
    
    <p>We look forward to seeing you at camp!</p>
    
    <p>Best regards,<br>
    TOM's Camp 2025 Organizing Committee</p>
  </div>
`
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to send email" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});