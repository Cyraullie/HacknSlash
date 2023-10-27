
const { app, BrowserWindow, Menu, screen, dialog, ipcMain, autoUpdater  } = require('electron');

const path = require('path');
//autoUpdater.setFeedURL('http://178.211.245.23:8180/dist/latest.yml')
let mainWindow;

function createWindow () {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    resizable: false,
    icon: path.join(__dirname, 'Logo_M.ico'), 
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  mainWindow.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['Origin'] = '*';
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  // Chargez votre contenu web
  mainWindow.loadFile('index.html');

  mainWindow.maximize();

  mainWindow.on('will-move', (e) => {
    e.preventDefault();
  });

  //pour le dev
  //mainWindow.webContents.openDevTools();
  let customMenu = Menu.buildFromTemplate([]);

  Menu.setApplicationMenu(customMenu);
  // Gérez l'événement de fermeture de la fenêtre
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
});

  
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
