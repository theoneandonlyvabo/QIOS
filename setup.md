# QIOS Setup Guide

## 🚀 Quick Start

### 1. Install Node.js
Download dan install Node.js dari [nodejs.org](https://nodejs.org/) (versi 18 atau lebih baru)

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
```bash
# Copy environment file
cp env.example .env.local

# Edit .env.local dengan konfigurasi Anda
```

### 4. Start Development Server
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 📁 Project Structure

```
qios-retail-system/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── Dashboard.tsx     # Main dashboard
│   ├── CalendarDashboard.tsx # Calendar features
│   ├── AICompanion.tsx   # AI insights
│   ├── TeamManagement.tsx # Team management
│   ├── NotificationCenter.tsx # Notifications
│   ├── CustomerAnalytics.tsx # Customer analytics
│   ├── TransactionManagement.tsx # Transaction system
│   └── ...               # Other components
├── lib/                   # Utility libraries
│   ├── payment-gateways/  # Payment integrations
│   └── ai/               # AI analytics engine
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind config
├── tsconfig.json          # TypeScript config
└── README.md             # Setup guide
```

## 🎯 Features Available

### ✅ Implemented Features
- ✅ **Calendar Dashboard** - Tanggal penting dan deadline
- ✅ **AI Companion** - Business insights dan recommendations
- ✅ **Team Management** - Role-based access control
- ✅ **Notification Center** - Comprehensive notifications
- ✅ **Customer Analytics** - Customer segmentation dan analytics
- ✅ **Transaction Management** - Multi-payment gateway
- ✅ **Sales Analytics** - Real-time metrics dan reporting
- ✅ **Inventory Management** - Stock tracking dan alerts

### 🔧 Technical Features
- ✅ **Multi-Payment Gateway** - Midtrans, Xendit, Bank APIs, E-wallet
- ✅ **AI Analytics** - OpenAI GPT-4 powered insights
- ✅ **Real-time Dashboard** - Live metrics dan updates
- ✅ **Responsive Design** - Desktop-first, tablet-friendly
- ✅ **TypeScript** - Full type safety
- ✅ **Modern UI/UX** - Clean dan intuitive interface

## 🚨 Troubleshooting

### Common Issues

1. **Node.js not found**
   - Install Node.js dari [nodejs.org](https://nodejs.org/)
   - Restart terminal setelah instalasi

2. **npm not found**
   - Node.js sudah include npm
   - Restart terminal setelah instalasi Node.js

3. **Dependencies error**
   ```bash
   # Clear cache dan reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **TypeScript errors**
   - Pastikan semua dependencies terinstall
   - Restart TypeScript server di VS Code

5. **Tailwind CSS not working**
   - Pastikan file `tailwind.config.js` ada
   - Restart development server

### Development Tips

1. **Hot Reload** - File changes akan otomatis reload
2. **TypeScript** - Gunakan TypeScript untuk better development experience
3. **Tailwind CSS** - Gunakan utility classes untuk styling
4. **Components** - Semua komponen sudah modular dan reusable

## 📞 Support

Jika ada masalah atau pertanyaan:
1. Cek error di terminal
2. Pastikan semua dependencies terinstall
3. Restart development server
4. Cek file configuration (tsconfig.json, tailwind.config.js)

## 🎉 Ready to Use!

Setelah setup selesai, Anda bisa:
- Mengakses dashboard di `http://localhost:3000`
- Menggunakan semua fitur QIOS
- Mengembangkan fitur tambahan
- Deploy ke production
