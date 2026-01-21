# Authorization Token Fix

## Problem

The authorization token was not being passed to API calls for admin users (and all users). This was causing 401 Unauthorized errors when trying to access protected endpoints.

## Root Cause

All services were using **singleton pattern** with the token being read only once during service construction:

```typescript
// ❌ BEFORE - Token read only once
constructor() {
  const token = localStorage.getItem("accessToken");  // Read once!
  this.api = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),  // Fixed at construction
    },
  });
}
```

### Why This Was a Problem

1. **Service instances are created once** when the module is imported (singleton pattern)
2. **Token is null at import time** - users haven't logged in yet
3. **After login**, the token is saved to localStorage, but services still have `null` in their headers
4. **All subsequent API calls fail** because no token is sent

### Timeline

```
1. App starts → Services imported → Token = null (not logged in yet)
2. Services created → Axios instances have no Authorization header
3. User logs in → Token saved to localStorage
4. User makes API call → Service uses old axios instance (no token!)
5. Server rejects request → 401 Unauthorized
```

## Solution

Use **axios interceptors** to read the token fresh on every request:

```typescript
// ✅ AFTER - Token read on every request
constructor() {
  this.api = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Interceptor runs before EVERY request
  this.api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");  // Fresh token!
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}
```

### How Interceptors Work

1. **User makes API call** → `symptomsService.getAll()`
2. **Interceptor runs** → Reads current token from localStorage
3. **Adds Authorization header** → `Bearer ${token}`
4. **Request sent** → With current token
5. **Server validates** → Request succeeds ✅

## Services Updated

All protected services now use interceptors:

- ✅ `SeverityScaleService` (`src/services/SeverityScale/severity-scale.service.ts`)
- ✅ `SymptomsService` (`src/services/Symptoms/symptoms.service.ts`)
- ✅ `DiagnosisService` (`src/services/Diagnosis/diagnosis.service.ts`)
- ✅ `TreatmentsService` (`src/services/Treatments/treatments.service.ts`)
- ℹ️ `AuthService` - No change needed (login/register don't require tokens)

## Benefits

### 1. **Always Current Token**
- Token is read fresh on every request
- No stale token issues
- Works correctly after login

### 2. **Auto Token Refresh**
- If token changes (e.g., after refresh), next request uses new token
- No need to recreate service instances

### 3. **Works for All Roles**
- Admin users ✅
- Regular users ✅
- Any future roles ✅

### 4. **Proper Error Handling**
- If token is missing, request still sent (server will handle)
- If token is invalid, server returns proper error
- Interceptor error handling preserves error details

## Testing

To verify the fix works:

### 1. Check Network Tab
```
Before: Authorization header missing
After:  Authorization: Bearer eyJhbGc...
```

### 2. Test Login Flow
```
1. Open app (not logged in)
2. Login as admin
3. Navigate to Symptoms page
4. Check network tab - should see Authorization header
5. API calls should succeed
```

### 3. Test Multiple Roles
```
1. Login as admin → Create symptom → Should work ✅
2. Logout
3. Login as regular user → View symptoms → Should work ✅
```

## Code Pattern

Use this pattern for any new services that require authentication:

```typescript
export class YourService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor for authentication
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  // Your methods here...
}
```

## Alternative Solutions Considered

### Option 1: Recreate Service Instance
❌ **Not scalable** - Would need to recreate all services after login

### Option 2: Pass Token to Each Method
❌ **Poor DX** - Would need to change every method signature

### Option 3: Global Axios Defaults
❌ **Affects all axios instances** - Including third-party libraries

### Option 4: Interceptors ✅
**Best solution** - Centralized, automatic, no breaking changes

## Notes

- The interceptor runs synchronously before each request
- Very minimal performance overhead
- Standard pattern in React/Axios applications
- Works with async token refresh patterns if needed in future

## Related Issues

If you still see authorization errors, check:

1. **Token is being saved** - Check localStorage after login
2. **Token format** - Should be JWT format
3. **Server expects "Bearer"** - Some servers expect different format
4. **Token not expired** - Check token expiration
5. **CORS configuration** - Server must allow Authorization header
