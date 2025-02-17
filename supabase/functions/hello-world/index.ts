import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient(supabaseUrl, supabaseKey);

  if (req.method === "GET") {
    const { data: { user }, error: authError } = await supabase.auth.getUser(req.headers.get("Authorization")?.replace("Bearer ", ""));
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { data, error } = await supabase.from("tasks").select("*").eq("user_id", user.id);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  }

  if (req.method === "POST") {
    const { task } = await req.json();
    if (!task) {
      return new Response(JSON.stringify({ error: "Task is required" }), { status: 400 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(req.headers.get("Authorization")?.replace("Bearer ", ""));
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const taskId = crypto.randomUUID();
    const { data, error } = await supabase.from("tasks").insert([{ id: taskId, user_id: user.id, task }]).select();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 201 });
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
});