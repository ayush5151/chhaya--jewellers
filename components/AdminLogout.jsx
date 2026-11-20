"use client";
import {createClient} from "@/lib/supabase/client";
import {useRouter} from "next/navigation";
export default function AdminLogout(){const router=useRouter();async function out(){const supabase=createClient();await supabase.auth.signOut();router.push("/admin/login");router.refresh();}return <button className="btn outline" onClick={out}>Sign out</button>}
