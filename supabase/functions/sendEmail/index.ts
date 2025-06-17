// supabase/functions/sendEmail/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend";


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
    
console.log('Attempting to send email...');
    // ✅ AUTH CHECK
const authHeader = req.headers.get("Authorization") || "";
const token = authHeader.replace("Bearer ", "");

// Verify it's a valid Supabase token (basic check)
if (!token || token.length < 20) {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}


    
   const resendApiKey = Deno.env.get("RESEND_API_KEY");

if (!resendApiKey) {
  console.error("Missing RESEND_API_KEY");
  return new Response("Server misconfiguration: missing RESEND_API_KEY", {
    status: 500,
    headers: corsHeaders,
  });
}

const resend = new Resend(resendApiKey);





    const body = await req.json();
    const { email, name, group, ID } = body;

    const { data, error } = await resend.emails.send({
      from: "noreply@smtp.tomakwaibom.org.ng",
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
    
    <p><strong>Camp Details:</strong></p>
    
    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
      <p><strong>Date:</strong> Tues. 19th - Sun. 24th August 2025.</p>
      <p><strong>Venue:</strong> Lutheran High School, Obot Idim, Ibesikpo LGA. (If there are changes to the venue, it will be duely communicated to you)
</p>
    </div>
    
    <p>Please come to camp with this registration email for Id verification and your personal items such as a food flask, bucket, plate, spoon, cup, bedsheet, and other utensils.</p>

    <p>For inquiries, call: 08024968773, 08033628087.</p>
    
    <p>We look forward to seeing you at camp!</p>
    
    <p>Best regards,<br>
    TOM's Camp 2025 Organizing Committee</p>
  </div>
`
    });
    console.log('Function called with:', { email, name, group, ID });

    if (error) {
      console.error("Resend error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {  console.error("Function crashed:", err)
  return new Response(JSON.stringify({ 
    error: "Failed to send email",
    details: err.message 
  }), {
    status: 500,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}});

 // catch (err) {
  //   console.error('Function error:', err);
  //   return new Response(JSON.stringify({ 
  //     error: "Failed to send email",
  //     details: err.message 
  //   }), {
  //     status: 500,

//     headers: { ...corsHeaders, "Content-Type": "application/json" },
  //   });
  // }
  
//   catch (err) {
//     return new Response(JSON.stringify({ error: "Failed to send email" }), {
//       status: 500,
//       headers: { ...corsHeaders, "Content-Type": "application/json" },
//     });
//   }

