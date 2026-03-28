import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const DUST_API_URL = "https://dust.tt/api/v1";

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
    const { message, conversationId, context } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'message is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const headers = {
      'Authorization': `Bearer ${DUST_API_KEY}`,
      'Content-Type': 'application/json',
    };

    let convId = conversationId;

    // Create a new conversation if none exists
    if (!convId) {
      const contextMessage = context
        ? `[Context: The student is working on "${context}". Help them with this specific task.]`
        : '';

      const createRes = await fetch(`${DUST_API_URL}/w/${DUST_WORKSPACE_ID}/assistant/conversations`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: context || 'Study Session',
          visibility: 'unlisted',
          message: {
            content: contextMessage ? `${contextMessage}\n\n${message}` : message,
            mentions: [{ configurationId: 'NeuroStudyBuddy' }],
            context: {
              timezone: 'Europe/Stockholm',
              username: 'student',
              profilePictureUrl: null,
              fullName: 'Student',
              email: null,
              origin: 'api',
            },
          },
          blocking: true,
        }),
      });

      if (!createRes.ok) {
        const errBody = await createRes.text();
        console.error(`Dust create conversation failed [${createRes.status}]:`, errBody);
        throw new Error(`Dust API error: ${createRes.status}`);
      }

      const createData = await createRes.json();
      convId = createData.conversation?.sId;

      // Extract the agent reply from the conversation
      const agentMessage = createData.conversation?.content
        ?.flat()
        ?.find((m: any) => m.type === 'agent_message');

      const reply = agentMessage?.content || "I'm here to help! What would you like to work on?";

      return new Response(JSON.stringify({
        reply,
        conversationId: convId,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Post message to existing conversation
    const msgRes = await fetch(
      `${DUST_API_URL}/w/${DUST_WORKSPACE_ID}/assistant/conversations/${convId}/messages`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          content: message,
          mentions: [{ configurationId: 'NeuroStudyBuddy' }],
          context: {
            timezone: 'Europe/Stockholm',
            profilePictureUrl: null,
            fullName: 'Student',
            email: null,
            origin: 'api',
          },
          blocking: true,
        }),
      }
    );

    if (!msgRes.ok) {
      const errBody = await msgRes.text();
      console.error(`Dust message failed [${msgRes.status}]:`, errBody);
      throw new Error(`Dust API error: ${msgRes.status}`);
    }

    const msgData = await msgRes.json();

    // After posting, fetch the conversation to get the latest agent reply
    const convRes = await fetch(
      `${DUST_API_URL}/w/${DUST_WORKSPACE_ID}/assistant/conversations/${convId}`,
      { headers }
    );

    if (!convRes.ok) {
      throw new Error(`Failed to fetch conversation: ${convRes.status}`);
    }

    const convData = await convRes.json();
    const allMessages = convData.conversation?.content?.flat() || [];
    const lastAgentMsg = [...allMessages]
      .reverse()
      .find((m: any) => m.type === 'agent_message');

    const reply = lastAgentMsg?.content || "Let me think about that...";

    return new Response(JSON.stringify({
      reply,
      conversationId: convId,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Dust chat error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
