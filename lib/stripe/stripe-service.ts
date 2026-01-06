import { createClient } from "@/lib/supabase/client";

// Stripe Price IDs - Replace with your actual Price IDs from Stripe Dashboard
//
// To get these:
// 1. Go to https://dashboard.stripe.com/products
// 2. Create "Tonal Field Pro (Monthly)" - €2/month recurring
// 3. Create "Tonal Field Pro (Yearly)" - €20/year recurring
// 4. Copy the Price IDs (they start with "price_")
// 5. Paste them below
//
// Example: monthly: "price_1Abc123xyz456Def789Ghi012",
//
export const STRIPE_PRICES = {
  monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || "price_MONTHLY_NOT_SET",
  yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY || "price_YEARLY_NOT_SET",
};

/**
 * Create a Stripe Checkout session and redirect to Stripe
 */
export async function createCheckoutSession(
  priceId: string,
  userId: string
): Promise<{ url: string | null; error?: string }> {
  try {
    const supabase = createClient();

    // Call Supabase Edge Function to create checkout session
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        priceId,
        userId,
      },
    });

    if (error) {
      console.error("Error creating checkout session:", error);
      return { url: null, error: error.message };
    }

    return { url: data.url };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { url: null, error: "Failed to create checkout session" };
  }
}

/**
 * Create Stripe Customer Portal session for managing subscription
 */
export async function createPortalSession(
  customerId: string
): Promise<{ url: string | null; error?: string }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.functions.invoke("create-portal", {
      body: {
        customerId,
      },
    });

    if (error) {
      console.error("Error creating portal session:", error);
      return { url: null, error: error.message };
    }

    return { url: data.url };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { url: null, error: "Failed to create portal session" };
  }
}
