const { app, BrowserWindow, Menu, ipcMain, screen, globalShortcut } = require("electron");
const path = require("path");

class MainScreen {

  window;

  position = {
    maximized: true,
  };

  constructor() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    this.window = new BrowserWindow({
      width: width,
      height: height,
      title: "This is a test application",
      show: false,
      resizable: false,
      removeMenu: true,
      acceptFirstMouse: true,
      icon: path.join(__dirname, 'Logo_M.ico'), 
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, "./mainPreload.js"),
      },
    });


    this.window.once("ready-to-show", () => {
      this.window.show();

      if (this.position.maximized) {
        this.window.maximize();
      }
    });

    this.handleMessages();

    this.window.loadFile('index.html');

    this.window.on('will-move', (e) => {
        e.preventDefault();
    });
    
    //pour le dev
    //this.window.webContents.openDevTools();
    let customMenu = Menu.buildFromTemplate([]);

    Menu.setApplicationMenu(customMenu);
    // Gérez l'événement de fermeture de la fenêtre
    this.window.on('closed', () => {
    this.window = null;
    });
      
  }

  showMessage(message) {
    console.log("showMessage trapped");
    console.log(message);
    this.window.webContents.send("updateMessage", message);
  }

  close() {
    this.window.close();
    ipcMain.removeAllListeners();
  }

  hide() {
    this.window.hide();
  }

  handleMessages() {
    //Ipc functions go here.
  }
}

module.exports = MainScreen;