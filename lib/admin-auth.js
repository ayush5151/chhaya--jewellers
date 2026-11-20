import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { error: "Unauthorised", status: 401 };
  const { data: profile } = await supabase
    .from("profiles").select("role, full_name, active").eq("id", user.id).single();
  if (!profile || profile.role !== "admin" || profile.active !== true) {
    return { error: "Admin access required", status: 403 };
  }
  return { user, profile, supabase };
}
