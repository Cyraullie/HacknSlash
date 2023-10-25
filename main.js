const { app, BrowserWindow, Menu, screen, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

app.on('ready', () => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  let mainWindow = new BrowserWindow({
    width: width,
    height: height,
    resizable: false,
    icon: path.join(__dirname, 'Logo_M.ico'), 
    webPreferences: {
      nodeIntegration: true
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
  
  // pour le dev
  //mainWindow.webContents.openDevTools();
  let customMenu = Menu.buildFromTemplate([
    /*{
      label: 'Custom Menu', // Vous pouvez personnaliser le nom du menu
      submenu: [
        {
          label: 'Item 1',
          click: () => {
            // Action à effectuer lorsque "Item 1" est cliqué
          },
        },
        {
          label: 'Item 2',
          click: () => {
            // Action à effectuer lorsque "Item 2" est cliqué
          },
        },
      ],
    },*/
  ]);

  autoUpdater.setFeedURL('https://github.com/Cyraullie/HacknSlash/blob/develop/dist/latest.yml')
  // Vérifiez s'il y a des mises à jour au démarrage
  autoUpdater.checkForUpdates();

  autoUpdater.on('update-available', () => {
    // Une mise à jour est disponible, vous pouvez afficher un message à l'utilisateur
  dialog.showMessageBox({
    type: 'info',
    title: 'Mise à jour disponible',
    message: 'Une mise à jour est disponible. Voulez-vous la télécharger maintenant ?',
    buttons: ['Télécharger', 'Plus tard'],
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
      // Si l'utilisateur clique sur "Télécharger", vous pouvez commencer le processus de téléchargement
      autoUpdater.downloadUpdate();
    }
  });
  });

  autoUpdater.on('update-downloaded', () => {
    // La mise à jour a été téléchargée, vous pouvez proposer à l'utilisateur de l'installer
  dialog.showMessageBox({
    type: 'info',
    title: 'Mise à jour téléchargée',
    message: "La mise à jour a été téléchargée. Voulez-vous l'installer maintenant ?",
    buttons: ['Installer', 'Plus tard'],
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
      // Si l'utilisateur clique sur "Installer", vous pouvez quitter l'application et installer la mise à jour
      autoUpdater.quitAndInstall();
    }
  });
  });

  Menu.setApplicationMenu(customMenu);

  // Gérez l'événement de fermeture de la fenêtre
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

  //mainWindow.maximize();

  




