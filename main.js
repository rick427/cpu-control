const { app, BrowserWindow, Menu, ipcMain, Tray } = require('electron')
const log = require('electron-log');
const path = require('path');
const Store = require('./store');

// Set env
process.env.NODE_ENV = 'production';

const isDev = process.env.NODE_ENV !== 'production' ? true : false
const isMac = process.platform === 'darwin' ? true : false

let mainWindow;
let tray;

// Init store and defaults
const store = new Store({
  configName: 'user-settings',
  defaults: {
    settings: {
      cpuOverload: 80,
      alertFrequency: 5,
    },
  },
})

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: 'CpuControl',
    width: isDev ? 800 : 355,
    height: 500,
    icon: `${__dirname}/assets/icons/icon.png`,
    resizable: isDev ? true : false,
    webPreferences: {
      nodeIntegration: true,
    },
    show: false,
    opacity: 0.9
  })

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.loadFile('./app/index.html')
}

app.on('ready', () => {
  createMainWindow();

  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.send('settings:get', store.get('settings'))
  })

  mainWindow.on('close', e => {
    if(!app.isQuitting){
      e.preventDefault();
      mainWindow.hide()
    }
    return true;
  })

  const icon = path.join(__dirname, 'assets', 'icons', 'tray_icon.png');

  // create tray instance
  tray = new Tray(icon);

  tray.on('click', () => {
    if(mainWindow.isVisible() === true){
      mainWindow.hide()
    }
    else{
      mainWindow.show();
    }
  })

  tray.on('right-click', () => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Quit',
        click: () => {
          app.isQuitting = true
          app.quit();
        }
      }
    ])
    tray.popUpContextMenu(contextMenu)
  })

  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)
})

const menu = [
  ...(isMac ? [{ role: 'appMenu' }] : []),
  {
    role: 'fileMenu',
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Toggle Navigation',
        click: () => mainWindow.webContents.send('nav:toggle')
      }
    ]
  },
  ...(isDev
    ? [
        {
          label: 'Developer',
          submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            { role: 'toggledevtools' },
          ],
        },
      ]
    : []),
];

// set settings 
ipcMain.on('settings:set', (event, values) => {
  store.set('settings', values);
  mainWindow.webContents.send('settings:get', store.get('settings'))
})

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})

app.allowRendererProcessReuse = true
