# QIOS Troubleshooting Guide

## 🚨 Common Issues & Solutions

### 1. Node.js Not Found
**Error**: `'node' is not recognized as the name of a cmdlet`

**Solution**:
1. Download dan install Node.js dari [nodejs.org](https://nodejs.org/)
2. Restart Command Prompt/PowerShell
3. Verify dengan `node --version`

### 2. npm Not Found
**Error**: `'npm' is not recognized as the name of a cmdlet`

**Solution**:
1. Node.js sudah include npm
2. Restart terminal setelah install Node.js
3. Verify dengan `npm --version`

### 3. Dependencies Installation Failed
**Error**: `npm install` gagal

**Solutions**:
```bash
# Clear cache dan reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Atau**:
```bash
# Install dengan verbose untuk debug
npm install --verbose
```

### 4. TypeScript Errors
**Error**: TypeScript compilation errors

**Solutions**:
1. Pastikan semua dependencies terinstall
2. Restart TypeScript server di VS Code (Ctrl+Shift+P → "TypeScript: Restart TS Server")
3. Cek file `tsconfig.json` sudah benar

### 5. Tailwind CSS Not Working
**Error**: Styling tidak muncul

**Solutions**:
1. Pastikan file `tailwind.config.js` ada
2. Restart development server
3. Cek import di `app/globals.css`

### 6. Port Already in Use
**Error**: `Port 3000 is already in use`

**Solutions**:
```bash
# Kill process di port 3000
npx kill-port 3000

# Atau gunakan port lain
npm run dev -- -p 3001
```

### 7. Module Not Found
**Error**: `Cannot find module 'react'`

**Solutions**:
1. Pastikan `node_modules` folder ada
2. Jalankan `npm install` lagi
3. Cek file `package.json` dependencies

### 8. Build Errors
**Error**: Build gagal

**Solutions**:
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

## 🔧 Development Tips

### 1. Hot Reload Issues
- Restart development server
- Clear browser cache
- Cek file syntax errors

### 2. Performance Issues
- Gunakan `npm run build` untuk production
- Optimize images
- Cek bundle size dengan `npm run build`

### 3. Debug Mode
```bash
# Run dengan debug mode
DEBUG=* npm run dev

# Atau dengan verbose
npm run dev -- --verbose
```

## 📞 Getting Help

### 1. Check Logs
```bash
# Development server logs
npm run dev

# Build logs
npm run build

# TypeScript check
npm run type-check
```

### 2. Common Commands
```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run type-check

# Lint code
npm run lint
```

### 3. File Structure Check
Pastikan struktur file sudah benar:
```
qios-retail-system/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Dashboard.tsx
│   ├── CalendarDashboard.tsx
│   └── ... (other components)
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

### 4. Environment Setup
1. Copy `env.example` ke `.env.local`
2. Edit `.env.local` dengan konfigurasi Anda
3. Restart development server

## 🎯 Quick Fixes

### Reset Everything
```bash
# Remove all generated files
rm -rf node_modules .next package-lock.json

# Reinstall
npm install

# Start fresh
npm run dev
```

### Update Dependencies
```bash
# Update all dependencies
npm update

# Update specific package
npm install package-name@latest
```

### Clear Cache
```bash
# Clear npm cache
npm cache clean --force

# Clear Next.js cache
rm -rf .next

# Clear browser cache (Ctrl+Shift+R)
```

## ✅ Verification Checklist

- [ ] Node.js installed (`node --version`)
- [ ] npm available (`npm --version`)
- [ ] Dependencies installed (`npm install`)
- [ ] Environment file exists (`.env.local`)
- [ ] Development server running (`npm run dev`)
- [ ] Browser opens `http://localhost:3000`
- [ ] No console errors
- [ ] All components loading

## 🚀 Still Having Issues?

1. **Check Node.js version** - Pastikan versi 18 atau lebih baru
2. **Restart everything** - Terminal, VS Code, browser
3. **Clear all cache** - npm, Next.js, browser
4. **Reinstall dependencies** - Hapus node_modules dan install ulang
5. **Check file permissions** - Pastikan bisa read/write file

Jika masih ada masalah, cek:
- Internet connection
- Firewall settings
- Antivirus interference
- Disk space available
