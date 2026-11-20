import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddToCart from "@/components/AddToCart";
import {createClient} from "@/lib/supabase/server";
import {notFound} from "next/navigation";

export default async function ProductPage({params}){
 const {id}=await params; const supabase=await createClient();
 const {data:p}=await supabase.from("products").select("*").eq("id",id).eq("active",true).single();
 if(!p) notFound();
 return <><Header/><main className="wrap section"><div className="two"><div className="product-img" style={{height:430}}>{p.image_url?<img src={p.image_url} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:"Chhaya Collection"}</div><div><div className="eyebrow">{p.category}</div><h1 style={{font:"600 38px 'Playfair Display',serif"}}>{p.name}</h1><h2>₹{Number(p.price).toLocaleString("en-IN")}</h2><p className="muted">{p.description||"A beautiful addition to your collection."}</p><p><b>Weight:</b> {p.weight_grams??"—"} g</p><p><b>Purity:</b> {p.purity||"—"}</p><p><b>Making charges:</b> {p.making_charges??"—"}</p><p><b>Availability:</b> {p.stock_quantity>0?`In stock (${p.stock_quantity})`:"Out of stock"}</p><AddToCart product={{id:p.id,name:p.name,price:p.price,image_url:p.image_url,stock_quantity:p.stock_quantity}}/></div></div></main><Footer/></>;
}
