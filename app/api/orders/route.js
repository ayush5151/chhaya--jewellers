import {NextResponse} from "next/server";
import {createServiceClient} from "@/lib/supabase/admin";

export async function POST(request){
 try{
  const body=await request.json(); const c=body.customer; const items=body.items;
  if(!c?.full_name||!c?.mobile||!c?.address||!c?.city||!c?.state||!c?.pin_code) return NextResponse.json({error:"Please complete all required customer details."},{status:400});
  if(!/^[6-9][0-9]{9}$/.test(c.mobile)) return NextResponse.json({error:"Enter a valid 10-digit mobile number."},{status:400});
  if(!Array.isArray(items)||!items.length) return NextResponse.json({error:"Your cart is empty."},{status:400});
  const supabase=createServiceClient();
  const clean=items.map(x=>({product_id:x.id,quantity:Number(x.quantity)}));
  if(clean.some(x=>!x.product_id||!Number.isInteger(x.quantity)||x.quantity<1)) return NextResponse.json({error:"Invalid cart items."},{status:400});
  const {data,error}=await supabase.rpc("place_customer_order",{customer_name:c.full_name,customer_mobile:c.mobile,customer_address:c.address,customer_city:c.city,customer_state:c.state,customer_pin:c.pin_code,items_json:clean,customer_fulfilment:body.fulfilment||"Home delivery"});
  if(error) throw error;
  return NextResponse.json({order_number:data});
 }catch(e){return NextResponse.json({error:e.message||"Unable to place order."},{status:400});}
}
