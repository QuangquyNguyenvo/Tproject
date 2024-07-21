const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: true,
            webSecurity: false
        }
    });

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        const responseHeaders = Object.assign({}, details.responseHeaders);
        responseHeaders['Content-Security-Policy'] = [
            "default-src 'self';",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com;",
            "style-src 'self' 'unsafe-inline' https://unpkg.com;",
            "img-src 'self' data:;"
        ].join(' ');

        callback({ responseHeaders });
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    mainWindow.setMenuBarVisibility(false);
    mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.handle('run-code', async (event, code) => {
    return new Promise((resolve, reject) => {
        exec('g++ -o temp_program temp_program.cpp && ./temp_program', (error, stdout, stderr) => {
            if (error) {
                reject(stderr);
                return;
            }
            resolve(stdout);
        });
    });
});