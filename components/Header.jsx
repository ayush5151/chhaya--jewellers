import Link from "next/link";
export default function Header(){
 return <><div className="topbar">CRAFTED WITH CARE · CHHAYA JEWELLERS · RAMGARH</div><header className="header"><div className="wrap nav"><Link className="brand" href="/">CHHAYA <span>JEWELLERS</span></Link><nav className="navlinks"><Link href="/?category=Gold">Gold</Link><Link href="/?category=Silver">Silver</Link><Link href="/?category=Diamond">Diamond</Link><Link href="/?category=Bridal%20jewellery">Bridal</Link></nav><div className="navright"><Link href="/cart">Cart</Link><Link href="/admin/login" className="btn outline">Admin</Link></div></div></header></>;
}
