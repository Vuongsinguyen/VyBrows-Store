# PayPal Sandbox Setup Guide

## 🎯 Hướng dẫn setup PayPal Sandbox cho VyBrows Store

### Bước 1: Tạo tài khoản PayPal Developer

1. **Truy cập**: https://developer.paypal.com/
2. **Đăng nhập** bằng tài khoản PayPal thật của bạn
3. **Chọn "Sandbox"** tab ở góc trên bên phải

### Bước 2: Tạo Sandbox Accounts

#### **Tạo Business Account (Merchant):**
1. Click **"Testing Tools"** > **"Sandbox Accounts"**
2. Click **"Create Account"**
3. Chọn:
   - **Account Type**: Business
   - **Country**: Vietnam
   - **Email**: Tự động tạo (vd: `sb-xxxxx@business.example.com`)
4. Click **"Create"**

#### **Tạo Personal Account (Buyer):**
1. Lặp lại bước trên
2. Chọn **Account Type**: Personal
3. Email sẽ có dạng: `sb-xxxxx@personal.example.com`

### Bước 3: Lấy API Credentials

1. **Vào "Apps & Credentials"**
2. **Chọn "Sandbox"** tab
3. **Tìm app mặc định** hoặc tạo app mới
4. **Copy:**
   - **Client ID**: Bắt đầu bằng `AZDC...`
   - **Secret**: Chuỗi dài

### Bước 4: Cấu hình Environment Variables

Tạo file `.env.local` trong project:

```bash
# PayPal Sandbox Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AdF-NeXOrt58Ik-o8hWSxCv3bZqq2WchoFrrM_iKY2XxJoO_2AvvdRtywA1QnExBW17G5BjMGTJaD_-l
PAYPAL_CLIENT_SECRET=ECqeogQXxMCfohOT1uBhuHutZ1MpAh9EYUzO9MzxKlRHEbkdYSoK1Y1ZZkNAZD95EGaQtaCHodge3PfD
PAYPAL_ENVIRONMENT=sandbox
NEXT_PUBLIC_SITE_URL=shop.vybrows-acadmy.com
```

### Bước 5: Test thanh toán

#### **Flow test:**
1. **Start server**: `npm run dev`
2. **Thêm sản phẩm** vào giỏ hàng
3. **Click PayPal button**
4. **Đăng nhập** bằng tài khoản sandbox:
   - Email: `sb-xxxxx@personal.example.com`
   - Password: `abc12345`
5. **Chọn thẻ test**: `4111111111111111`
6. **Complete payment**

## 💳 Test Cards

| Card Type | Number | Expiration | CVV | Result |
|-----------|--------|------------|-----|---------|
| Visa | `4111111111111111` | Any future | `123` | ✅ Success |
| Visa | `4000000000000002` | Any future | `123` | ❌ Declined |
| MasterCard | `5555555555554444` | Any future | `123` | ✅ Success |

## 🔧 Troubleshooting

### **Lỗi thường gặp:**

#### **"PayPal client ID not configured"**
```bash
# Kiểm tra .env.local
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AZDC... (phải có)
```

#### **"Failed to create PayPal order"**
```bash
# Kiểm tra server-side credentials
PAYPAL_CLIENT_SECRET=ECqeogQXxMCfohOT1uBhuHutZ1MpAh9EYUzO9MzxKlRHEbkdYSoK1Y1ZZkNAZD95EGaQtaCHodge3PfD
PAYPAL_ENVIRONMENT=sandbox
```

#### **"Invalid credentials" khi login**
- Dùng email sandbox: `sb-xxxxx@personal.example.com`
- Password mặc định: `abc12345`

### **Debug steps:**
1. **Check browser console** cho errors
2. **Verify credentials** trong PayPal Developer Dashboard
3. **Test với thẻ**: `4111111111111111`
4. **Restart dev server** sau khi thay đổi .env

## 📊 Monitoring Transactions

1. **Vào PayPal Developer Dashboard**
2. **Sandbox** > **Testing Tools** > **Transaction Logs**
3. Xem chi tiết payments và errors

## 🚀 Production Deployment

**Chỉ chuyển production khi:**
- ✅ Đã test đầy đủ sandbox
- ✅ Có production credentials
- ✅ Ready nhận tiền thật

**Production config:**
```bash
PAYPAL_ENVIRONMENT=production
NEXT_PUBLIC_PAYPAL_CLIENT_ID=A...production_client_id
PAYPAL_CLIENT_SECRET=ECqeogQXxMCfohOT1uBhuHutZ1MpAh9EYUzO9MzxKlRHEbkdYSoK1Y1ZZkNAZD95EGaQtaCHodge3PfD
```

## 📞 Support

Nếu gặp vấn đề:
1. Check **browser console** cho error messages
2. Verify **sandbox credentials** đã đúng
3. Test với **thẻ mặc định**: `4111111111111111`
4. Contact PayPal developer support

**Happy testing! 🎉**
