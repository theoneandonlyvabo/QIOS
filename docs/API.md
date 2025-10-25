# QIOS API Documentation

## Overview

QIOS API menyediakan endpoints untuk integrasi payment gateway, AI analytics, dan manajemen bisnis retail.

## Base URL

```
Production: https://api.qios.com
Development: http://localhost:3000/api
```

## Authentication

API menggunakan JWT token untuk autentikasi. Include token di header:

```http
Authorization: Bearer <your-jwt-token>
```

## Payment Gateway APIs

### Create Payment

Membuat payment baru dengan gateway yang dipilih.

**Endpoint:** `POST /api/payment/create`

**Request Body:**
```json
{
  "gatewayType": "midtrans",
  "paymentMethod": "bank_transfer",
  "orderId": "ORDER-123456",
  "amount": 100000,
  "customerDetails": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "081234567890"
  },
  "itemDetails": [
    {
      "id": "ITEM-001",
      "price": 50000,
      "quantity": 2,
      "name": "Product A"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction_id": "txn_123456",
    "status": "pending"
  },
  "paymentUrl": "https://payment.midtrans.com/...",
  "virtualAccountNumber": "1234567890",
  "qrCode": "00020101021243650016COM.MIDTRANS.WWW...",
  "deepLink": "gopay://payment/..."
}
```

### Verify Payment

Verifikasi status pembayaran.

**Endpoint:** `POST /api/payment/verify`

**Request Body:**
```json
{
  "gatewayType": "midtrans",
  "orderId": "ORDER-123456",
  "paymentId": "txn_123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction_id": "txn_123456",
    "status": "settlement",
    "amount": 100000,
    "payment_type": "bank_transfer"
  },
  "status": "settlement",
  "paymentType": "bank_transfer"
}
```

### Get Available Gateways

Mendapatkan daftar payment gateway yang tersedia.

**Endpoint:** `GET /api/payment/gateways`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "type": "midtrans",
      "name": "Midtrans",
      "description": "Multi-payment gateway with bank transfer and e-wallet support",
      "supportedMethods": ["bank_transfer", "gopay", "shopeepay", "dana", "ovo", "linkaja"],
      "logo": "/logos/midtrans.png"
    },
    {
      "type": "xendit",
      "name": "Xendit",
      "description": "Payment infrastructure with virtual accounts and QRIS",
      "supportedMethods": ["virtual_account", "qris", "OVO", "DANA", "LINKAJA", "SHOPEEPAY"],
      "logo": "/logos/xendit.png"
    }
  ]
}
```

## AI Analytics APIs

### Generate Business Insights

Generate AI-powered business insights berdasarkan data bisnis.

**Endpoint:** `POST /api/analytics/insights`

**Request Body:**
```json
{
  "businessData": {
    "sales": [
      {
        "date": "2024-01-01",
        "amount": 1500000,
        "items": 25,
        "customerCount": 20
      }
    ],
    "inventory": [
      {
        "productId": "1",
        "name": "Product A",
        "stock": 5,
        "price": 50000,
        "category": "Electronics"
      }
    ],
    "expenses": [
      {
        "date": "2024-01-01",
        "amount": 500000,
        "category": "Rent",
        "description": "Monthly rent"
      }
    ],
    "customers": [
      {
        "id": "1",
        "name": "John Doe",
        "email": "john@example.com",
        "totalSpent": 500000,
        "lastPurchase": "2024-01-01",
        "frequency": 5
      }
    ]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "type": "trend",
      "title": "Sales Growth Trend",
      "description": "Penjualan menunjukkan tren positif dengan peningkatan 15% dari bulan sebelumnya",
      "impact": "high",
      "actionable": true,
      "action": "Pertahankan strategi marketing yang sedang berjalan",
      "confidence": 0.85
    },
    {
      "type": "warning",
      "title": "Low Stock Alert",
      "description": "Beberapa produk memiliki stok rendah yang berisiko kehabisan",
      "impact": "high",
      "actionable": true,
      "action": "Segera restock produk dengan stok < 10 unit",
      "confidence": 0.92
    }
  ]
}
```

### Cashflow Analysis

Analisis cashflow bisnis dengan AI.

**Endpoint:** `POST /api/analytics/cashflow`

**Request Body:** Same as insights endpoint

**Response:**
```json
{
  "success": true,
  "data": {
    "cashflow": {
      "inflow": 5000000,
      "outflow": 3000000,
      "net": 2000000,
      "trend": "positive"
    },
    "recommendations": [
      "Optimalkan cashflow dengan mempercepat penagihan piutang",
      "Pertimbangkan investasi pada inventory yang high-margin"
    ],
    "risks": [
      "Risiko kehabisan cash jika ada peningkatan biaya operasional mendadak"
    ]
  }
}
```

### Inventory Insights

Analisis inventory dengan AI recommendations.

**Endpoint:** `POST /api/analytics/inventory`

**Request Body:** Same as insights endpoint

**Response:**
```json
{
  "success": true,
  "data": {
    "stockAlerts": [
      {
        "productId": "1",
        "name": "Product A",
        "currentStock": 5,
        "recommendedStock": 20,
        "urgency": "high"
      }
    ],
    "recommendations": [
      "Implementasikan sistem reorder point untuk otomatisasi restock",
      "Analisis ABC untuk optimasi inventory management"
    ]
  }
}
```

## Error Handling

Semua API endpoints mengembalikan response dengan format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request (missing parameters, invalid data)
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API memiliki rate limiting untuk mencegah abuse:

- **Payment APIs**: 100 requests per minute per IP
- **Analytics APIs**: 50 requests per minute per IP
- **General APIs**: 200 requests per minute per IP

## SDK Examples

### JavaScript/TypeScript

```typescript
// Create payment
const response = await fetch('/api/payment/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token'
  },
  body: JSON.stringify({
    gatewayType: 'midtrans',
    paymentMethod: 'bank_transfer',
    orderId: 'ORDER-123456',
    amount: 100000,
    customerDetails: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '081234567890'
    },
    itemDetails: [
      {
        id: 'ITEM-001',
        price: 50000,
        quantity: 2,
        name: 'Product A'
      }
    ]
  })
});

const result = await response.json();
```

### Python

```python
import requests

# Create payment
response = requests.post(
    'https://api.qios.com/api/payment/create',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-jwt-token'
    },
    json={
        'gatewayType': 'midtrans',
        'paymentMethod': 'bank_transfer',
        'orderId': 'ORDER-123456',
        'amount': 100000,
        'customerDetails': {
            'firstName': 'John',
            'lastName': 'Doe',
            'email': 'john@example.com',
            'phone': '081234567890'
        },
        'itemDetails': [
            {
                'id': 'ITEM-001',
                'price': 50000,
                'quantity': 2,
                'name': 'Product A'
            }
        ]
    }
)

result = response.json()
```

## Webhooks

QIOS mendukung webhooks untuk notifikasi real-time:

### Payment Webhook

**Endpoint:** `POST /webhooks/payment`

**Headers:**
```http
X-QIOS-Signature: sha256=...
Content-Type: application/json
```

**Payload:**
```json
{
  "event": "payment.completed",
  "data": {
    "orderId": "ORDER-123456",
    "transactionId": "txn_123456",
    "amount": 100000,
    "status": "settlement",
    "paymentType": "bank_transfer",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

## Testing

### Sandbox Environment

Gunakan sandbox environment untuk testing:

```bash
# Set environment variables
export QIOS_ENV=sandbox
export MIDTRANS_IS_PRODUCTION=false
export XENDIT_ENVIRONMENT=sandbox
```

### Test Cards

**Midtrans Test Cards:**
- Visa: 4811 1111 1111 1114
- Mastercard: 5211 1111 1111 1117

**Xendit Test Cards:**
- Visa: 4000 0000 0000 0002
- Mastercard: 5555 5555 5555 4444

## Support

- **Documentation**: [API Docs](https://docs.qios.com)
- **Status Page**: [Status](https://status.qios.com)
- **Support Email**: api-support@qios.com
- **GitHub Issues**: [Issues](https://github.com/qios/api-issues)
