const { contextBridge, ipcRenderer } = require('electron');

/**
 * Secure Preload Script for VLC 11 Player
 * Exposes strictly controlled IPC methods to the renderer process.
 * Maintains contextIsolation: true and nodeIntegration: false.
 */
contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  platform: process.platform,

  // Window control methods
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  setFullScreen: (flag) => ipcRenderer.invoke('window:setFullScreen', flag),

  // File and Dialog operations
  openFileDialog: (options) => ipcRenderer.invoke('dialog:openFile', options),
  openFolderDialog: () => ipcRenderer.invoke('dialog:openFolder'),
  openSubtitleDialog: () => ipcRenderer.invoke('dialog:openSubtitle'),
  readSubtitleFile: (filePath) => ipcRenderer.invoke('file:readSubtitle', filePath),
  getAppVersion: () => ipcRenderer.invoke('app:getVersion'),

  // Event listeners from Native Application Menu
  onMenuAction: (callback) => {
    const subscription = (_event, action, payload) => callback(action, payload);
    ipcRenderer.on('menu:action', subscription);
    return () => {
      ipcRenderer.removeListener('menu:action', subscription);
    };
  },

  // Window state change listener
  onWindowStateChange: (callback) => {
    const subscription = (_event, state) => callback(state);
    ipcRenderer.on('window:stateChange', subscription);
    return () => {
      ipcRenderer.removeListener('window:stateChange', subscription);
    };
  }
});
