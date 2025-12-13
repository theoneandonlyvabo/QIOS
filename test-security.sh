#!/bin/bash

BASE_URL="http://localhost:3001"
PASS=0
FAIL=0

echo "========================================"
echo "  QIOS Security Fixes Verification"
echo "========================================"
echo ""
echo "Testing server at: $BASE_URL"
echo ""

# Test 1: Weak Password (No uppercase)
echo "Test 1: Weak password (no uppercase) should be rejected..."
RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser1","email":"test1@test.com","password":"12345678"}')

if echo "$RESPONSE" | grep -q "uppercase"; then
  echo "✅ PASS: Weak password rejected (no uppercase)"
  ((PASS++))
else
  echo "❌ FAIL: Weak password accepted"
  echo "Response: $RESPONSE"
  ((FAIL++))
fi
echo ""

# Test 2: Weak Password (No special chars)
echo "Test 2: Weak password (no special chars) should be rejected..."
RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser2","email":"test2@test.com","password":"TestPass123"}')

if echo "$RESPONSE" | grep -q "special character"; then
  echo "✅ PASS: Weak password rejected (no special chars)"
  ((PASS++))
else
  echo "❌ FAIL: Weak password accepted"
  echo "Response: $RESPONSE"
  ((FAIL++))
fi
echo ""

# Test 3: Invalid Product ID (String)
echo "Test 3: Invalid product ID (string) should be rejected..."
RESPONSE=$(curl -s $BASE_URL/api/products/abc)

if echo "$RESPONSE" | grep -q "Invalid ID format"; then
  echo "✅ PASS: Invalid ID rejected"
  ((PASS++))
else
  echo "❌ FAIL: Invalid ID accepted"
  echo "Response: $RESPONSE"
  ((FAIL++))
fi
echo ""

# Test 4: Invalid Product ID (Negative)
echo "Test 4: Invalid product ID (negative) should be rejected..."
RESPONSE=$(curl -s $BASE_URL/api/products/-1)

if echo "$RESPONSE" | grep -q "Invalid ID format"; then
  echo "✅ PASS: Negative ID rejected"
  ((PASS++))
else
  echo "❌ FAIL: Negative ID accepted"
  echo "Response: $RESPONSE"
  ((FAIL++))
fi
echo ""

# Test 5: Missing login fields
echo "Test 5: Missing login fields should be rejected..."
RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test"}')

if echo "$RESPONSE" | grep -q "required"; then
  echo "✅ PASS: Missing fields rejected"
  ((PASS++))
else
  echo "❌ FAIL: Missing fields accepted"
  echo "Response: $RESPONSE"
  ((FAIL++))
fi
echo ""

# Test 6: Invalid username format
echo "Test 6: Invalid username format should be rejected..."
RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test@user","email":"test3@test.com","password":"TestPass123!"}')

if echo "$RESPONSE" | grep -q "Username must be"; then
  echo "✅ PASS: Invalid username format rejected"
  ((PASS++))
else
  echo "❌ FAIL: Invalid username format accepted"
  echo "Response: $RESPONSE"
  ((FAIL++))
fi
echo ""

# Test 7: Short username
echo "Test 7: Short username should be rejected..."
RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"ab","email":"test4@test.com","password":"TestPass123!"}')

if echo "$RESPONSE" | grep -q "Username must be"; then
  echo "✅ PASS: Short username rejected"
  ((PASS++))
else
  echo "❌ FAIL: Short username accepted"
  echo "Response: $RESPONSE"
  ((FAIL++))
fi
echo ""

# Test 8: Rate limiting (5 attempts)
echo "Test 8: Rate limiting on auth endpoint..."
echo "Making 6 login attempts..."
RATE_LIMITED=false
for i in {1..6}; do
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"test"}')
  
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  
  if [ "$HTTP_CODE" = "429" ]; then
    RATE_LIMITED=true
    echo "  Attempt $i: Rate limited (429)"
    break
  else
    echo "  Attempt $i: $HTTP_CODE"
  fi
  sleep 0.5
done

if [ "$RATE_LIMITED" = true ]; then
  echo "✅ PASS: Rate limiting working"
  ((PASS++))
else
  echo "❌ FAIL: Rate limiting not working"
  ((FAIL++))
fi
echo ""

# Summary
echo "========================================"
echo "           Test Summary"
echo "========================================"
echo "✅ Passed: $PASS"
echo "❌ Failed: $FAIL"
echo "Total:    $((PASS + FAIL))"
echo ""

if [ $FAIL -eq 0 ]; then
  echo "🎉 All security tests passed!"
  echo ""
  echo "Security fixes verified:"
  echo "  ✓ Strong password policy enforced"
  echo "  ✓ Input validation working"
  echo "  ✓ ID validation preventing SQL injection"
  echo "  ✓ Username format validation"
  echo "  ✓ Rate limiting on auth endpoints"
  echo ""
  exit 0
else
  echo "⚠️  Some tests failed. Please review the output above."
  echo ""
  exit 1
fi
