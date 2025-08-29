'use client';

import { Dialog, Transition } from '@headlessui/react';
import { ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useCart } from './cart-context';
import CheckoutForm, { CustomerInfo } from './checkout-form';
import { DeleteItemButton } from './delete-item-button';
import EditItemQuantityButton from './edit-item-quantity-button';
import OpenCart from './open-cart';

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  const { cart, updateCartItem, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const quantityRef = useRef(cart.totalQuantity);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => {
    setIsOpen(false);
    setShowCheckout(false);
  }, []);

  // Auto-open cart when quantity increases
  useEffect(() => {
    if (cart.totalQuantity > quantityRef.current && cart.totalQuantity > 0) {
      setIsOpen(true);
      setShowCheckout(false); // Reset to cart view when new items added
    }
    quantityRef.current = cart.totalQuantity;
  }, [cart.totalQuantity]);

  const handleCheckout = useCallback(() => {
    if (cart.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    setShowCheckout(true);
  }, [cart.items.length]);

  const handleOrderSubmit = useCallback(async (customerInfo: CustomerInfo) => {
    try {
      // Prepare order data for Google Sheets (simplified structure)
      const orderData = {
        customerInfo: {
          name: customerInfo.name,
          email: customerInfo.email
          // Only include name and email as required by the API
        },
        items: cart.items.map(item => ({
          title: item.merchandise?.title || 'Unknown Item',
          quantity: item.quantity,
          price: item.cost?.totalAmount?.amount || '0'
        })),
        total: cart.cost?.totalAmount?.amount || '0',
        timestamp: new Date().toISOString() // Add timestamp for Google Sheets
      };

      console.log('📤 Sending order to Google Sheets...', orderData);

      // Call Google Sheets API
      const response = await fetch('/api/save-order-to-sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (result.success) {
        // Success: Show confirmation with Google Sheets link
        const confirmationMessage = `🎉 Order Confirmed!\n\n` +
          `Customer: ${customerInfo.name}\n` +
          `Email: ${customerInfo.email}\n\n` +
          `✅ Order saved to Google Sheets!\n` +
          `📊 View in spreadsheet: ${result.spreadsheetUrl}\n\n` +
          `Thank you for your purchase!`;

        alert(confirmationMessage);

        // Clear cart after successful order
        clearCart();
        setIsOpen(false);
        setShowCheckout(false);

        console.log('✅ Order saved to Google Sheets:', result.timestamp);
        console.log('📊 Spreadsheet URL:', result.spreadsheetUrl);

      } else {
        // Handle API errors
        console.error('❌ Google Sheets API Error:', result.message);
        alert(`❌ Failed to save order: ${result.message}\n\nPlease try again or contact support.`);
      }
    } catch (error) {
      console.error('❌ Network/Processing Error:', error);

      // Fallback: Try to save locally if Google Sheets fails
      try {
        console.log('🔄 Attempting fallback to local storage...');

        const fallbackResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerInfo,
            items: cart.items.map(item => ({
              title: item.merchandise?.title || 'Unknown Item',
              quantity: item.quantity,
              price: item.cost?.totalAmount?.amount || '0'
            })),
            total: cart.cost?.totalAmount?.amount || '0'
          })
        });

        const fallbackResult = await fallbackResponse.json();

        if (fallbackResult.success) {
          alert(`⚠️ Google Sheets unavailable, but order saved locally!\n\nOrder ID: ${fallbackResult.orderId}\n\nPlease contact support to sync with Google Sheets.`);
          clearCart();
          setIsOpen(false);
          setShowCheckout(false);
        } else {
          throw new Error('Fallback also failed');
        }
      } catch (fallbackError) {
        console.error('❌ Fallback failed:', fallbackError);
        alert('❌ Unable to process order. Please check your connection and try again.');
      }
    }
  }, [cart, clearCart]);

  const handleBackToCart = useCallback(() => {
    setShowCheckout(false);
  }, []);

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cart.totalQuantity} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 p-6 text-black backdrop-blur-xl md:w-[390px] dark:border-neutral-700 dark:bg-black/80 dark:text-white">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">
                  {showCheckout ? 'Checkout' : 'My Cart'}
                </p>
                <button aria-label="Close cart" onClick={closeCart}>
                  <CloseCart />
                </button>
              </div>

              {!cart || !cart.items || cart.items.length === 0 ? (
                <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                  <ShoppingCartIcon className="h-16" />
                  <p className="mt-6 text-center text-2xl font-bold">
                    Your cart is empty.
                  </p>
                </div>
              ) : showCheckout ? (
                <CheckoutForm
                  cartItems={cart.items}
                  totalQuantity={cart.totalQuantity}
                  totalPrice={cart.cost?.totalAmount?.amount || '0'}
                  onSubmit={handleOrderSubmit}
                  onCancel={handleBackToCart}
                />
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden p-1">
                  <ul className="grow overflow-auto py-4">
                    {cart.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
                      >
                        <div className="relative flex w-full flex-row justify-between px-1 py-4">
                          <div className="absolute z-40 -ml-1 -mt-2">
                            <DeleteItemButton
                              item={item}
                              optimisticUpdate={updateCartItem}
                            />
                          </div>
                          <div className="flex flex-row">
                            {/* Product image placeholder */}
                            <div className="relative h-16 w-16 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                              {/* Product image would go here */}
                            </div>
                            <div className="ml-4 flex flex-col justify-center">
                              <p className="text-sm font-medium">
                                {item.merchandise?.title || 'Unknown Item'}
                              </p>
                              <p className="text-sm text-neutral-500">
                                ${item.cost?.totalAmount?.amount || '0'}
                              </p>
                            </div>
                          </div>
                          <div className="flex h-16 flex-col justify-between">
                            <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                              <EditItemQuantityButton
                                item={item}
                                type="minus"
                                optimisticUpdate={updateCartItem}
                              />
                              <p className="w-6 text-center">
                                <span className="w-full text-sm">
                                  {item.quantity}
                                </span>
                              </p>
                              <EditItemQuantityButton
                                item={item}
                                type="plus"
                                optimisticUpdate={updateCartItem}
                              />
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {/* Checkout button */}
                  <div className="border-t border-neutral-200 pt-4 dark:border-neutral-700">
                    <div className="mb-2 text-sm text-neutral-600 dark:text-neutral-400">
                      Total: ${cart.cost?.totalAmount?.amount || '0'} ({cart.totalQuantity} items)
                    </div>
                    <button
                      className="block w-full rounded-full bg-blue-600 p-3 text-center text-sm font-medium text-white opacity-90 hover:opacity-100"
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

function CloseCart({ className }: { className?: string }) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
      <XMarkIcon
        className={clsx(
          'h-6 transition-all ease-in-out hover:scale-110',
          className
        )}
      />
    </div>
  );
}
