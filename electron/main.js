const { app, BrowserWindow, Menu } = require('electron');
const prepareNext = require('electron-next');
const { join } = require('path');

const isDev = process.env.NODE_ENV !== 'production';

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1024,
        minHeight: 768,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: join(__dirname, 'preload.js')
        },
        icon: join(__dirname, '../public/icon.png'),
        title: 'QIOS',
        backgroundColor: '#ffffff',
        show: false, // Don't show until ready
    });

    // Load the app - electron-next handles the URL
    const url = isDev
        ? 'http://localhost:3000'
        : 'http://localhost:8000';

    mainWindow.loadURL(url);

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
    });

    // Open DevTools in development
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    // Handle window close
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Create application menu
    createMenu();
}

function createMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: () => {
                        if (mainWindow) mainWindow.reload();
                    }
                },
                { type: 'separator' },
                {
                    label: 'Exit',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'selectAll' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                { type: 'separator' },
                { role: 'close' }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About QIOS',
                    click: () => {
                        const { dialog } = require('electron');
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'About QIOS',
                            message: 'QIOS Retail System',
                            detail: 'Version 1.0.0\\nQuality Integrated Omni System\\n\\nA comprehensive retail management system with payment gateway integration.',
                            buttons: ['OK']
                        });
                    }
                },
                {
                    label: 'Documentation',
                    click: async () => {
                        const { shell } = require('electron');
                        await shell.openExternal('https://github.com/theoneandonlyvabo/QIOS');
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// App event handlers
app.on('ready', async () => {
    // Prepare Next.js server
    await prepareNext('./');

    createWindow();

    app.on('activate', () => {
        // On macOS, re-create window when dock icon is clicked
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
    // On macOS, apps stay active until user quits explicitly
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Handle app quit
app.on('before-quit', () => {
    // Cleanup tasks here if needed
    console.log('QIOS is shutting down...');
});

// Security: Prevent navigation to external URLs
app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);

        // Allow navigation to localhost in development
        if (isDev && parsedUrl.hostname === 'localhost') {
            return;
        }

        // Prevent navigation to external URLs
        if (parsedUrl.origin !== 'file://') {
            event.preventDefault();
            console.warn('Navigation to external URL prevented:', navigationUrl);
        }
    });

    // Prevent opening new windows
    contents.setWindowOpenHandler(({ url }) => {
        // Open external links in default browser
        const { shell } = require('electron');
        shell.openExternal(url);
        return { action: 'deny' };
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Optionally show error dialog
    const { dialog } = require('electron');
    dialog.showErrorBox('An error occurred', error.message);
});
