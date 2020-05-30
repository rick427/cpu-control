const {BrowserWindow} = require('electron');

class MainWindow extends BrowserWindow {
    constructor(file, isDev){
        // super is a method that lets you pass props to the Browserwindow class 
        // which is been inherited by extending that class
        // in order words a method that call the constructor of the extended class
        super({
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

        this.loadFile(file);

        if (isDev) {
            this.webContents.openDevTools()
        }
    }
}

module.exports = MainWindow;