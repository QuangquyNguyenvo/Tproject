const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    runCode: (code) => ipcRenderer.invoke('run-code', code)
});
