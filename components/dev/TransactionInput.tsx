'use client';

import { useState, useEffect } from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
};

interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

interface PendingOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  createdAt: string;
}

export default function TransactionInput() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [transactionTime, setTransactionTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    loadProducts();
    loadPendingOrders();
    
    // Set default date/time to now
    const now = new Date();
    setTransactionDate(now.toISOString().split('T')[0]);
    setTransactionTime(now.toTimeString().slice(0, 5));
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/dev/products');
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      if (!data.products || !Array.isArray(data.products)) {
        throw new Error('Invalid response format: products array missing');
      }
      if (data.products.length === 0) {
        setError('No products found. Run seed: npx ts-node prisma/seed-coffee-shop.ts');
      }
      setProducts(data.products || []);
    } catch (err: any) {
      console.error('Failed to load products:', err);
      setError(`Failed to load products: ${err?.message || err}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingOrders = async () => {
    try {
      const res = await fetch('/api/dev/pending-orders');
      const data = await res.json();
      setPendingOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to load pending orders:', error);
    }
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.productId === product.id);
    
    if (existing) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1
      }]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      ));
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const createTransaction = async () => {
    if (!customerName || !customerPhone) {
      alert('Customer name and phone required');
      return;
    }

    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    try {
      const transactionDateTime = new Date(`${transactionDate}T${transactionTime}`);

      const res = await fetch('/api/dev/create-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerName,
          customerPhone,
          items: cart,
          paymentMethod,
          transactionDate: transactionDateTime.toISOString()
        })
      });

      const data = await res.json();

      if (res.ok) {
        setNotification(`✅ Transaction created: ${data.orderNumber}`);
        setCustomerName('');
        setCustomerPhone('');
        setCart([]);
        loadPendingOrders();
      } else {
        setNotification(`❌ Failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      alert('Transaction failed');
    }
  };

  const tarikDana = async (orderId: string) => {
    try {
      const res = await fetch('/api/dev/tarik-dana', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });

      const data = await res.json();

      if (res.ok) {
        setNotification(`✅ Payment confirmed for: ${data.orderNumber}`);
        loadPendingOrders();
      } else {
        setNotification(`❌ Failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Tarik dana failed:', error);
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!confirm('Cancel this order? This will revert stock changes.')) return;

    try {
      const res = await fetch('/api/dev/cancel-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });

      if (res.ok) {
        setNotification('✅ Order cancelled');
        loadPendingOrders();
      } else {
        const data = await res.json();
        setNotification(`❌ Failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Cancel failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border-4 border-red-600 p-4">
          <div className="font-bold text-red-800 mb-2">⚠️ ERROR</div>
          <div className="text-sm">{error}</div>
          <button onClick={loadProducts} className="mt-3 bg-red-600 text-white px-4 py-2 font-bold">RETRY</button>
        </div>
      )}
      {/* Notification */}
      {notification && (
        <div className="p-4 bg-gray-100 rounded">
          <p>{notification}</p>
        </div>
      )}

      {/* Customer Info */}
      <div className="border-2 border-gray-300 p-4">
        <h2 className="text-xl font-bold mb-4">Customer Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Customer name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="08xxx"
            />
          </div>
        </div>
      </div>

      {/* Product Selection */}
      <div className="border-2 border-gray-300 p-4">
        <h2 className="text-xl font-bold mb-4">Products</h2>
        {loading && (
          <div className="text-center py-8 text-gray-500">Loading products...</div>
        )}

        {!loading && products.length === 0 && !error && (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">No products available</div>
            <div className="text-sm text-gray-400">Run seed: <code className="bg-gray-100 px-2 py-1">npx ts-node prisma/seed-coffee-shop.ts</code></div>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="p-4 border rounded hover:bg-blue-50"
              >
                <div className="font-bold">{product.name}</div>
                <div className="text-gray-600">Rp {product.price.toLocaleString()}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Cart */}
      <div className="border-2 border-gray-300 p-4">
        <h2 className="text-xl font-bold mb-4">Cart</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">Cart is empty</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.productId} className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{item.productName}</span>
                  <span className="text-gray-600 ml-2">
                    @ Rp {item.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                  <span className="w-32 text-right">
                    Rp {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
            <div className="text-xl font-bold text-right pt-4 border-t">
              Total: Rp {calculateTotal().toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* Transaction Details */}
      <div className="border-2 border-gray-300 p-4">
        <h2 className="text-xl font-bold mb-4">Transaction Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <input
              type="time"
              value={transactionTime}
              onChange={(e) => setTransactionTime(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="QRIS">QRIS</option>
              <option value="CASH">Cash</option>
              <option value="DANA">DANA</option>
              <option value="OVO">OVO</option>
              <option value="GOPAY">GoPay</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Create Button */}
      <button
        onClick={createTransaction}
        disabled={cart.length === 0 || !customerName || !customerPhone}
        className="w-full bg-blue-600 text-white font-bold text-xl p-4 border-4 border-blue-800 disabled:bg-gray-400 disabled:border-gray-600"
      >
        Create Transaction ({cart.length} items)
      </button>

      {/* Pending Orders */}
      {pendingOrders.length > 0 && (
        <div className="border-2 border-orange-300 p-4 bg-orange-50">
          <h2 className="text-xl font-bold mb-4">🕒 Pending Orders</h2>
          <div className="space-y-4">
            {pendingOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between bg-white p-4 rounded border">
                <div>
                  <div className="font-medium">{order.orderNumber}</div>
                  <div className="text-sm text-gray-600">{order.customerName}</div>
                  <div className="text-sm text-gray-600">
                    Rp {order.total.toLocaleString()}
                  </div>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => tarikDana(order.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Tarik Dana
                  </button>
                  <button
                    onClick={() => cancelOrder(order.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}