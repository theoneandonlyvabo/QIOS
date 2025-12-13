# Security Fixes Verification Tests

This document contains manual and automated tests to verify all 7 security fixes.

## Prerequisites

```bash
# Server should be running
npm run dev

# Install curl or use Postman/Insomnia for API testing
```

---

## Test 1: JWT_SECRET Validation (Vulnerability #3)

### Test 1.1: Server Startup with Missing JWT_SECRET

**Expected:** Server should start with warning in development, fail in production

**Steps:**
1. Temporarily rename `.env` to `.env.backup`
2. Start server: `npm run dev`
3. Check console output

**Expected Result:**
```
⚠️  WARNING: JWT_SECRET not set. Using default development secret.
⚠️  DO NOT use this in production!
```

**Status:** ✅ PASS (server starts with warning)

### Test 1.2: Server Startup with Short JWT_SECRET

**Expected:** Server should warn about weak secret

**Steps:**
1. Set `JWT_SECRET=short` in `.env`
2. Restart server

**Expected Result:**
```
⚠️  WARNING: JWT_SECRET is less than 32 characters. Please use a stronger secret.
```

---

## Test 2: CORS Configuration (Vulnerability #1)

### Test 2.1: Request from Allowed Origin

**Command:**
```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:3001/api/auth/login -v
```

**Expected Result:**
- Status: 200 or 204
- Headers should include: `Access-Control-Allow-Origin: http://localhost:3000`

### Test 2.2: Request from Disallowed Origin

**Command:**
```bash
curl -H "Origin: http://malicious-site.com" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     http://localhost:3001/api/auth/login -v
```

**Expected Result:**
- CORS error or no `Access-Control-Allow-Origin` header
- Request should be blocked

---

## Test 3: Input Sanitization in Login (Vulnerability #2)

### Test 3.1: Login with Valid Input

**Command:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPass123!"
  }'
```

**Expected Result:**
- If user exists: 200 with token
- If user doesn't exist: 401 with "Invalid credentials"

### Test 3.2: Login with Missing Fields

**Command:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser"
  }'
```

**Expected Result:**
```json
{
  "error": "Username and password are required"
}
```
**Status:** Should return 400

### Test 3.3: Login with Invalid Username Format

**Command:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test<script>alert(1)</script>",
    "password": "TestPass123!"
  }'
```

**Expected Result:**
```json
{
  "error": "Invalid credentials"
}
```
**Status:** Should return 401 (username sanitized and format validated)

### Test 3.4: Login with SQL Injection Attempt

**Command:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin'\'' OR '\''1'\''='\''1",
    "password": "anything"
  }'
```

**Expected Result:**
```json
{
  "error": "Invalid credentials"
}
```
**Status:** Should return 401 (invalid username format)

---

## Test 4: Strong Password Policy (Vulnerability #4)

### Test 4.1: Registration with Weak Password (Only Numbers)

**Command:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser1",
    "email": "newuser1@test.com",
    "password": "12345678"
  }'
```

**Expected Result:**
```json
{
  "error": "Password must contain at least one uppercase letter"
}
```
**Status:** Should return 400

### Test 4.2: Registration with No Special Characters

**Command:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser2",
    "email": "newuser2@test.com",
    "password": "TestPass123"
  }'
```

**Expected Result:**
```json
{
  "error": "Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>_-+=[];/\\`~)"
}
```
**Status:** Should return 400

### Test 4.3: Registration with Strong Password

**Command:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser3",
    "email": "newuser3@test.com",
    "password": "TestPass123!"
  }'
```

**Expected Result:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "...",
    "username": "newuser3",
    "email": "newuser3@test.com"
  }
}
```
**Status:** Should return 201 (if username/email not taken)

---

## Test 5: ID Validation in Products (Vulnerability #5)

### Test 5.1: Get Product with Valid ID

**Command:**
```bash
curl http://localhost:3001/api/products/1
```

**Expected Result:**
- 200 with product data (if exists)
- 404 with "Product not found" (if doesn't exist)

### Test 5.2: Get Product with Invalid ID (String)

**Command:**
```bash
curl http://localhost:3001/api/products/abc
```

**Expected Result:**
```json
{
  "error": "Invalid ID format",
  "details": "ID must be a positive integer"
}
```
**Status:** Should return 400

### Test 5.3: Get Product with Invalid ID (Negative)

**Command:**
```bash
curl http://localhost:3001/api/products/-1
```

**Expected Result:**
```json
{
  "error": "Invalid ID format",
  "details": "ID must be a positive integer"
}
```
**Status:** Should return 400

### Test 5.4: Get Product with Invalid ID (SQL Injection Attempt)

**Command:**
```bash
curl "http://localhost:3001/api/products/1%20OR%201=1"
```

**Expected Result:**
```json
{
  "error": "Invalid ID format",
  "details": "ID must be a positive integer"
}
```
**Status:** Should return 400

---

## Test 6: Error Message Security (Vulnerability #6)

### Test 6.1: Trigger Server Error

**Command:**
```bash
# Stop database or use invalid database URL
curl http://localhost:3001/api/products
```

**Expected Result (Production):**
```json
{
  "error": "Failed to fetch products"
}
```

**Expected Result (Development):**
```json
{
  "error": "Failed to fetch products"
}
```

**Important:** 
- ❌ Should NOT see stack traces
- ❌ Should NOT see database connection strings
- ❌ Should NOT see internal error details

---

## Test 7: Rate Limiting on Auth Endpoints (Vulnerability #7)

### Test 7.1: Multiple Login Attempts

**Bash Script:**
```bash
#!/bin/bash
echo "Testing rate limiting on login endpoint..."
for i in {1..10}; do
  echo "Attempt $i:"
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"test"}' \
    -w "\nStatus: %{http_code}\n\n"
  sleep 1
done
```

**Expected Result:**
- Attempts 1-5: Should return 401 (Invalid credentials)
- Attempt 6+: Should return 429 (Too Many Requests)

**Error Message on Rate Limit:**
```json
{
  "error": "Too many authentication attempts from this IP, please try again after 15 minutes"
}
```

### Test 7.2: Rate Limiting on Regular API Endpoints

**Bash Script:**
```bash
#!/bin/bash
echo "Testing rate limiting on products endpoint..."
for i in {1..105}; do
  curl -s http://localhost:3001/api/products > /dev/null
  if [ $((i % 10)) -eq 0 ]; then
    echo "Completed $i requests"
  fi
done
echo "Attempt 101:"
curl http://localhost:3001/api/products -w "\nStatus: %{http_code}\n"
```

**Expected Result:**
- Requests 1-100: Should return 200
- Request 101+: Should return 429 (Too Many Requests)

---

## Test 8: Username Format Validation

### Test 8.1: Invalid Username (Too Short)

**Command:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ab",
    "email": "test@test.com",
    "password": "TestPass123!"
  }'
```

**Expected Result:**
```json
{
  "error": "Username must be 3-50 characters and contain only letters, numbers, and underscores"
}
```

### Test 8.2: Invalid Username (Special Characters)

**Command:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test@user",
    "email": "test@test.com",
    "password": "TestPass123!"
  }'
```

**Expected Result:**
```json
{
  "error": "Username must be 3-50 characters and contain only letters, numbers, and underscores"
}
```

---

## Automated Test Script

Create a file `test-security.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3001"
PASS=0
FAIL=0

echo "================================"
echo "Security Fixes Verification"
echo "================================"
echo ""

# Test 1: Weak Password
echo "Test 1: Weak password should be rejected..."
RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test1","email":"test1@test.com","password":"12345678"}')

if echo "$RESPONSE" | grep -q "uppercase"; then
  echo "✅ PASS: Weak password rejected"
  ((PASS++))
else
  echo "❌ FAIL: Weak password accepted"
  ((FAIL++))
fi
echo ""

# Test 2: Invalid ID
echo "Test 2: Invalid product ID should be rejected..."
RESPONSE=$(curl -s $BASE_URL/api/products/abc)

if echo "$RESPONSE" | grep -q "Invalid ID format"; then
  echo "✅ PASS: Invalid ID rejected"
  ((PASS++))
else
  echo "❌ FAIL: Invalid ID accepted"
  ((FAIL++))
fi
echo ""

# Test 3: Missing login fields
echo "Test 3: Missing login fields should be rejected..."
RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test"}')

if echo "$RESPONSE" | grep -q "required"; then
  echo "✅ PASS: Missing fields rejected"
  ((PASS++))
else
  echo "❌ FAIL: Missing fields accepted"
  ((FAIL++))
fi
echo ""

# Summary
echo "================================"
echo "Test Summary"
echo "================================"
echo "Passed: $PASS"
echo "Failed: $FAIL"
echo ""

if [ $FAIL -eq 0 ]; then
  echo "🎉 All tests passed!"
  exit 0
else
  echo "⚠️  Some tests failed"
  exit 1
fi
```

**Run with:**
```bash
chmod +x test-security.sh
./test-security.sh
```

---

## Manual Browser Testing

### Test CORS in Browser Console

1. Open browser console on `http://localhost:3000`
2. Run:
```javascript
fetch('http://localhost:3001/api/products')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**Expected:** Should work (localhost:3000 is in ALLOWED_ORIGINS)

3. Open browser console on any other domain
4. Run same code

**Expected:** CORS error

---

## Verification Checklist

- [ ] JWT_SECRET validation works on startup
- [ ] CORS blocks unauthorized origins
- [ ] Login validates and sanitizes input
- [ ] Weak passwords are rejected
- [ ] Invalid IDs are rejected
- [ ] No stack traces in error responses
- [ ] Rate limiting works on auth endpoints
- [ ] Rate limiting works on API endpoints
- [ ] Username format validation works
- [ ] All tests pass

---

## Notes

- All tests should be run in both development and production modes
- Check server logs for any warnings or errors
- Verify no sensitive information is logged
- Test with real database to ensure queries work correctly
