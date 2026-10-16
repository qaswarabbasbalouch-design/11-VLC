const { app, BrowserWindow, ipcMain, dialog, Menu, shell, protocol, net } = require('electron');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

let mainWindow = null;

// Register custom safe protocol for local media streaming
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'vlc-media',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      stream: true,
      bypassCSP: true
    }
  }
]);

// Window state preservation path
const getWindowStatePath = () => path.join(app.getPath('userData'), 'window-state.json');

function loadWindowState() {
  try {
    const data = fs.readFileSync(getWindowStatePath(), 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return { width: 1280, height: 800, isMaximized: false };
  }
}

function saveWindowState() {
  if (!mainWindow) return;
  try {
    const isMaximized = mainWindow.isMaximized();
    const bounds = mainWindow.getNormalBounds();
    const state = {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      isMaximized
    };
    fs.writeFileSync(getWindowStatePath(), JSON.stringify(state));
  } catch (err) {
    // Ignore error during shutdown
  }
}

function createApplicationMenu() {
  const isMac = process.platform === 'darwin';

  const template = [
    {
      label: 'Media',
      submenu: [
        {
          label: 'Open File...',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'open-file');
          }
        },
        {
          label: 'Open Folder / Library...',
          accelerator: 'CmdOrCtrl+Shift+O',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'open-folder');
          }
        },
        {
          label: 'Open Subtitle File...',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'open-subtitle');
          }
        },
        { type: 'separator' },
        {
          label: 'Clear Recent History',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'clear-recent');
          }
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit', label: 'Exit VLC 11 Player' }
      ]
    },
    {
      label: 'Playback',
      submenu: [
        {
          label: 'Play / Pause',
          accelerator: 'Space',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'toggle-play');
          }
        },
        {
          label: 'Stop',
          accelerator: 'S',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'stop');
          }
        },
        {
          label: 'Previous Track',
          accelerator: 'P',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'prev-track');
          }
        },
        {
          label: 'Next Track',
          accelerator: 'N',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'next-track');
          }
        },
        { type: 'separator' },
        {
          label: 'Step Forward 5 Seconds',
          accelerator: 'Right',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'seek-forward-5');
          }
        },
        {
          label: 'Step Backward 5 Seconds',
          accelerator: 'Left',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'seek-backward-5');
          }
        },
        { type: 'separator' },
        {
          label: 'Speed Up (Faster)',
          accelerator: ']',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'speed-up');
          }
        },
        {
          label: 'Slow Down (Slower)',
          accelerator: '[',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'speed-down');
          }
        },
        {
          label: 'Normal Speed (1.0x)',
          accelerator: '=',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'speed-normal');
          }
        }
      ]
    },
    {
      label: 'Audio',
      submenu: [
        {
          label: 'Increase Volume',
          accelerator: 'Up',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'volume-up');
          }
        },
        {
          label: 'Decrease Volume',
          accelerator: 'Down',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'volume-down');
          }
        },
        {
          label: 'Mute / Unmute',
          accelerator: 'M',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'toggle-mute');
          }
        },
        { type: 'separator' },
        {
          label: 'Audio Equalizer & Presets',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'toggle-equalizer');
          }
        }
      ]
    },
    {
      label: 'Video',
      submenu: [
        {
          label: 'Full Screen',
          accelerator: 'F11',
          click: () => {
            if (mainWindow) {
              const fs = mainWindow.isFullScreen();
              mainWindow.setFullScreen(!fs);
              mainWindow.webContents.send('menu:action', 'toggle-fullscreen');
            }
          }
        },
        {
          label: 'Aspect Ratio: Default (Fit)',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'aspect-ratio', 'fit');
          }
        },
        {
          label: 'Aspect Ratio: Fill (16:9)',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'aspect-ratio', '16:9');
          }
        },
        {
          label: 'Aspect Ratio: Original (1:1)',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'aspect-ratio', 'original');
          }
        },
        { type: 'separator' },
        {
          label: 'Video Effects (Contrast / Brightness)',
          accelerator: 'CmdOrCtrl+V',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'toggle-video-effects');
          }
        }
      ]
    },
    {
      label: 'Subtitles',
      submenu: [
        {
          label: 'Add Subtitle File (.srt, .vtt)...',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'open-subtitle');
          }
        },
        {
          label: 'Toggle Subtitles Display',
          accelerator: 'V',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'toggle-subtitles');
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Playlist Panel',
          accelerator: 'CmdOrCtrl+L',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'toggle-playlist');
          }
        },
        {
          label: 'Toggle Sidebar Navigation',
          accelerator: 'CmdOrCtrl+B',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'toggle-sidebar');
          }
        },
        { type: 'separator' },
        {
          label: 'Toggle Dark / Light Theme',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'toggle-theme');
          }
        },
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About VLC 11 Player',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'open-about');
          }
        },
        {
          label: 'Keyboard Shortcuts Reference',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu:action', 'open-shortcuts');
          }
        },
        { type: 'separator' },
        {
          label: 'Visit Project Repository',
          click: async () => {
            await shell.openExternal('https://github.com');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createWindow() {
  const savedState = loadWindowState();

  mainWindow = new BrowserWindow({
    width: savedState.width || 1280,
    height: savedState.height || 800,
    x: savedState.x,
    y: savedState.y,
    minWidth: 960,
    minHeight: 600,
    title: 'VLC 11 Player',
    backgroundColor: '#070b14',
    show: false,
    frame: true, // Native Windows Titlebar with custom styled header controls
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true
    }
  });

  if (savedState.isMaximized) {
    mainWindow.maximize();
  }

  // Window state notification
  mainWindow.on('maximize', () => mainWindow.webContents.send('window:stateChange', 'maximized'));
  mainWindow.on('unmaximize', () => mainWindow.webContents.send('window:stateChange', 'unmaximized'));
  mainWindow.on('enter-full-screen', () => mainWindow.webContents.send('window:stateChange', 'fullscreen'));
  mainWindow.on('leave-full-screen', () => mainWindow.webContents.send('window:stateChange', 'windowed'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', () => {
    saveWindowState();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links safely
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Determine whether running in dev server mode or packaged production mode
  const devServerUrl = process.env.VITE_DEV_SERVER_URL || process.env.ELECTRON_START_URL;
  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    // In production build, the Vite dist is packaged adjacent to electron
    const distPath = path.join(__dirname, '../dist/index.html');
    if (fs.existsSync(distPath)) {
      mainWindow.loadFile(distPath);
    } else {
      // Fallback dev check
      mainWindow.loadURL('http://localhost:3000');
    }
  }
}

// Setup IPC Handlers
function setupIpc() {
  // Window controls
  ipcMain.handle('window:minimize', () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.handle('window:maximize', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
      return mainWindow.isMaximized();
    }
    return false;
  });

  ipcMain.handle('window:close', () => {
    if (mainWindow) mainWindow.close();
  });

  ipcMain.handle('window:isMaximized', () => {
    return mainWindow ? mainWindow.isMaximized() : false;
  });

  ipcMain.handle('window:setFullScreen', (_event, flag) => {
    if (mainWindow) mainWindow.setFullScreen(flag);
  });

  // Native Open File Dialog
  ipcMain.handle('dialog:openFile', async (_event, options = {}) => {
    if (!mainWindow) return { canceled: true, filePaths: [] };

    const filters = options.filters || [
      {
        name: 'Supported Media Files',
        extensions: ['mp4', 'webm', 'mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac', 'mov', 'mkv', 'avi']
      },
      { name: 'Video Files', extensions: ['mp4', 'webm', 'mov', 'mkv', 'avi'] },
      { name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'] },
      { name: 'All Files (*.*)', extensions: ['*'] }
    ];

    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Open Media File — VLC 11 Player',
      properties: ['openFile', options.multiSelections ? 'multiSelections' : 'singleSelection'],
      filters
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { canceled: true, files: [] };
    }

    // Generate safe media objects
    const files = result.filePaths.map((filePath) => {
      const stats = fs.statSync(filePath);
      const fileName = path.basename(filePath);
      const ext = path.extname(filePath).toLowerCase().replace('.', '');
      const isVideo = ['mp4', 'webm', 'mov', 'mkv', 'avi'].includes(ext);
      // Safe URL using custom protocol
      const safeUrl = `vlc-media://${encodeURIComponent(filePath.replace(/\\/g, '/'))}`;

      return {
        id: 'file-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9),
        name: fileName,
        path: filePath,
        url: safeUrl,
        size: stats.size,
        type: isVideo ? 'video' : 'audio',
        extension: ext,
        lastModified: stats.mtimeMs
      };
    });

    return { canceled: false, files };
  });

  // Native Open Folder Dialog
  ipcMain.handle('dialog:openFolder', async () => {
    if (!mainWindow) return { canceled: true, files: [] };

    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Select Media Directory — VLC 11 Player',
      properties: ['openDirectory']
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { canceled: true, files: [] };
    }

    const folderPath = result.filePaths[0];
    const allowedExtensions = ['.mp4', '.webm', '.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac'];
    const files = [];

    try {
      const dirEntries = fs.readdirSync(folderPath, { withFileTypes: true });
      for (const entry of dirEntries) {
        if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (allowedExtensions.includes(ext)) {
            const filePath = path.join(folderPath, entry.name);
            const stats = fs.statSync(filePath);
            const isVideo = ['.mp4', '.webm'].includes(ext);
            const safeUrl = `vlc-media://${encodeURIComponent(filePath.replace(/\\/g, '/'))}`;

            files.push({
              id: 'file-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9),
              name: entry.name,
              path: filePath,
              url: safeUrl,
              size: stats.size,
              type: isVideo ? 'video' : 'audio',
              extension: ext.replace('.', ''),
              lastModified: stats.mtimeMs
            });
          }
        }
      }
    } catch (err) {
      console.error('Error scanning folder:', err);
    }

    return { canceled: false, folderPath, files };
  });

  // Subtitle File Dialog
  ipcMain.handle('dialog:openSubtitle', async () => {
    if (!mainWindow) return { canceled: true };

    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Load Subtitle File — VLC 11 Player',
      properties: ['openFile'],
      filters: [
        { name: 'Subtitle Files (*.srt, *.vtt)', extensions: ['srt', 'vtt'] },
        { name: 'SubRip Subtitle (*.srt)', extensions: ['srt'] },
        { name: 'WebVTT Subtitle (*.vtt)', extensions: ['vtt'] },
        { name: 'All Files (*.*)', extensions: ['*'] }
      ]
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { canceled: true };
    }

    const filePath = result.filePaths[0];
    const fileName = path.basename(filePath);
    const content = fs.readFileSync(filePath, 'utf8');

    return {
      canceled: false,
      fileName,
      filePath,
      content
    };
  });

  // Read subtitle text
  ipcMain.handle('file:readSubtitle', async (_event, filePath) => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return { success: true, content };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('app:getVersion', () => app.getVersion());
}

// App lifecycle
app.whenReady().then(() => {
  // Setup custom media stream handler
  protocol.handle('vlc-media', (request) => {
    const rawPath = request.url.replace('vlc-media://', '');
    const decodedPath = decodeURIComponent(rawPath);
    const fileUrl = pathToFileURL(decodedPath).toString();
    return net.fetch(fileUrl);
  });

  setupIpc();
  createApplicationMenu();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
