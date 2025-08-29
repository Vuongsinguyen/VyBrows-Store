'use client';

import { useState } from 'react';

export default function TestCheckout() {
  const [orders, setOrders] = useState([]);
  const [googleSheetsStatus, setGoogleSheetsStatus] = useState<'unknown' | 'success' | 'error'>('unknown');
  const [lastOrderTimestamp, setLastOrderTimestamp] = useState<string>('');

  const testGoogleSheetsOrder = async () => {
    const testData = {
      customerInfo: {
        name: 'Google Sheets Test Customer',
        email: 'gsheets-test@example.com'
        // Only name and email required for Google Sheets
      },
      items: [
        { title: 'Test Product 1', quantity: 2, price: '29.99' },
        { title: 'Test Product 2', quantity: 1, price: '49.99' }
      ],
      total: '109.97',
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/save-order-to-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      const result = await response.json();

      if (result.success) {
        setGoogleSheetsStatus('success');
        setLastOrderTimestamp(result.timestamp); // Use timestamp instead of orderId
        alert(`✅ Test order saved to Google Sheets!\n\nTimestamp: ${result.timestamp}\n\n📊 View in spreadsheet: ${result.spreadsheetUrl}`);
      } else {
        setGoogleSheetsStatus('error');
        alert(`❌ Google Sheets Error: ${result.message}`);
      }
    } catch (error) {
      setGoogleSheetsStatus('error');
      alert('❌ Network error - check console for details');
      console.error('Test order error:', error);
    }
  };

  const testLocalOrder = async () => {
    const testData = {
      customerInfo: {
        name: 'Local Test Customer',
        email: 'local-test@example.com',
        phone: '+0987654321',
        address: '456 Local Test Avenue, Test City'
      },
      items: [
        { title: 'Local Test Product', quantity: 1, price: '19.99' }
      ],
      total: '19.99'
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      const result = await response.json();
      if (result.success) {
        alert(`✅ Local order saved!\n\nOrder ID: ${result.orderId}`);
      } else {
        alert('❌ Local order failed');
      }
    } catch (error) {
      alert('❌ Local order network error');
      console.error('Local test error:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      alert('❌ Failed to fetch orders');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">🧪 Test Order System</h1>

        {/* Google Sheets Status */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-2">📊 Google Sheets Integration Status</h2>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded text-sm font-medium ${
              googleSheetsStatus === 'success' ? 'bg-green-100 text-green-800' :
              googleSheetsStatus === 'error' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {googleSheetsStatus === 'success' ? '✅ Working' :
               googleSheetsStatus === 'error' ? '❌ Error' :
               '❓ Not Tested'}
            </span>
            {lastOrderTimestamp && (
              <span className="text-sm text-gray-600">Last Order: {lastOrderTimestamp}</span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Test Google Sheets */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">📊 Test Google Sheets</h2>
            <button
              onClick={testGoogleSheetsOrder}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mb-4"
            >
              � Save to Google Sheets
            </button>
            <p className="text-sm text-gray-600 mb-4">
              This will create a test order and save it to your Google Sheet
            </p>
          </div>

          {/* Test Local Storage */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">💾 Test Local Storage</h2>
            <button
              onClick={testLocalOrder}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 mb-4"
            >
              � Save Locally
            </button>
            <p className="text-sm text-gray-600 mb-4">
              This will create a test order and save it to local memory
            </p>
          </div>
        </div>

        {/* Fetch Orders */}
        <div className="bg-white p-6 rounded-lg shadow mt-8">
          <h2 className="text-xl font-semibold mb-4">📋 View Orders</h2>
          <button
            onClick={fetchOrders}
            className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 mb-4"
          >
            📋 Fetch Orders
          </button>
          <p className="text-sm text-gray-600 mb-4">
            This fetches orders from local storage (not Google Sheets)
          </p>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {orders.map((order: any) => (
              <div key={order.id} className="border border-gray-200 rounded p-3">
                <div className="flex justify-between">
                  <span className="font-medium">#{order.id}</span>
                  <span className="text-green-600">${order.total}</span>
                </div>
                <p className="text-sm text-gray-600">{order.customerInfo.name}</p>
                <p className="text-sm text-gray-600">{order.customerInfo.email}</p>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-gray-500 text-center py-4">No orders yet</p>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">📖 How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li><strong>Setup Google Sheets:</strong> Follow the setup guide in <code>GOOGLE_SHEETS_SETUP.md</code></li>
            <li><strong>Test Google Sheets:</strong> Click "Save to Google Sheets" to test the integration</li>
            <li><strong>Test Local:</strong> Click "Save Locally" to test fallback functionality</li>
            <li><strong>View Orders:</strong> Click "Fetch Orders" to see locally stored orders</li>
            <li><strong>Real Checkout:</strong> Use the actual cart checkout to test with real data</li>
            <li><strong>Admin Panel:</strong> Visit <code>/admin/orders</code> for full order management</li>
          </ol>
        </div>

        <div className="mt-8 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h2 className="text-xl font-semibold mb-4 text-yellow-800">⚠️ Important Notes</h2>
          <ul className="list-disc list-inside space-y-2 text-yellow-700">
            <li>Google Sheets integration requires proper setup (see <code>GOOGLE_SHEETS_SETUP.md</code>)</li>
            <li>If Google Sheets fails, the system falls back to local storage</li>
            <li>Check browser console for detailed error messages</li>
            <li>Environment variables must be configured for Google Sheets to work</li>
            <li>Test with the buttons above before using in production</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
