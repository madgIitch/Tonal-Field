import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.11.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature || !webhookSecret) {
    return new Response("Missing signature or webhook secret", { status: 400 });
  }

  try {
    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    );

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId || session.client_reference_id;

        if (!userId) {
          console.error("No userId found in session");
          break;
        }

        // Update user to PRO
        const { error } = await supabaseClient
          .from("profiles")
          .update({
            plan: "pro",
            stripe_customer_id: session.customer as string,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        if (error) {
          console.error("Error updating user to PRO:", error);
        } else {
          console.log(`User ${userId} upgraded to PRO`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by stripe_customer_id
        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!profile) {
          console.error("No profile found for customer:", customerId);
          break;
        }

        // Update plan based on subscription status
        const plan = subscription.status === "active" ? "pro" : "free";

        const { error } = await supabaseClient
          .from("profiles")
          .update({
            plan,
            updated_at: new Date().toISOString(),
          })
          .eq("id", profile.id);

        if (error) {
          console.error("Error updating subscription status:", error);
        } else {
          console.log(`User ${profile.id} subscription updated to ${plan}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by stripe_customer_id
        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!profile) {
          console.error("No profile found for customer:", customerId);
          break;
        }

        // Downgrade to free
        const { error } = await supabaseClient
          .from("profiles")
          .update({
            plan: "free",
            updated_at: new Date().toISOString(),
          })
          .eq("id", profile.id);

        if (error) {
          console.error("Error downgrading user:", error);
        } else {
          console.log(`User ${profile.id} downgraded to free`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
});
