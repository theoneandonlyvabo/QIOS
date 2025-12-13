# QIOS Security Fixes Verification (PowerShell)
# Run this script to test all security fixes

$baseUrl = "http://localhost:3001"
$passed = 0
$failed = 0

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  QIOS Security Fixes Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Testing server at: $baseUrl" -ForegroundColor Yellow
Write-Host ""

# Test 1: Invalid Product ID
Write-Host "Test 1: Invalid product ID (string) should be rejected..." -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/products/abc" -Method GET -ErrorAction Stop
    Write-Host "❌ FAIL: Invalid ID was accepted (should return 400)" -ForegroundColor Red
    $failed++
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "✅ PASS: Invalid ID rejected with 400" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "❌ FAIL: Wrong status code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        $failed++
    }
}
Write-Host ""

# Test 2: Negative Product ID
Write-Host "Test 2: Negative product ID should be rejected..." -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/products/-1" -Method GET -ErrorAction Stop
    Write-Host "❌ FAIL: Negative ID was accepted" -ForegroundColor Red
    $failed++
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "✅ PASS: Negative ID rejected with 400" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "❌ FAIL: Wrong status code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        $failed++
    }
}
Write-Host ""

# Test 3: Missing login fields
Write-Host "Test 3: Missing login fields should be rejected..." -ForegroundColor White
try {
    $body = @{
        username = "test"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -ErrorAction Stop
    
    Write-Host "❌ FAIL: Missing fields were accepted" -ForegroundColor Red
    $failed++
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "✅ PASS: Missing fields rejected with 400" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "❌ FAIL: Wrong status code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        $failed++
    }
}
Write-Host ""

# Test 4: Weak password (no uppercase)
Write-Host "Test 4: Weak password (no uppercase) should be rejected..." -ForegroundColor White
try {
    $body = @{
        username = "testuser1"
        email = "test1@test.com"
        password = "12345678"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$baseUrl/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -ErrorAction Stop
    
    Write-Host "❌ FAIL: Weak password was accepted" -ForegroundColor Red
    $failed++
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "✅ PASS: Weak password rejected with 400" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "❌ FAIL: Wrong status code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        $failed++
    }
}
Write-Host ""

# Test 5: Weak password (no special chars)
Write-Host "Test 5: Weak password (no special chars) should be rejected..." -ForegroundColor White
try {
    $body = @{
        username = "testuser2"
        email = "test2@test.com"
        password = "TestPass123"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$baseUrl/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -ErrorAction Stop
    
    Write-Host "❌ FAIL: Weak password was accepted" -ForegroundColor Red
    $failed++
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "✅ PASS: Weak password rejected with 400" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "❌ FAIL: Wrong status code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        $failed++
    }
}
Write-Host ""

# Test 6: Invalid username format
Write-Host "Test 6: Invalid username format should be rejected..." -ForegroundColor White
try {
    $body = @{
        username = "test@user"
        email = "test3@test.com"
        password = "TestPass123!"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$baseUrl/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -ErrorAction Stop
    
    Write-Host "❌ FAIL: Invalid username format was accepted" -ForegroundColor Red
    $failed++
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "✅ PASS: Invalid username format rejected with 400" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "❌ FAIL: Wrong status code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        $failed++
    }
}
Write-Host ""

# Test 7: Short username
Write-Host "Test 7: Short username should be rejected..." -ForegroundColor White
try {
    $body = @{
        username = "ab"
        email = "test4@test.com"
        password = "TestPass123!"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$baseUrl/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -ErrorAction Stop
    
    Write-Host "❌ FAIL: Short username was accepted" -ForegroundColor Red
    $failed++
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "✅ PASS: Short username rejected with 400" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "❌ FAIL: Wrong status code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        $failed++
    }
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "           Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Passed: $passed" -ForegroundColor Green
Write-Host "❌ Failed: $failed" -ForegroundColor Red
Write-Host "Total:    $($passed + $failed)" -ForegroundColor White
Write-Host ""

if ($failed -eq 0) {
    Write-Host "🎉 All security tests passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Security fixes verified:" -ForegroundColor Yellow
    Write-Host "  ✓ Strong password policy enforced" -ForegroundColor White
    Write-Host "  ✓ Input validation working" -ForegroundColor White
    Write-Host "  ✓ ID validation preventing SQL injection" -ForegroundColor White
    Write-Host "  ✓ Username format validation" -ForegroundColor White
    Write-Host ""
    exit 0
} else {
    Write-Host "⚠️  Some tests failed. Please review the output above." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
