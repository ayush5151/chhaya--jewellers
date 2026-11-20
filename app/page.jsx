import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/server";

export default async function Home({searchParams}){
 const params=await searchParams; const supabase=await createClient();
 let query=supabase.from("products").select("*").eq("active",true).gt("stock_quantity",0).order("created_at",{ascending:false});
 if(params?.category) query=query.eq("category",params.category);
 const {data:products=[]}=await query;
 return <><Header/><main><section className="hero"><div className="wrap hero-grid"><div><div className="eyebrow">A legacy of trust & elegance</div><h1>Jewellery that tells your story.</h1><p>Discover thoughtfully selected gold, silver and diamond jewellery at Chhaya Jewellers, Ramgarh.</p><Link className="btn gold" href="#collection">Explore collection</Link></div><div className="hero-art">Elegance, made timeless</div></div></section><section className="section wrap" id="collection"><div className="section-head"><div><div className="eyebrow">Our collection</div><h2>Find your perfect piece</h2></div><span className="muted">{products.length} products</span></div><form className="controls"><input className="search" name="q" placeholder="Search collection..." defaultValue={params?.q||""} style={{maxWidth:300}}/><select name="category" defaultValue={params?.category||""} className="search" style={{maxWidth:220}}><option value="">All categories</option>{["Gold","Silver","Diamond","Bridal jewellery","Coins and bars","Daily wear jewellery"].map(x=><option key={x}>{x}</option>)}</select><select name="sort" defaultValue={params?.sort||"new"} className="search" style={{maxWidth:180}}><option value="new">Newest</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select><button className="btn" type="submit">Apply</button></form>{products.length?<div className="grid">{products.filter(p=>!params?.q||p.name.toLowerCase().includes(params.q.toLowerCase())).sort((a,b)=>params?.sort==="low"?a.price-b.price:params?.sort==="high"?b.price-a.price:0).map(p=><ProductCard key={p.id} product={p}/>)}</div>:<div className="panel"><h3>Our collection is being updated.</h3><p className="muted">Please check back soon or contact our store for product availability.</p></div>}</section></main><Footer/></>;
}
