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
    console.log('Grade Publish Webhook Payload:', JSON.stringify(payload, null, 2));
    
    // Validate required fields
    if (!payload.studentId || !payload.subject || payload.marks === undefined) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: studentId, subject, and marks' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Validate marks range
    const marks = parseFloat(payload.marks);
    if (isNaN(marks) || marks < 0 || marks > 100) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid marks. Must be a number between 0 and 100' 
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
        message: 'Grade publish webhook received successfully',
        data: {
          studentId: payload.studentId,
          subject: payload.subject,
          marks: marks,
          timestamp: new Date().toISOString()
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error processing grade publish webhook:', error);
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
