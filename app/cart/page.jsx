"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {useEffect,useState} from "react";
export default function Cart(){
 const [cart,setCart]=useState([]);
 useEffect(()=>setCart(JSON.parse(localStorage.getItem("cj_cart")||"[]")),[]);
 function save(next){setCart(next);localStorage.setItem("cj_cart",JSON.stringify(next));}
 const total=cart.reduce((s,x)=>s+x.price*x.quantity,0);
 return <><Header/><main className="wrap section"><h1 style={{font:"600 38px 'Playfair Display',serif"}}>Your shopping cart</h1>{!cart.length?<div className="panel">Your cart is empty. <Link href="/">Explore jewellery</Link></div>:<div className="two"><div className="panel">{cart.map(x=><div className="cart-row" key={x.id}><div><b>{x.name}</b><p className="muted">₹{Number(x.price).toLocaleString("en-IN")}</p><button className="btn outline" onClick={()=>save(cart.filter(y=>y.id!==x.id))}>Remove</button></div><div><input aria-label="Quantity" type="number" min="1" max={x.stock_quantity} value={x.quantity} onChange={e=>save(cart.map(y=>y.id===x.id?{...y,quantity:Math.max(1,Math.min(Number(e.target.value)||1,y.stock_quantity))}:y))} style={{width:75,padding:8}}/></div></div>)}</div><div className="panel"><h2>Order summary</h2><p>Subtotal: <b>₹{total.toLocaleString("en-IN")}</b></p><p className="muted">Delivery charges will be confirmed by our store.</p><Link href="/checkout" className="btn gold">Proceed to checkout</Link></div></div>}</main><Footer/></>;
}
