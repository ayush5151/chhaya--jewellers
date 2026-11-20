"use client";
import {useState} from "react";
export default function AddToCart({product}){
 const [message,setMessage]=useState("");
 function add(){const cart=JSON.parse(localStorage.getItem("cj_cart")||"[]");const found=cart.find(x=>x.id===product.id);if(found)found.quantity=Math.min(found.quantity+1,product.stock_quantity);else cart.push({...product,quantity:1});localStorage.setItem("cj_cart",JSON.stringify(cart));setMessage("Added to cart.");}
 return <div><button className="btn gold" disabled={product.stock_quantity<1} onClick={add}>Add to cart</button>{message&&<p className="success">{message}</p>}</div>;
}
