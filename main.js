const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow; // Déclarez la fenêtre en tant que variable globale

function createWindow() {
  mainWindow = new BrowserWindow({ 
    width: 800,
    height: 600,
    resizable: false,
    icon: path.join(__dirname, 'Logo_M.ico'), 
  });



  mainWindow.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
      details.requestHeaders['Origin'] = '*';
      callback({ cancel: false, requestHeaders: details.requestHeaders });
    });

  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools();
  const customMenu = Menu.buildFromTemplate([
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

  Menu.setApplicationMenu(customMenu);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

}

app.whenReady().then(createWindow);


// Ajoutez une fonction pour changer la taille de la fenêtre
export function changeWindowSize(width, height) {
  if (mainWindow) {
    mainWindow.setSize(width, height);
  }
}


