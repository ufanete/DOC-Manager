const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    appController: () => ipcRenderer.invoke('appController'),
    organisation: () => ipcRenderer.invoke('organisation'),
    selectedPage: () => ipcRenderer.invoke('selectedPage'),
    pages: () => ipcRenderer.invoke('pages'),
    getPage: ()  => ipcRenderer.invoke('getPage'),
    getPageHTML: () => ipcRenderer.invoke('getPageHTML')
    // we can also expose variables, not just functions
})