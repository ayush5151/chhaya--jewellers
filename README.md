# Chhaya Jewellers – full-stack starter

A Next.js + Supabase starter for a jewellery catalogue, cart, customer checkout and private staff dashboard.

## What is included
- Responsive white-and-gold storefront.
- Gold, Silver, Diamond, Bridal, Coins & Bars, Daily Wear categories.
- Product search, category filter, price sorting.
- Product detail page and cart.
- Checkout with name, mobile, address, city, state and PIN code.
- No online payment. Orders are immediately marked **Confirmed**.
- Secure server-side order creation. Price is read from the database, not trusted from the browser.
- Stock is reduced in the same database transaction as order creation.
- Admin login, product/stock management, order list/status updates, WhatsApp contact link and basic sales summary.
- Supports multiple staff accounts (create up to four accounts in Supabase Auth and add matching profiles).

## Important before launch
This is a functional starter, not yet a fully audited production commerce platform. Test it with sample products and test orders before sharing it with customers. Jewellery orders are high-value: confirm stock, delivery process, privacy notice, refund/return policy, product descriptions and tax/legal requirements with the shop before launch. The customer currently cannot cancel orders, as requested.

## 1. Install
Install Node.js LTS on your laptop. Extract this project, open its folder in VS Code terminal and run:

```bash
npm install
```

## 2. Create Supabase project
1. Create a project at https://supabase.com.
2. Open SQL Editor and run all contents of `supabase/schema.sql`.
3. Open Project Settings → API. Copy Project URL, anon/public key and service_role key.
4. Copy `.env.example` to `.env.local` and fill in the values.
5. Never expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code or commit `.env.local` to GitHub.

## 3. Create the four staff logins
In Supabase → Authentication → Users, create four users with email/password. For each user, copy the Auth user UUID. In SQL Editor, run a profile insert for each one, for example:

```sql
insert into public.profiles(id, full_name, role, active)
values ('PASTE-AUTH-USER-UUID-HERE', 'Shop Owner', 'admin', true);
```

Repeat for the other three accounts. Use role `staff` for employees if they should not be treated as owners. Keep login credentials private and do not share passwords in chat.

## 4. Run locally
```bash
npm run dev
```
Open http://localhost:3000. Admin login is at http://localhost:3000/admin/login.

## 5. Add products
Log in, open Products & inventory, and add products. For now, product photos use an image URL. A Supabase Storage upload interface can be added as the next improvement.

## 6. Deploy
1. Create a private GitHub repository and push this folder.
2. In Vercel, import that repository.
3. Add the same environment variables in Vercel → Project Settings → Environment Variables.
4. Deploy. Vercel will redeploy after future GitHub pushes.
5. Add a custom domain later if desired.

## Current business behaviour
- Order confirmation is immediate.
- Delivery/pickup arrangement and delivery fee are confirmed manually by the shop.
- Admin dashboard shows customer name, phone, address, ordered items and subtotal.
- Use the WhatsApp button in an order to contact the customer manually.
- Customers do not have a cancellation button.
- Sales summary counts non-cancelled order subtotals; it is not accounting software.

## Suggested next upgrades
- Supabase Storage product photo uploader.
- Customer order lookup using order number + verified mobile OTP.
- Email/SMS order confirmation.
- Staff permission levels and audit log.
- Inventory movement history and low-stock alerts.
- Privacy policy, terms, shipping, returns and warranty pages.
- Better reporting by date/category and CSV export.
