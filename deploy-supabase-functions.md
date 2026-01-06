# Deploy Supabase Edge Functions

## Paso 1: Obtener Access Token

1. Ve a https://supabase.com/dashboard/account/tokens
2. Click en "Generate new token"
3. Copia el token

## Paso 2: Configurar Variables de Entorno

Abre PowerShell y ejecuta:

```powershell
# Set access token (reemplaza con tu token)
$env:SUPABASE_ACCESS_TOKEN = "tu_token_aqui"
```

## Paso 3: Link al Proyecto

```powershell
cd C:\Users\peorr\Desktop\Tonal-Field
supabase link --project-ref fdnfahtpcxopjjpxcziz
```

## Paso 4: Configurar Secrets

Necesitas obtener el **Service Role Key** de Supabase:
1. Ve a https://supabase.com/dashboard/project/fdnfahtpcxopjjpxcziz/settings/api
2. Copia el **service_role** key (NO el anon key)

Luego ejecuta:

```powershell
# Set Stripe Secret Key (reemplaza con tu key real)
supabase secrets set STRIPE_SECRET_KEY=sk_live_XXXXXXXXXXXXXXXXXXXXX

# Set Supabase URL
supabase secrets set SUPABASE_URL=https://your-project-ref.supabase.co

# Set Service Role Key (reemplaza con el que copiaste)
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJxxx...your_service_role_key_here
```

## Paso 5: Desplegar las Funciones

```powershell
# Deploy create-checkout function
supabase functions deploy create-checkout

# Deploy stripe-webhook function
supabase functions deploy stripe-webhook
```

## Paso 6: Verificar Deployment

Las funciones estarán disponibles en:
- https://fdnfahtpcxopjjpxcziz.supabase.co/functions/v1/create-checkout
- https://fdnfahtpcxopjjpxcziz.supabase.co/functions/v1/stripe-webhook

## Paso 7: Configurar Webhook en Stripe

1. Ve a https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. URL: `https://fdnfahtpcxopjjpxcziz.supabase.co/functions/v1/stripe-webhook`
4. Eventos a escuchar:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copia el **Signing Secret** (empieza con `whsec_...`)

## Paso 8: Actualizar Webhook Secret

```powershell
# En Supabase
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_tu_secret_aqui
```

También actualiza tu `.env.local`:
```
STRIPE_WEBHOOK_SECRET=whsec_tu_secret_aqui
```

## Paso 9: Probar el Sistema

1. Reinicia tu servidor de desarrollo
2. Ve a Studio y click "Upgrade"
3. Completa el checkout con tarjeta de prueba
4. Verifica que tu plan se actualizó en la base de datos

---

## Troubleshooting

### Error: "Cannot find module"
Asegúrate de estar en el directorio correcto:
```powershell
cd C:\Users\peorr\Desktop\Tonal-Field
```

### Error: "Project not linked"
Ejecuta de nuevo:
```powershell
supabase link --project-ref fdnfahtpcxopjjpxcziz
```

### Ver logs de las funciones
```powershell
supabase functions logs create-checkout
supabase functions logs stripe-webhook
```
