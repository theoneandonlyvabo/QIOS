const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
    // Example: Send message to main process
    send: (channel, data) => {
        // Whitelist channels
        const validChannels = ['toMain'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },

    // Example: Receive message from main process
    receive: (channel, func) => {
        const validChannels = ['fromMain'];
        if (validChannels.includes(channel)) {
            // Deliberately strip event as it includes `sender`
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    },

    // Get app version
    getVersion: () => {
        return process.env.npm_package_version || '1.0.0';
    },

    // Check if running in Electron
    isElectron: () => {
        return true;
    },

    // Get platform
    getPlatform: () => {
        return process.platform;
    }
});

// Expose Node.js process info (read-only)
contextBridge.exposeInMainWorld('process', {
    platform: process.platform,
    versions: {
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron
    }
});
