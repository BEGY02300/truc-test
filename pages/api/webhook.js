import Stripe from "stripe";
import { supabase } from "../../lib/supabaseClient";

export const config = { api: { bodyParser: false } }; // Important

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const buf = await new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk });
    req.on('end', () => resolve(data));
  });

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    await supabase.from("paiements").insert([
      { id: session.id, email: session.customer_email, montant: session.amount_total }
    ]);
  }

  res.json({ received: true });
}
