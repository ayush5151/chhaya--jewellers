"use client";
import {useState} from "react";
import {createClient} from "@/lib/supabase/client";
import {useRouter} from "next/navigation";
export default function AdminLogin(){const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[error,setError]=useState("");const router=useRouter();async function submit(e){e.preventDefault();const supabase=createClient();const {error}=await supabase.auth.signInWithPassword({email,password});if(error){setError(error.message);return;}router.push("/admin");router.refresh();}
return <main className="wrap section"><div className="panel" style={{maxWidth:430,margin:"50px auto"}}><div className="brand">CHHAYA <span>JEWELLERS</span></div><h1>Admin login</h1><form onSubmit={submit}><div className="field"><label>Email</label><input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></div><div className="field"><label>Password</label><input type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></div><button className="btn gold">Sign in</button>{error&&<p className="error">{error}</p>}</form></div></main>}
