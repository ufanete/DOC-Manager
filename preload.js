const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    organisation: () => ipcRenderer.invoke('organisation'),
    selectedPage: () => ipcRenderer.invoke('selectedPage'),
    pages: () => ipcRenderer.invoke('pages'),
    loadPage: ()  => ipcRenderer.invoke('pages'),
    // we can also expose variables, not just functions
})