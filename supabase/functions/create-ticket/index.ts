import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CreateTicketRequest {
  funnel_slug: string;
  lead_data: Record<string, any>;
  expiration_hours?: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const requestData: CreateTicketRequest = await req.json();
    const { funnel_slug, lead_data, expiration_hours = 24 } = requestData;

    if (!funnel_slug) {
      return new Response(
        JSON.stringify({ success: false, error: "funnel_slug é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Buscar o funil
    const { data: funnel, error: funnelError } = await supabase
      .from("funnels")
      .select("*")
      .eq("slug", funnel_slug)
      .maybeSingle();

    if (funnelError || !funnel) {
      return new Response(
        JSON.stringify({ success: false, error: "Funil não encontrado" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Gerar código do ticket
    const ticketCode = `PED-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Calcular data de expiração
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiration_hours);

    // Criar ticket no banco
    const { data: ticket, error: ticketError } = await supabase
      .from("tickets")
      .insert({
        ticket_code: ticketCode,
        funnel_id: funnel.id,
        lead_data: lead_data,
        status: "pending",
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (ticketError) {
      console.error("Erro ao criar ticket:", ticketError);
      return new Response(
        JSON.stringify({ success: false, error: "Erro ao criar ticket" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Retornar apenas ticket_code e expires_at
    // O formulário irá construir a URL localmente
    return new Response(
      JSON.stringify({
        success: true,
        ticket_code: ticketCode,
        expires_at: expiresAt.toISOString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Erro no create-ticket:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
