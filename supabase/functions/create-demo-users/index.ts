import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create demo users for each role
    const demoUsers = [
      {
        email: "reader@example.com",
        password: "password123",
        role: "reader",
        name: "Demo Reader",
      },
      {
        email: "librarian@example.com",
        password: "password123",
        role: "librarian",
        name: "Demo Librarian",
      },
      {
        email: "admin@example.com",
        password: "password123",
        role: "admin",
        name: "Demo Admin",
      },
    ];

    const results = [];

    for (const user of demoUsers) {
      // Create the user
      const { data: userData, error: userError } =
        await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            name: user.name,
          },
        });

      if (userError && userError.message !== "User already registered") {
        console.error(`Error creating user ${user.email}:`, userError);
        results.push({
          email: user.email,
          status: "error",
          message: userError.message,
        });
        continue;
      }

      const userId =
        userData?.user?.id ||
        (await supabase.auth.admin.listUsers()).data.users.find(
          (u) => u.email === user.email,
        )?.id;

      if (!userId) {
        results.push({
          email: user.email,
          status: "error",
          message: "Failed to get user ID",
        });
        continue;
      }

      // Update the user's role in the profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ role: user.role })
        .eq("id", userId);

      if (profileError) {
        console.error(
          `Error updating profile for ${user.email}:`,
          profileError,
        );
        results.push({
          email: user.email,
          status: "partial",
          message: "User created but role not set",
        });
        continue;
      }

      results.push({ email: user.email, status: "success", role: user.role });
    }

    return new Response(
      JSON.stringify({
        message: "Demo users created successfully",
        users: results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
