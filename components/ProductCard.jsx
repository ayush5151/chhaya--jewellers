import Link from "next/link";
export default function ProductCard({product}){
 return <article className="product"><Link href={`/product/${product.id}`}><div className="product-img">{product.image_url?<img src={product.image_url} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:"Chhaya Collection"}</div></Link><div className="product-info"><div className="tag">{product.category}</div><h3><Link href={`/product/${product.id}`}>{product.name}</Link></h3><div className="price">₹{Number(product.price).toLocaleString("en-IN")}</div><p className="muted" style={{fontSize:12}}>{product.stock_quantity>0?"In stock":"Currently unavailable"}</p><Link className="btn outline" href={`/product/${product.id}`}>View details</Link></div></article>
}
