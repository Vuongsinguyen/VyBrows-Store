import { NextApiRequest, NextApiResponse } from 'next';

interface OrderData {
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

// Mock database - thay bằng database thực tế
let orders: OrderData[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { customerInfo, items, total } = req.body;

      const newOrder: OrderData = {
        id: `ORD-${Date.now()}`,
        customerInfo,
        items,
        total,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      orders.push(newOrder);

      // Gửi email confirmation (có thể tích hợp SendGrid, Mailgun, etc.)
      console.log('📧 Sending confirmation email to:', customerInfo.email);

      res.status(200).json({
        success: true,
        orderId: newOrder.id,
        message: 'Order created successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create order'
      });
    }
  } else if (req.method === 'GET') {
    // API để xem tất cả orders (cho admin)
    res.status(200).json({
      success: true,
      orders: orders.slice(-10) // Lấy 10 đơn hàng gần nhất
    });
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).json({ message: 'Method not allowed' });
  }
}
