'use client';

import { useState } from 'react';

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface CheckoutFormProps {
  cartItems: Array<{
    merchandise?: { title?: string };
    quantity: number;
    cost?: { totalAmount?: { amount?: string } };
  }>;
  totalQuantity: number;
  totalPrice: string;
  onSubmit: (customerInfo: CustomerInfo) => void;
  onCancel: () => void;
}

export default function CheckoutForm({
  cartItems,
  totalQuantity,
  totalPrice,
  onSubmit,
  onCancel
}: CheckoutFormProps) {
  const [formData, setFormData] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Checkout</h2>
        <button
          onClick={onCancel}
          className="text-neutral-500 hover:text-neutral-700"
        >
          ← Back to Cart
        </button>
      </div>

      {/* Order Summary */}
      <div className="mb-6 p-4 bg-neutral-50 rounded-lg dark:bg-neutral-800">
        <h3 className="font-medium mb-2">Order Summary</h3>
        <div className="space-y-1 text-sm">
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>{item.merchandise?.title || 'Unknown Item'} (x{item.quantity})</span>
              <span>${item.cost?.totalAmount?.amount || '0'}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2 flex justify-between font-medium">
            <span>Total ({totalQuantity} items)</span>
            <span>${totalPrice}</span>
          </div>
        </div>
      </div>

      {/* Customer Information Form */}
      <form onSubmit={handleSubmit} className="flex-1 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-neutral-300'
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-neutral-300'
            }`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? 'border-red-500' : 'border-neutral-300'
            }`}
            placeholder="Enter your phone number"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1">
            Shipping Address *
          </label>
          <textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.address ? 'border-red-500' : 'border-neutral-300'
            }`}
            placeholder="Enter your shipping address"
          />
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">{errors.address}</p>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            Complete Order - ${totalPrice}
          </button>
        </div>
      </form>
    </div>
  );
}
