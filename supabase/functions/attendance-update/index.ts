import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    
    // Log the payload for future n8n integration
    console.log('Attendance Update Webhook Payload:', JSON.stringify(payload, null, 2));
    
    // Validate required fields
    if (!payload.studentId || !payload.date || !payload.status) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: studentId, date, and status' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Validate status value
    if (!['Present', 'Absent'].includes(payload.status)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid status. Must be "Present" or "Absent"' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Attendance update webhook received successfully',
        data: {
          studentId: payload.studentId,
          date: payload.date,
          status: payload.status,
          timestamp: new Date().toISOString()
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error processing attendance update webhook:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
