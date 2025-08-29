'use client';

import { useEffect, useState } from 'react';

interface Order {
  id: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: Array<{
    title: string;
    quantity: number;
    price: string;
  }>;
  total: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  createdAt: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    // In a real app, you'd have an API endpoint for this
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">📋 Order Management</h1>
            <p className="text-gray-600 mt-1">View and manage customer orders</p>
          </div>

          <div className="p-6">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'paid' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                        <p className="text-lg font-bold mt-1">${order.total}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium mb-2">👤 Customer Info</h4>
                        <p><strong>Name:</strong> {order.customerInfo.name}</p>
                        <p><strong>Email:</strong> {order.customerInfo.email}</p>
                        <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
                        <p><strong>Address:</strong> {order.customerInfo.address}</p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">📦 Order Items</h4>
                        {order.items.map((item, index) => (
                          <p key={index}>
                            {item.title} x{item.quantity} - ${item.price}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => updateOrderStatus(order.id, 'paid')}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Mark as Paid
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'shipped')}
                        className="px-3 py-1 bg-#003324 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Mark as Shipped
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                      >
                        Mark as Delivered
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
