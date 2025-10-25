# QIOS - Quality Integrated Omni System

QIOS (Quality Integrated Omni System) adalah SaaS yang diposisikan sebagai companion strategis bagi UMKM dan SMB untuk mengorkestrasi workflow bisnis secara utuh, mulai dari transaksi kasir hingga pembayaran kewajiban rutin seperti PLN, PDAM, dan supplier, sekaligus pemantauan stok serta tren pasar dari waktu ke waktu.

## 🚀 Features

### 💳 Multi-Payment Gateway Integration
- **Midtrans**: Bank transfer, GoPay, ShopeePay, DANA, OVO, LinkAja
- **Xendit**: Virtual Account, QRIS, E-wallet payments
- **Bank APIs**: BCA, Mandiri virtual accounts
- **E-wallet APIs**: DANA, OVO, LinkAja, GoPay
- **Utility APIs**: PLN, PDAM bill payments

### 🤖 AI-Powered Analytics
- Business insights and recommendations
- Cashflow analysis and optimization
- Inventory management with stock alerts
- Customer behavior analysis
- Trend prediction and anomaly detection

### 📊 Comprehensive Dashboard
- Real-time business metrics
- Sales analytics and reporting
- Customer order management
- User activity tracking
- Financial overview

### 🏪 Retail Management
- Point of Sale (POS) system
- Inventory tracking
- Customer management
- Sales reporting
- Expense tracking

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **AI**: OpenAI GPT-4
- **Payment Gateways**: Midtrans, Xendit, Bank APIs
- **Database**: PostgreSQL (with Prisma)

## 📦 Quick Setup

### Prerequisites
- Node.js 18+ (Download dari [nodejs.org](https://nodejs.org/))
- npm (sudah include dengan Node.js)

### Installation

#### Windows
1. **Double-click `install.bat`** atau jalankan di Command Prompt:
```cmd
install.bat
```

2. **Start aplikasi** dengan double-click `start.bat` atau:
```cmd
start.bat
```

#### Linux/Mac
1. **Jalankan install script**:
```bash
chmod +x install.sh
./install.sh
```

2. **Start aplikasi**:
```bash
chmod +x start.sh
./start.sh
```

#### Manual Installation
```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env.local

# Start development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 🎯 Features Implemented

### ✅ Core Features
- ✅ Calendar Dashboard dengan tanggal penting
- ✅ AI Companion dengan business insights
- ✅ Team Management dengan role-based access
- ✅ Notification Center yang komprehensif
- ✅ Customer Analytics dan segmentation
- ✅ Transaction Management dengan multi-payment
- ✅ Inventory Management
- ✅ Sales Analytics dan reporting

### ✅ Technical Features
- ✅ Multi-payment gateway integration
- ✅ AI-powered analytics
- ✅ Real-time dashboard
- ✅ Responsive design
- ✅ TypeScript support
- ✅ Modern UI/UX

## 🔧 Configuration

### Payment Gateway Setup

#### Midtrans
1. Daftar di [Midtrans](https://midtrans.com)
2. Dapatkan Server Key dan Client Key
3. Set `MIDTRANS_SERVER_KEY` dan `MIDTRANS_CLIENT_KEY` di `.env.local`

#### Xendit
1. Daftar di [Xendit](https://xendit.co)
2. Dapatkan Secret Key dan Public Key
3. Set `XENDIT_SECRET_KEY` dan `XENDIT_PUBLIC_KEY` di `.env.local`

#### Bank APIs
- **BCA**: Hubungi BCA untuk API access
- **Mandiri**: Hubungi Bank Mandiri untuk API access

#### E-wallet APIs
- **DANA**: Hubungi DANA untuk API access
- **OVO**: Hubungi OVO untuk API access
- **LinkAja**: Hubungi LinkAja untuk API access
- **GoPay**: Hubungi GoPay untuk API access

#### Utility APIs
- **PLN**: Hubungi PLN untuk API access
- **PDAM**: Hubungi PDAM untuk API access

### AI Analytics Setup
1. Daftar di [OpenAI](https://openai.com)
2. Dapatkan API key
3. Set `OPENAI_API_KEY` di `.env.local`

## 📱 Usage

### Dashboard
- Akses dashboard utama untuk melihat overview bisnis
- Monitor metrics real-time seperti orders, revenue, dan customer activity
- Lihat grafik penjualan dan tren bisnis

### Payment Processing
1. Pilih payment gateway yang tersedia
2. Pilih metode pembayaran (bank transfer, e-wallet, dll)
3. Input detail customer dan items
4. Generate payment link atau virtual account
5. Monitor status pembayaran

### AI Analytics
1. Klik "Generate Analysis" untuk mendapatkan insights
2. Lihat business insights, cashflow analysis, dan inventory recommendations
3. Implementasikan rekomendasi untuk optimasi bisnis

### Inventory Management
- Monitor stock levels
- Dapatkan alerts untuk low stock items
- Optimasi inventory berdasarkan AI recommendations

## 🏗️ Architecture

```
qios-retail-system/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── payment/       # Payment gateway APIs
│   │   └── analytics/     # AI analytics APIs
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── Dashboard.tsx      # Main dashboard
│   ├── Sidebar.tsx        # Navigation sidebar
│   ├── Header.tsx         # Top header
│   ├── PaymentModal.tsx   # Payment interface
│   └── AIAnalytics.tsx   # AI analytics component
├── lib/                   # Utility libraries
│   ├── payment-gateways/  # Payment gateway integrations
│   └── ai/               # AI analytics engine
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── store/                # State management
```

## 🔌 API Endpoints

### Payment APIs
- `POST /api/payment/create` - Create payment
- `POST /api/payment/verify` - Verify payment status
- `GET /api/payment/gateways` - Get available gateways

### Analytics APIs
- `POST /api/analytics/insights` - Generate business insights
- `POST /api/analytics/cashflow` - Cashflow analysis
- `POST /api/analytics/inventory` - Inventory insights

## 🚀 Deployment

### Vercel (Recommended)
1. Push code ke GitHub
2. Connect repository ke Vercel
3. Set environment variables di Vercel dashboard
4. Deploy otomatis

### Docker
```bash
# Build image
docker build -t qios-retail-system .

# Run container
docker run -p 3000:3000 --env-file .env qios-retail-system
```

### Manual Deployment
1. Build aplikasi: `npm run build`
2. Start production server: `npm start`
3. Setup reverse proxy (nginx/apache)
4. Configure SSL certificate

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](https://github.com/your-username/qios-retail-system/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/qios-retail-system/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/qios-retail-system/discussions)
- **Email**: support@qios.com

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Multi-payment gateway integration
- ✅ AI-powered analytics
- ✅ Dashboard interface
- ✅ Basic inventory management

### Phase 2 (Q2 2024)
- 🔄 Advanced reporting
- 🔄 Mobile app
- 🔄 Multi-tenant support
- 🔄 API marketplace

### Phase 3 (Q3 2024)
- 🔄 Machine learning predictions
- 🔄 Advanced integrations
- 🔄 White-label solutions
- 🔄 Enterprise features

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [Midtrans](https://midtrans.com) - Payment gateway
- [Xendit](https://xendit.co) - Payment infrastructure
- [OpenAI](https://openai.com) - AI analytics
- [Lucide](https://lucide.dev) - Icon library

---

**QIOS Team** - Building the future of retail management for UMKM and SMBs 🚀