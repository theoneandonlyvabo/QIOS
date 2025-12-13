# 🚀 Quick Start - QIOS Electron

## ✅ Setup Selesai!

Konfigurasi Electron sudah ditambahkan ke QIOS. Berikut yang sudah dikonfigurasi:

### 📦 Files Created

1. **`electron/main.js`** - Main Electron process
2. **`electron/preload.js`** - Secure preload script
3. **`ELECTRON_README.md`** - Dokumentasi lengkap

### ⚙️ Configuration Added

1. **`package.json`**
   - ✅ Main entry point: `electron/main.js`
   - ✅ Electron scripts
   - ✅ Build configuration
   - ✅ Dependencies: electron-builder, concurrently, wait-on

2. **`.gitignore`**
   - ✅ Electron build artifacts

---

## 🎯 How to Use

### 1. Install Dependencies (Sedang Berjalan)

```bash
npm install
```

### 2. Run Development Mode

**Option A: Web Browser**
```bash
npm run dev
```
Buka `http://localhost:3000`

**Option B: Desktop App** ⭐
```bash
npm run electron:dev
```

### 3. Build Desktop App

**Build untuk Windows:**
```bash
npm run electron:build:win
```

Output:
- `dist/QIOS Retail System Setup.exe` (Installer)
- `dist/QIOS Retail System.exe` (Portable)

---

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Web dev server |
| `npm run electron:dev` | Desktop app (dev mode) |
| `npm run electron:build` | Build for current OS |
| `npm run electron:build:win` | Build for Windows |
| `npm run electron:build:mac` | Build for macOS |
| `npm run electron:build:linux` | Build for Linux |

---

## 🎨 Next Steps (Optional)

### 1. Add App Icons

Create icons untuk setiap platform:

**Windows (icon.ico):**
- Size: 256x256
- Format: ICO
- Location: `public/icon.ico`

**macOS (icon.icns):**
- Size: 512x512 atau 1024x1024
- Format: ICNS
- Location: `public/icon.icns`
- Tool: [png2icons.com](https://png2icons.com/)

**Linux (icon.png):**
- Size: 512x512
- Format: PNG
- Location: `public/icon.png`

### 2. Customize Window

Edit `electron/main.js`:

```javascript
const mainWindow = new BrowserWindow({
  width: 1400,      // Change window width
  height: 900,      // Change window height
  title: 'Your App Name',
  // ... other settings
});
```

### 3. Test Desktop App

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run Electron (after server ready)
npm run electron
```

---

## ⚠️ Important Notes

1. **Development Mode:**
   - Electron loads from `http://localhost:3000`
   - DevTools auto-open
   - Hot reload enabled

2. **Production Build:**
   - Electron loads from built Next.js files
   - No DevTools
   - Optimized for performance

3. **Database:**
   - Make sure database is accessible
   - Connection string in `.env`

4. **Security:**
   - Node integration disabled
   - Context isolation enabled
   - Secure by default

---

## 🐛 Troubleshooting

### Window tidak muncul?

1. Check if dev server running: `http://localhost:3000`
2. Check console for errors
3. Try manual run:
   ```bash
   npm run dev  # Terminal 1
   npm run electron  # Terminal 2 (wait for server)
   ```

### Build gagal?

```bash
# Clear and rebuild
rm -rf dist node_modules
npm install
npm run electron:build
```

---

## 📚 Full Documentation

Lihat [ELECTRON_README.md](./ELECTRON_README.md) untuk dokumentasi lengkap.

---

**Status:** ✅ Ready to use!  
**Next:** Run `npm run electron:dev` untuk test desktop app
