# Clerk + Supabase Integration Guide

This document explains how Clerk authentication is integrated with Supabase in this React Native Expo application.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Native  │    │      Clerk      │    │    Supabase     │
│   Application   │◄──►│  Authentication │◄──►│    Database     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Flow:
1. User authenticates with Clerk
2. Clerk provides JWT token with custom claims
3. JWT token is used to authenticate with Supabase
4. Supabase validates token and applies RLS policies

## Implementation Details

### 1. Clerk Service (`src/services/clerk.ts`)

Handles Clerk session management and token storage:

```typescript
export class ClerkService {
  // Store session token securely
  static async storeSessionToken(token: string): Promise<void>
  
  // Retrieve stored session token
  static async getSessionToken(): Promise<string | null>
  
  // Store user data
  static async storeUser(user: ClerkUser): Promise<void>
  
  // Get stored user data
  static async getUser(): Promise<ClerkUser | null>
  
  // Clear all stored data
  static async clearAll(): Promise<void>
}
```

### 2. Supabase Integration (`src/services/supabase.ts`)

Creates Supabase client with Clerk authentication:

```typescript
// Standard Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Supabase client with Clerk authentication
export async function createSupabaseWithClerk() {
  const sessionToken = await ClerkService.getSessionToken();
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    },
  });
}
```

### 3. Auth Context (`src/context/AuthContext.tsx`)

Manages authentication state and user data:

```typescript
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  loginWithClerk: async () => false,
  logout: async () => {},
});
```

#### Key Functions:

- **`loginWithClerk()`**: Handles Clerk authentication flow
- **User Profile Sync**: Automatically syncs user data between Clerk and Supabase
- **Session Management**: Monitors Clerk session changes

### 4. Login Component (`app/login.tsx`)

Provides dual authentication options:

1. **Direct Supabase Login**: Traditional email/password
2. **Clerk Authentication**: Third-party authentication with Clerk

```typescript
const handleClerkLogin = async () => {
  // Create Clerk sign-in attempt
  const signInAttempt = await signIn.create({
    identifier: username,
    password,
  });
  
  // Set active session and sync with app context
  if (signInAttempt.status === 'complete') {
    await setActive({ session: signInAttempt.createdSessionId });
    await loginWithClerk();
  }
};
```

## JWT Token Structure

Clerk generates JWT tokens with custom claims for Supabase:

```json
{
  "aud": "authenticated",
  "exp": 1234567890,
  "iat": 1234567890,
  "iss": "https://your-clerk-domain.clerk.accounts.dev",
  "sub": "user_clerk_id",
  "email": "user@example.com",
  "phone": "+1234567890",
  "app_metadata": {
    "provider": "clerk",
    "providers": ["clerk"]
  },
  "user_metadata": {
    "email": "user@example.com",
    "email_verified": true,
    "phone_verified": false,
    "sub": "user_clerk_id"
  },
  "role": "authenticated"
}
```

## Database Schema

### User Profiles Table

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### RLS Policies

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.jwt() ->> 'sub' = id::text);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.jwt() ->> 'sub' = id::text);

-- Allow profile creation for authenticated users
CREATE POLICY "Allow profile creation" ON profiles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

## User Data Synchronization

When a user logs in with Clerk:

1. **Check Existing Profile**: Query Supabase for existing user profile
2. **Create Profile**: If not exists, create new profile with Clerk data
3. **Update Profile**: Sync any changes from Clerk to Supabase
4. **Set User Context**: Update application state with user data

```typescript
const syncUserProfile = async (clerkUser: ClerkUser, supabase: SupabaseClient) => {
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', clerkUser.id)
    .single();

  if (!existingProfile) {
    // Create new profile
    await supabase.from('profiles').insert({
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      full_name: `${clerkUser.firstName} ${clerkUser.lastName}`.trim(),
      avatar_url: clerkUser.imageUrl,
    });
  }
};
```

## Security Considerations

### 1. JWT Validation
- Supabase validates JWT signatures using Clerk's public key
- Tokens have configurable expiration times
- Claims are verified against expected structure

### 2. Row Level Security
- All database access is controlled by RLS policies
- Policies use JWT claims to determine access rights
- Users can only access their own data by default

### 3. Token Storage
- **Web**: Stored in `localStorage` (consider `httpOnly` cookies for production)
- **Mobile**: Stored in `expo-secure-store` for enhanced security
- Tokens are cleared on logout

## Error Handling

### Common Scenarios

1. **Invalid JWT Token**:
   ```typescript
   // Supabase will return 401 Unauthorized
   // App should redirect to login
   ```

2. **Expired Token**:
   ```typescript
   // Clerk automatically refreshes tokens
   // Monitor session changes in AuthContext
   ```

3. **Network Errors**:
   ```typescript
   // Implement retry logic
   // Show appropriate error messages
   ```

## Testing

### Unit Tests
- Test Clerk service methods
- Test Supabase client creation
- Test user profile synchronization

### Integration Tests
- Test complete authentication flow
- Test RLS policy enforcement
- Test token refresh scenarios

### Manual Testing
1. Sign up with new account
2. Sign in with existing account
3. Access protected resources
4. Test logout functionality
5. Verify data persistence

## Performance Considerations

### 1. Token Caching
- Cache valid tokens to reduce API calls
- Implement token refresh logic
- Clear cache on logout

### 2. Database Queries
- Use efficient queries with proper indexing
- Implement pagination for large datasets
- Cache frequently accessed data

### 3. Network Optimization
- Minimize API calls during authentication
- Implement offline support where possible
- Use connection pooling for database access

## Monitoring and Logging

### 1. Authentication Events
- Log successful/failed login attempts
- Monitor token refresh rates
- Track user session durations

### 2. Database Access
- Monitor RLS policy performance
- Track query execution times
- Log access violations

### 3. Error Tracking
- Implement comprehensive error logging
- Monitor authentication failures
- Track API response times

## Migration from Auth0

### Data Migration
1. Export user data from Auth0
2. Transform data to Clerk format
3. Import users to Clerk
4. Update Supabase user profiles

### Code Changes
1. Replace Auth0 SDK with Clerk SDK
2. Update JWT claim mappings
3. Modify RLS policies if needed
4. Update environment variables

### Testing Migration
1. Test with migrated user accounts
2. Verify data integrity
3. Ensure all features work correctly
4. Performance testing

## Troubleshooting

### Debug Checklist
1. ✅ Clerk publishable key configured
2. ✅ JWT template created in Clerk
3. ✅ Supabase JWT settings updated
4. ✅ RLS policies configured
5. ✅ Environment variables set
6. ✅ Network connectivity

### Common Issues
- **401 Unauthorized**: Check JWT configuration
- **403 Forbidden**: Review RLS policies
- **Token expired**: Implement refresh logic
- **User not found**: Check profile creation logic