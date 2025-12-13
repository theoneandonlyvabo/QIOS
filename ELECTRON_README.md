# 🖥️ QIOS Electron Desktop App

QIOS Retail System sebagai aplikasi desktop menggunakan Electron.

## 📋 Prerequisites

- Node.js 18+ 
- npm atau yarn
- Dependencies sudah terinstall (`npm install`)

## 🚀 Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Run in Development Mode

**Option A: Web Only**
```bash
npm run dev
```
Buka browser di `http://localhost:3000`

**Option B: Electron Desktop App**
```bash
npm run electron:dev
```
Ini akan:
1. Start Next.js dev server
2. Wait sampai server ready
3. Launch Electron window

## 📦 Building

### Build untuk Platform Saat Ini

```bash
npm run electron:build
```

### Build untuk Platform Spesifik

**Windows:**
```bash
npm run electron:build:win
```
Output: `dist/QIOS Retail System Setup.exe` dan `dist/QIOS Retail System.exe` (portable)

**macOS:**
```bash
npm run electron:build:mac
```
Output: `dist/QIOS Retail System.dmg` dan `dist/QIOS Retail System-mac.zip`

**Linux:**
```bash
npm run electron:build:linux
```
Output: `dist/QIOS Retail System.AppImage` dan `dist/qios-retail-system.deb`

## 📁 Struktur Electron

```
QIOS/
├── electron/
│   ├── main.js       # Main process (window management)
│   └── preload.js    # Preload script (secure bridge)
├── public/
│   ├── icon.png      # Linux icon
│   ├── icon.ico      # Windows icon
│   └── icon.icns     # macOS icon
└── package.json      # Electron configuration
```

## ⚙️ Konfigurasi

### Window Settings

Edit `electron/main.js`:

```javascript
const mainWindow = new BrowserWindow({
  width: 1400,        // Lebar window
  height: 900,        // Tinggi window
  minWidth: 1024,     // Minimum width
  minHeight: 768,     // Minimum height
  // ... other settings
});
```

### Build Settings

Edit `package.json` di bagian `build`:

```json
{
  "build": {
    "appId": "com.qios.retail",
    "productName": "QIOS Retail System",
    "win": {
      "target": ["nsis", "portable"]
    }
  }
}
```

## 🎨 Icons

Untuk build production, Anda perlu icon untuk setiap platform:

### Windows (icon.ico)
- Format: ICO
- Sizes: 16x16, 32x32, 48x48, 256x256
- Location: `public/icon.ico`

### macOS (icon.icns)
- Format: ICNS
- Sizes: Multiple (16x16 to 1024x1024)
- Location: `public/icon.icns`
- Tool: [png2icons.com](https://png2icons.com/)

### Linux (icon.png)
- Format: PNG
- Size: 512x512 atau 1024x1024
- Location: `public/icon.png`

## 🔒 Security Features

Electron app sudah dikonfigurasi dengan security best practices:

- ✅ `nodeIntegration: false` - Disable Node.js di renderer
- ✅ `contextIsolation: true` - Isolate context
- ✅ `enableRemoteModule: false` - Disable remote module
- ✅ Preload script untuk secure communication
- ✅ CSP (Content Security Policy)
- ✅ Navigation protection
- ✅ External link handling

## 🐛 Troubleshooting

### Electron window tidak muncul

**Problem:** Window tidak muncul setelah run `electron:dev`

**Solution:**
1. Pastikan Next.js dev server sudah running di port 3000
2. Check console untuk error messages
3. Coba run manual:
   ```bash
   # Terminal 1
   npm run dev
   
   # Terminal 2 (tunggu sampai server ready)
   npm run electron
   ```

### Build gagal

**Problem:** `electron-builder` error saat build

**Solution:**
1. Pastikan semua dependencies terinstall:
   ```bash
   npm install
   ```
2. Clear cache:
   ```bash
   npm run build
   rm -rf dist
   npm run electron:build
   ```

### Icon tidak muncul

**Problem:** App icon tidak muncul di taskbar/dock

**Solution:**
1. Pastikan icon files ada di `public/` folder
2. Format dan size harus sesuai (lihat bagian Icons)
3. Rebuild app setelah menambah icon

### DevTools tidak muncul

**Problem:** DevTools tidak auto-open di development

**Solution:**
Edit `electron/main.js`:
```javascript
if (isDev) {
  mainWindow.webContents.openDevTools();
}
```

## 📝 Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build Next.js production |
| `npm run start` | Start Next.js production server |
| `npm run electron` | Run Electron (requires dev server) |
| `npm run electron:dev` | Run Electron + Next.js dev |
| `npm run electron:build` | Build for current platform |
| `npm run electron:build:win` | Build for Windows |
| `npm run electron:build:mac` | Build for macOS |
| `npm run electron:build:linux` | Build for Linux |

## 🎯 Next Steps

1. **Add Icons**
   - Create icon files untuk setiap platform
   - Place di `public/` folder

2. **Customize Window**
   - Edit window size, title, dll di `electron/main.js`

3. **Add Features**
   - Auto-updater
   - System tray
   - Notifications
   - Custom protocols

4. **Test Build**
   - Build untuk platform target
   - Test installer
   - Test app functionality

## 📚 Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [electron-builder](https://www.electron.build/)
- [Next.js with Electron](https://github.com/vercel/next.js/tree/canary/examples/with-electron)
- [Electron Security](https://www.electronjs.org/docs/latest/tutorial/security)

## ⚠️ Important Notes

- **Development:** Electron akan load dari `http://localhost:3000`
- **Production:** Electron akan load dari built Next.js files
- **Database:** Pastikan database connection bisa diakses dari Electron
- **API:** API routes Next.js akan tetap berfungsi di Electron

---

**Last Updated:** 2025-12-04  
**Electron Version:** 39.2.5  
**Next.js Version:** 14.0.0
