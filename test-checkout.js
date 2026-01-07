// Test script to call create-checkout Edge Function directly
// Run with: node test-checkout.js

const SUPABASE_URL = "https://fdnfahtpcxopjjpxcziz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkbmZhaHRwY3hvcGpqcHhjemlaIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NDY4MjIsImV4cCI6MjA1MDEyMjgyMn0.AfW2GaYpgc8Y79p6vxAQZdaUDUVJJ8uDHJyvW5qC2Ps";

async function testCreateCheckout() {
  console.log("Testing create-checkout Edge Function...\n");

  const testData = {
    priceId: "price_1SmhBWBHZMDyOB3jGyMTmEmt", // Monthly plan - €2/month
    userId: "test-user-123",
  };

  console.log("Request data:", JSON.stringify(testData, null, 2));

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(testData),
    });

    console.log("\nResponse status:", response.status, response.statusText);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log("\nResponse body:", JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log("\n✅ SUCCESS! Checkout URL:", data.url);
    } else {
      console.log("\n❌ ERROR:", data.error || data.message);
    }
  } catch (error) {
    console.error("\n❌ EXCEPTION:", error.message);
  }
}

testCreateCheckout();
