# Logout Bug Analysis & Fix - 2025-11-02

## Problem Summary

When clicking logout on dashboard, nothing happens (silently fails) and session remains active in database.

## Root Causes Identified

### Issue #1: Frontend Logout Doesn't Call Backend
**Location:** `app/dashboard/page.tsx` (line 255-258)

**Current Code:**
```typescript
const handleLogout = () => {
  localStorage.removeItem('token');  // Only removes local token
  router.push('/login');             // Redirects to login
};
```

**Problem:**
- Removes token from browser storage only
- Never calls the n8n logout webhook
- Session remains active in database (`sessions` table)
- Token can be reused if intercepted

**What Should Happen:**
1. Call logout webhook/API endpoint
2. Invalidate session in database
3. Clear local token
4. Redirect to login

---

### Issue #2: n8n Workflow Connection Logic Broken
**Location:** Logout workflow nodes

**Current Flow:**
```
Webhook → Extract Token → Delete Session → Check Delete Result → ??
                     ↓                              ↓
                 Respond Error ←────────────────────↓
```

**Problems:**

1. **Extract Token branches incorrectly**
   - If token valid: goes to "Delete Session" ✅
   - If token invalid: goes to "Respond Error" ✅
   - But connection shows TWO outputs from Extract Token node
   - This is a routing issue in n8n

2. **Check Delete Result branches incorrectly**
   - If session deleted: should go to "Respond Success"
   - If session not found: should go to "Respond Error"
   - But output shows TWO connections - unclear which is which

3. **Missing Conditional Routing**
   - No IF statement to check deletion success
   - Both success and error responses are called!
   - Could send both responses (causes HTTP error)

---

## Solutions

### Solution #1: Fix Frontend Logout (IMMEDIATE)

**File:** `app/dashboard/page.tsx`

**Change from:**
```typescript
const handleLogout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};
```

**Change to:**
```typescript
const handleLogout = async () => {
  try {
    const token = localStorage.getItem('token');

    if (token) {
      // Call logout API/webhook to invalidate session
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }).catch(err => console.error('Logout request failed:', err));
    }

    // Clear local token
    localStorage.removeItem('token');

    // Redirect to login
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
    // Force logout anyway
    localStorage.removeItem('token');
    router.push('/login');
  }
};
```

**Why This Fixes It:**
- Calls logout endpoint to invalidate session
- Gracefully handles if API fails (still clears local token)
- Proper error handling

---

### Solution #2: Fix n8n Logout Workflow

**Issue:** Workflow routing is unclear and could cause issues

**Fixed Workflow:**

```
1. Webhook Logout
   ↓
2. Extract Token
   ├─ If token valid → Delete Session
   └─ If token invalid → Respond Error (401)

3. Delete Session
   ↓
4. Check Delete Result
   ├─ If deleted → Respond Success (200)
   └─ If not found → Respond Error (401)

5. End
```

**Key Fixes:**

1. **Extract Token node - Use IF condition instead of routing to 2 nodes**
   ```javascript
   // Current: Incorrectly sends to both Delete Session AND Respond Error
   // Fix: Use n8n IF node to route correctly
   ```

2. **Check Delete Result node - Use IF condition**
   ```javascript
   // Instead of connecting to both Respond Success AND Respond Error
   // Use IF node: if (deleteResult.id) then Success else Error
   ```

3. **Correct SQL Query**
   ```sql
   DELETE FROM sessions
   WHERE access_token = $1
   RETURNING id
   ```
   Current has issue: `{{ $json.token }}` might not work in n8n SQL context

---

## Database Verification

**Check if session was deleted:**
```sql
-- Run on VPS PostgreSQL
SELECT * FROM sessions WHERE access_token = 'YOUR_TOKEN_HERE';
-- Should return empty after logout
```

**Check sessions table structure:**
```sql
\d sessions
```

---

## Testing the Fix

### Step 1: Frontend Test
1. Login to dashboard
2. Open browser DevTools → Application → LocalStorage
3. Note the token value
4. Click "Déconnexion" button
5. Verify:
   - Token removed from localStorage
   - Redirected to /login

### Step 2: Backend Test
```bash
# Run on VPS
psql -U n8n_user -d job_automation_db -c "SELECT * FROM sessions;"

# After logout, token should not appear in results
```

### Step 3: n8n Workflow Test
1. Go to n8n dashboard
2. Open logout-workflow
3. Click "Test" (manual trigger)
4. Send POST to: `/webhook/auth-logout`
5. Header: `Authorization: Bearer <valid_token>`
6. Verify response: `{ "success": true, "message": "Déconnexion réussie" }`

---

## Additional Improvements

### Add API endpoint as alternative to webhook
**File:** Create `app/api/auth/logout/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token manquant' },
        { status: 401 }
      )
    }

    // Delete session from database
    const deleted = await prisma.session.delete({
      where: { access_token: token },
      select: { id: true },
    }).catch(() => null)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Session non trouvée' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Déconnexion réussie' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    )
  }
}
```

**Why Better:**
- Faster than calling n8n webhook
- Type-safe with Prisma
- Direct database access
- No external dependency

---

## Summary

| Component | Issue | Fix | Priority |
|-----------|-------|-----|----------|
| Frontend Logout | Doesn't call backend | Call `/api/auth/logout` endpoint | CRITICAL |
| n8n Workflow | Routing logic unclear | Use IF nodes for proper routing | HIGH |
| Session Deletion | May not work properly | Verify SQL query works | MEDIUM |
| Error Handling | No graceful fallback | Add try/catch with cleanup | MEDIUM |

---

## Recommended Action Plan

1. **CRITICAL** - Fix frontend logout to call backend
2. **HIGH** - Implement `/api/auth/logout` endpoint (preferred)
3. **HIGH** - Fix n8n workflow routing (if using webhook)
4. **MEDIUM** - Test end-to-end logout flow
5. **MEDIUM** - Add logging/monitoring

---

*Analysis: 2025-11-02*
