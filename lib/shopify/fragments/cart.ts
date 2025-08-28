import product from './product';

const cart = {
  id: 'cart-1',
  checkoutUrl: '/checkout',
  cost: {
    subtotalAmount: { amount: '200000', currencyCode: 'VND' },
    totalAmount: { amount: '200000', currencyCode: 'VND' },
    totalTaxAmount: { amount: '0', currencyCode: 'VND' }
  },
  lines: {
    edges: [
      {
        node: {
          id: 'line-1',
          quantity: 1,
          cost: {
            totalAmount: { amount: '200000', currencyCode: 'VND' }
          },
          merchandise: {
            id: 'v1',
            title: 'Đỏ',
            selectedOptions: [{ name: 'Màu sắc', value: 'Đỏ' }],
            product
          }
        }
      }
    ]
  },
  totalQuantity: 1
};

export default cart;
