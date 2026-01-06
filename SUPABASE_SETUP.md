# Supabase Setup Guide

This guide will walk you through setting up Supabase for Tonal Field's backend.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in with your GitHub account
3. Click **"New Project"**
4. Fill in the details:
   - **Organization**: Create new or use existing
   - **Name**: `tonal-field`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users (e.g., `Europe West (London)`)
   - **Pricing Plan**: Free (sufficient to start)
5. Click **"Create new project"**
6. Wait 2-3 minutes for the project to be created

## Step 2: Get Your Credentials

1. Once the project is created, go to **Settings** (gear icon on left sidebar)
2. Click on **API** in the settings menu
3. You'll see two important values:

   **Project URL**:
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **anon/public key** (under "Project API keys"):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz...
   ```

## Step 3: Add Credentials to .env.local

1. Open `.env.local` in the root of your project
2. Replace the placeholder values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_very_long_anon_key_here
```

## Step 4: Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open the file `supabase/schema.sql` from your project
4. Copy all the SQL code
5. Paste it into the Supabase SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. Wait for the query to complete (should take a few seconds)

You should see a success message: "Success. No rows returned"

## Step 5: Verify the Setup

### Check Tables

1. Go to **Table Editor** in the left sidebar
2. You should see 3 tables:
   - `profiles`
   - `palettes`
   - `interactions`

### Check Policies

1. Click on any table (e.g., `palettes`)
2. Go to the **Policies** tab
3. You should see multiple RLS policies enabled

## Step 6: Test Authentication (Optional)

1. Go to **Authentication** > **Users** in the dashboard
2. Click **"Invite user"** or **"Add user"**
3. Create a test user with an email and password
4. You can use this later to test the app

## Step 7: Configure Email (Optional, for production)

For production, you'll want to set up email authentication:

1. Go to **Authentication** > **Providers**
2. Configure **Email** provider
3. Set up an SMTP server or use Supabase's built-in email (limited in free tier)

For development, you can use the default settings.

## Step 8: Start Development Server

```bash
npm run dev
```

Your app should now be able to connect to Supabase!

## Troubleshooting

### Error: "Invalid API key"
- Double-check that you copied the **anon/public** key (not the service_role key)
- Make sure there are no extra spaces or newlines in `.env.local`
- Restart your dev server after changing `.env.local`

### Error: "relation does not exist"
- Make sure you ran the schema.sql file in the SQL Editor
- Check for any errors in the SQL execution

### Error: "new row violates row-level security policy"
- Make sure you're authenticated
- Check that the RLS policies are correctly set up

## Next Steps

After completing this setup:
- [ ] Create auth components (Login/Signup)
- [ ] Migrate community service from localStorage to Supabase
- [ ] Test publishing palettes
- [ ] Set up Stripe for premium features

## Useful Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Next.js Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
