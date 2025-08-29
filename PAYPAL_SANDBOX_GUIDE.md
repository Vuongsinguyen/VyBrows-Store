# PayPal Sandbox Test Accounts Guide

## 🎯 Cách tạo và sử dụng tài khoản test PayPal Sandbox

### Bước 1: Truy cập PayPal Developer Dashboard

1. **Vào trang**: https://developer.paypal.com/
2. **Đăng nhập** bằng tài khoản PayPal thật của bạn
3. **Chọn "Sandbox"** ở góc trên bên phải

### Bước 2: Tạo tài khoản test

#### **Tài khoản Business (cho người bán):**
1. Trong Dashboard, chọn **"Testing Tools"** > **"Sandbox Accounts"**
2. Click **"Create Account"**
3. Chọn loại: **"Business"** (Merchant)
4. Điền thông tin:
   - **Country**: Vietnam
   - **Email**: Tự động tạo (vd: sb-xxxxx@business.example.com)
   - **Password**: Tự động tạo
5. Click **"Create"**

#### **Tài khoản Personal (cho người mua):**
1. Lặp lại bước trên nhưng chọn **"Personal"** (Buyer)
2. Sẽ tạo email dạng: sb-xxxxx@personal.example.com

### Bước 3: Lấy thông tin đăng nhập

Sau khi tạo, bạn sẽ thấy:
```
Business Account:
- Email: sb-xxxxx@business.example.com
- Password: abc12345 (hoặc tự động tạo)

Personal Account:
- Email: sb-xxxxx@personal.example.com
- Password: abc12345 (hoặc tự động tạo)
```

### Bước 4: Test thanh toán

#### **Trong ứng dụng của bạn:**
1. Thêm sản phẩm vào giỏ hàng
2. Chọn "PayPal Checkout"
3. Click nút PayPal → chuyển đến trang đăng nhập

#### **Đăng nhập tài khoản test:**
- **Email**: sb-xxxxx@personal.example.com
- **Password**: abc12345 (hoặc password đã tạo)

#### **Hoàn tất thanh toán:**
1. Chọn thẻ tín dụng test (nếu cần)
2. Click **"Pay Now"**
3. Thanh toán sẽ thành công (không tốn tiền thật)

## 💳 Thẻ tín dụng test có sẵn

PayPal cung cấp sẵn các thẻ test:

### **Thẻ thành công:**
- **Số thẻ**: 4111 1111 1111 1111
- **Ngày hết hạn**: Bất kỳ ngày trong tương lai
- **CVV**: 123
- **Tên**: Bất kỳ

### **Thẻ thất bại (test error handling):**
- **Số thẻ**: 4000 0000 0000 0002
- **Kết quả**: Transaction declined

## 🔧 Các loại test khác

### **Test lỗi mạng:**
- Sử dụng số thẻ: 4000 0000 0000 0119
- Kết quả: Network timeout

### **Test số dư không đủ:**
- Số thẻ: 4000 0000 0000 0002
- Kết quả: Insufficient funds

## 📱 Test trên mobile

1. **Mở ứng dụng trên mobile**
2. **Thêm sản phẩm vào giỏ**
3. **Chọn PayPal checkout**
4. **Sẽ mở trình duyệt hoặc app PayPal**
5. **Đăng nhập bằng tài khoản sandbox**

## ⚠️ Lưu ý quan trọng

### **Sandbox vs Production:**
- ✅ **Sandbox**: Không tốn tiền, an toàn để test
- ❌ **Production**: Tốn tiền thật, chỉ dùng khi ready

### **Credentials khác nhau:**
- **Sandbox**: AZDC... (bắt đầu bằng AZDC)
- **Production**: A... (bắt đầu bằng A, khác AZDC)

### **Không dùng tài khoản thật:**
- ❌ Đừng đăng nhập bằng tài khoản PayPal thật
- ✅ Chỉ dùng tài khoản sandbox để test

## 🎯 Flow test hoàn chỉnh

```
1. Tạo tài khoản sandbox buyer
2. Thêm sản phẩm vào giỏ hàng
3. Chọn PayPal checkout
4. Đăng nhập sb-xxxxx@personal.example.com
5. Chọn phương thức thanh toán
6. Click "Pay Now"
7. Thanh toán thành công
8. Quay lại website với thông báo thành công
9. Giỏ hàng được xóa tự động
```

## 🔍 Troubleshooting

### **Lỗi "Invalid credentials":**
- Kiểm tra email/password sandbox
- Đảm bảo đang dùng tài khoản Personal (buyer)

### **Lỗi "Card declined":**
- Dùng thẻ test: 4111 1111 1111 1111
- Hoặc tạo thẻ mới trong sandbox

### **Không thấy nút PayPal:**
- Kiểm tra NEXT_PUBLIC_PAYPAL_CLIENT_ID đã set
- Restart server: `npm run dev`

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Check browser console for errors
2. Verify sandbox credentials
3. Test với thẻ 4111 1111 1111 1111
4. Contact PayPal developer support

**Happy testing! 🎉**
