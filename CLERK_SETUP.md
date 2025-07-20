# Clerk Authentication Setup Guide

This guide will help you set up Clerk authentication for your React Native Expo application with Supabase integration.

## Prerequisites

- Clerk account (sign up at [clerk.com](https://clerk.com))
- Supabase project with RLS (Row Level Security) configured
- React Native Expo application

## Step 1: Create Clerk Application

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Click "Add application"
3. Choose your application name
4. Select "React Native" as the framework
5. Copy your **Publishable Key**

## Step 2: Configure Environment Variables

Add the following to your `.env` file:

```env
# Clerk Configuration
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
```

## Step 3: Configure Supabase for Clerk Integration

### 3.1 Add Clerk JWT Template

1. In Clerk Dashboard, go to **JWT Templates**
2. Click **New template**
3. Choose **Supabase** template
4. Configure the template:
   - **Name**: `supabase`
   - **Token lifetime**: 3600 seconds (1 hour)
   - **Claims**:
     ```json
     {
       "aud": "authenticated",
       "exp": {{exp}},
       "iat": {{iat}},
       "iss": "https://your-clerk-domain.clerk.accounts.dev",
       "sub": "{{user.id}}",
       "email": "{{user.primary_email_address.email_address}}",
       "phone": "{{user.primary_phone_number.phone_number}}",
       "app_metadata": {
         "provider": "clerk",
         "providers": ["clerk"]
       },
       "user_metadata": {
         "email": "{{user.primary_email_address.email_address}}",
         "email_verified": {{user.primary_email_address.verification.status == "verified"}},
         "phone_verified": {{user.primary_phone_number.verification.status == "verified"}},
         "sub": "{{user.id}}"
       },
       "role": "authenticated"
     }
     ```

### 3.2 Configure Supabase JWT Settings

1. Go to your Supabase project dashboard
2. Navigate to **Settings** > **API**
3. Scroll down to **JWT Settings**
4. Add Clerk's public key:
   - Go to Clerk Dashboard > **API Keys**
   - Copy the **JWT Verification Key**
   - In Supabase, add this as an additional JWT secret

### 3.3 Update Supabase RLS Policies

Ensure your RLS policies work with Clerk tokens. Example policy:

```sql
-- Example: Allow users to read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.jwt() ->> 'sub' = id::text);

-- Example: Allow authenticated users to read books
CREATE POLICY "Authenticated users can read books" ON books
  FOR SELECT USING (auth.role() = 'authenticated');
```

## Step 4: Configure Clerk Sign-In Methods

1. In Clerk Dashboard, go to **User & Authentication** > **Email, Phone, Username**
2. Enable your preferred sign-in methods:
   - **Email address**: Enable for sign-in
   - **Password**: Enable
   - **Email verification**: Optional but recommended

## Step 5: Test the Integration

1. Start your Expo development server:
   ```bash
   npx expo start
   ```

2. Try signing up/signing in with Clerk
3. Verify that the user data is properly synced with Supabase
4. Test that Supabase RLS policies work with Clerk tokens

## Troubleshooting

### Common Issues

1. **"Missing Publishable Key" Error**
   - Ensure `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is set in your `.env` file
   - Restart your Expo development server after adding environment variables

2. **Supabase RLS Policies Not Working**
   - Verify JWT template configuration in Clerk
   - Check that Clerk's JWT verification key is added to Supabase
   - Ensure RLS policies use correct JWT claims

3. **User Not Found in Supabase**
   - Check that `createSupabaseWithClerk` is working correctly
   - Verify that user profile creation logic is triggered after Clerk sign-in

### Debug Tips

1. **Check JWT Token**:
   ```javascript
   import { useAuth } from '@clerk/clerk-expo';
   
   const { getToken } = useAuth();
   const token = await getToken({ template: 'supabase' });
   console.log('Clerk JWT:', token);
   ```

2. **Verify Supabase Connection**:
   ```javascript
   import { createSupabaseWithClerk } from './src/services/supabase';
   
   const supabase = await createSupabaseWithClerk();
   const { data: { user } } = await supabase.auth.getUser();
   console.log('Supabase user:', user);
   ```

## Migration from Auth0

If you're migrating from Auth0:

1. **User Data Migration**: Export user data from Auth0 and import to Clerk
2. **Update Environment Variables**: Replace Auth0 variables with Clerk variables
3. **Update Supabase Policies**: Modify RLS policies to work with Clerk JWT structure
4. **Test Thoroughly**: Ensure all authentication flows work correctly

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **JWT Expiration**: Configure appropriate token lifetimes
3. **RLS Policies**: Ensure policies are restrictive and secure
4. **HTTPS**: Always use HTTPS in production
5. **Key Rotation**: Regularly rotate JWT signing keys

## Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk + Supabase Integration Guide](https://clerk.com/docs/integrations/databases/supabase)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Expo + Clerk Setup](https://clerk.com/docs/quickstarts/expo)