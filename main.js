// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
const next = require('next');

const isDev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev: isDev });
const handle = nextApp.getRequestHandler();

const port = 3000; 

async function createWindow() {
  //await nextApp.prepare();

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const startUrl = isDev
    ? 'http://localhost:3000' // Development server URL
    : `file://${path.join(__dirname, '/out/index.html')}`; // Production URL

  mainWindow.loadURL(startUrl);
}

app.on('ready', createWindow);

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