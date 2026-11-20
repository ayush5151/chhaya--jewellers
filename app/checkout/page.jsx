"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {useEffect,useState} from "react";
import {useRouter} from "next/navigation";
export default function Checkout(){
 const [cart,setCart]=useState([]),[form,setForm]=useState({full_name:"",mobile:"",address:"",city:"",state:"",pin_code:"",fulfilment:"Home delivery"}),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 const router=useRouter();
 useEffect(()=>setCart(JSON.parse(localStorage.getItem("cj_cart")||"[]")),[]);
 function change(e){setForm({...form,[e.target.name]:e.target.value});}
 async function submit(e){e.preventDefault();setError("");setBusy(true);try{const res=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({customer:form,items:cart,fulfilment:form.fulfilment})});const data=await res.json();if(!res.ok)throw new Error(data.error||"Could not place order");localStorage.removeItem("cj_cart");router.push(`/order-success?order=${encodeURIComponent(data.order_number)}`);}catch(err){setError(err.message);}finally{setBusy(false);}}
 const total=cart.reduce((s,x)=>s+x.price*x.quantity,0);
 return <><Header/><main className="wrap section"><h1 style={{font:"600 38px 'Playfair Display',serif"}}>Checkout</h1>{!cart.length?<div className="panel">Your cart is empty.</div>:<div className="two"><form className="panel" onSubmit={submit}><h2>Delivery / contact details</h2>{[["full_name","Full name"],["mobile","Mobile number"],["address","Complete address"],["city","City"],["state","State"],["pin_code","PIN code"]].map(([name,label])=><div className="field" key={name}><label>{label} *</label><input name={name} required value={form[name]} onChange={change} pattern={name==="mobile"?"[6-9][0-9]{9}":undefined} minLength={name==="pin_code"?6:undefined} maxLength={name==="mobile"?10:name==="pin_code"?6:undefined}/></div>)}<div className="field"><label>How would you like to receive your order?</label><select name="fulfilment" value={form.fulfilment} onChange={change}><option>Home delivery</option><option>Store pickup</option></select></div><button disabled={busy} className="btn gold">{busy?"Placing order...":"Place order"}</button>{error&&<p className="error">{error}</p>}</form><div className="panel"><h2>Order summary</h2>{cart.map(x=><p key={x.id}>{x.name} × {x.quantity} — ₹{(x.price*x.quantity).toLocaleString("en-IN")}</p>)}<hr/><h3>Subtotal: ₹{total.toLocaleString("en-IN")}</h3><p className="muted">No online payment. Your order will be confirmed immediately. Our team will contact you about delivery or store pickup and delivery charges.</p></div></div>}</main><Footer/></>;
}
