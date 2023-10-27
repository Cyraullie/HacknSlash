
const { app, BrowserWindow, Menu, screen, ipcMain, ipcRenderer  } = require('electron');
const { autoUpdater, AppUpdater } = require("electron-updater")
const MainScreen = require("./mainScreen");
const path = require('path');



//autoUpdater.setFeedURL('http://178.211.245.23:8180/dist/latest.yml')
let mainWindow;

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

function createWindow () {
  mainWindow = new MainScreen();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow();
    }
  });

  /*autoUpdater.checkForUpdates();
  mainWindow.showMessage(`Checking for updates. Current version ${app.getVersion()}`);*/
});

/*New Update Available*/
/*autoUpdater.on("update-available", (info) => {
  mainWindow.showMessage(`Update available. Current version ${app.getVersion()}`);
  let pth = autoUpdater.downloadUpdate();
  mainWindow.showMessage(pth);
});

autoUpdater.on("update-not-available", (info) => {
  mainWindow.showMessage(`No update available. Current version ${app.getVersion()}`);
});*/

/*Download Completion Message*/
/*autoUpdater.on("update-downloaded", (info) => {
  mainWindow.showMessage(`Update downloaded. Current version ${app.getVersion()}`);
});

autoUpdater.on("error", (info) => {
  mainWindow.showMessage(info);
});*/




process.on("uncaughtException", function (err) {
  console.log(err);
});
  
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


