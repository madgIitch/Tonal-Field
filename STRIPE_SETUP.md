# Stripe Integration Setup Guide

## Overview
This guide will walk you through setting up Stripe for Tonal Field's subscription system.

**Pricing:**
- Pro Monthly: €2/month
- Pro Yearly: €20/year (save €4)

---

## Step 1: Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and sign up
2. Complete account verification
3. Switch to **Test Mode** for development (toggle in top right)

---

## Step 2: Create Products and Prices

### Create Pro Monthly Product

1. Go to **Products** in Stripe Dashboard
2. Click **Add Product**
3. Fill in:
   - **Name**: Tonal Field Pro (Monthly)
   - **Description**: Professional color design tools
   - **Pricing**: Recurring
   - **Price**: €2.00
   - **Billing period**: Monthly
4. Click **Save product**
5. **Copy the Price ID** (starts with `price_...`) - you'll need this

### Create Pro Yearly Product

1. Click **Add Product** again
2. Fill in:
   - **Name**: Tonal Field Pro (Yearly)
   - **Description**: Professional color design tools (save €4)
   - **Pricing**: Recurring
   - **Price**: €20.00
   - **Billing period**: Yearly
3. Click **Save product**
4. **Copy the Price ID** (starts with `price_...`)

---

## Step 3: Get API Keys

1. Go to **Developers** → **API Keys**
2. Copy:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`) - Keep this secure!

---

## Step 4: Configure Environment Variables

### Local Development (.env.local)

Add these to your `.env.local` file:

```bash
# Supabase (you already have these)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... # You'll get this in Step 6
```

### Vercel Production

Go to your Vercel project → Settings → Environment Variables and add:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY` (mark as secret)
- `STRIPE_WEBHOOK_SECRET` (mark as secret, you'll add this after Step 6)

---

## Step 5: Update Price IDs in Code

Edit `lib/stripe/stripe-service.ts`:

```typescript
export const STRIPE_PRICES = {
  monthly: "price_XXXXXXXXXXXXX", // Replace with your monthly price ID
  yearly: "price_XXXXXXXXXXXXX",  // Replace with your yearly price ID
};
```

---

## Step 6: Deploy Supabase Edge Functions

### Install Supabase CLI

```bash
npm install -g supabase
```

### Login to Supabase

```bash
supabase login
```

### Link to Your Project

```bash
supabase link --project-ref your-project-ref
```

### Set Secrets

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get the service role key from Supabase Dashboard → Settings → API → service_role key

### Deploy Functions

```bash
supabase functions deploy create-checkout
supabase functions deploy stripe-webhook
```

---

## Step 7: Configure Stripe Webhooks

### Get Webhook URL

Your webhook URL will be:
```
https://your-project-ref.supabase.co/functions/v1/stripe-webhook
```

### Add Webhook in Stripe

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter the webhook URL above
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **Add endpoint**
6. **Copy the Signing Secret** (starts with `whsec_...`)

### Add Webhook Secret

```bash
# Supabase
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...

# Vercel (if not done already)
# Add STRIPE_WEBHOOK_SECRET in Vercel dashboard
```

---

## Step 8: Test the Integration

### Test Locally

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Go to Studio page and click "Upgrade"
3. Use Stripe test card:
   - **Card number**: `4242 4242 4242 4242`
   - **Expiry**: Any future date
   - **CVC**: Any 3 digits
   - **ZIP**: Any 5 digits

4. Complete checkout
5. Verify in your database that the user's `plan` updated to `"pro"`

### Test Webhook Locally (Optional)

Install Stripe CLI:
```bash
brew install stripe/stripe-cli/stripe
# or
scoop install stripe
```

Forward webhooks:
```bash
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook
```

This gives you a webhook secret for local testing.

---

## Step 9: Go Live

### Switch to Live Mode

1. In Stripe Dashboard, toggle to **Live Mode**
2. Create the same products/prices in Live Mode
3. Get new API keys (live keys start with `pk_live_...` and `sk_live_...`)
4. Update production environment variables in Vercel
5. Update Supabase secrets with live keys
6. Set up live webhook (same process as Step 7)

### Pre-Launch Checklist

- [ ] Products created in Live Mode
- [ ] Live API keys configured
- [ ] Live webhook configured and tested
- [ ] Terms of Service and Privacy Policy in place
- [ ] Tested full flow end-to-end in production
- [ ] Set up Stripe email notifications
- [ ] Configure Stripe billing portal settings

---

## Troubleshooting

### User Not Upgraded After Payment

1. Check Supabase Edge Function logs:
   ```bash
   supabase functions logs stripe-webhook
   ```

2. Check Stripe webhook delivery in Dashboard → Webhooks → Your endpoint
3. Verify the webhook secret is correct
4. Check that the user_id is being passed correctly

### Checkout Session Not Creating

1. Verify Price IDs are correct in `stripe-service.ts`
2. Check Supabase Edge Function logs:
   ```bash
   supabase functions logs create-checkout
   ```
3. Verify STRIPE_SECRET_KEY is set correctly

### Common Errors

**"No such price"**: Price ID is incorrect or doesn't exist
**"Missing signature"**: Webhook secret is incorrect
**"Invalid signature"**: Webhook secret doesn't match the endpoint

---

## Customer Support Flow

When a customer has issues:

1. Check their profile in Supabase:
   ```sql
   SELECT * FROM profiles WHERE email = 'customer@email.com';
   ```

2. Check their subscription in Stripe Dashboard
3. Manually update their plan if needed:
   ```sql
   UPDATE profiles
   SET plan = 'pro', updated_at = now()
   WHERE email = 'customer@email.com';
   ```

---

## Security Notes

- ✅ Never commit Stripe secret keys to Git
- ✅ Use environment variables for all sensitive data
- ✅ Validate webhook signatures (already implemented)
- ✅ Use HTTPS in production (Vercel does this automatically)
- ✅ Regularly rotate API keys if compromised

---

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Stripe Test Cards](https://stripe.com/docs/testing)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
