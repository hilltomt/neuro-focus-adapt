import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DustAPI } from "npm:@dust-tt/client@1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const AGENT_ID = "XdmrVrLbc2";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const DUST_API_KEY = Deno.env.get('DUST_API_KEY');
  if (!DUST_API_KEY) {
    return new Response(JSON.stringify({ error: 'DUST_API_KEY not configured' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const DUST_WORKSPACE_ID = Deno.env.get('DUST_WORKSPACE_ID');
  if (!DUST_WORKSPACE_ID) {
    return new Response(JSON.stringify({ error: 'DUST_WORKSPACE_ID not configured' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { message, conversationId, context, taskId } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'message is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const dust = new DustAPI({
      workspaceId: DUST_WORKSPACE_ID,
      apiKey: DUST_API_KEY,
    });

    // Build the full message with context if provided
    const contextPrefix = context
      ? `[Context: The student is working on "${context}". Help them with this specific task.]\n\n`
      : '';
    const fullMessage = contextPrefix + message;

    // Use the SDK's sendMessage for synchronous responses
    // If continuing a conversation, pass conversationId
    if (conversationId) {
      // Continue existing conversation
      const response = await dust.agents.sendMessage({
        agentId: AGENT_ID,
        message: message,
        conversationId: conversationId,
      });

      return new Response(JSON.stringify({
        reply: response.text || "Let me think about that...",
        conversationId: response.conversationId,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // New conversation
    const response = await dust.agents.sendMessage({
      agentId: AGENT_ID,
      message: fullMessage,
    });

    return new Response(JSON.stringify({
      reply: response.text || "I'm here to help! What would you like to work on?",
      conversationId: response.conversationId,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Dust chat error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('429') || errorMessage.includes('rate')) {
      return new Response(JSON.stringify({
        error: 'The AI assistant is busy right now. Please wait a moment and try again.',
      }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (errorMessage.includes('402') || errorMessage.includes('credits')) {
      return new Response(JSON.stringify({
        error: 'AI usage credits have been exhausted. Please contact your workspace admin.',
      }), {
        status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
