const electron = require('electron')
const url = require('url')
const path = require('path')
const { app, BrowserWindow, Menu } = electron

let mainWindows

app.on('ready', () => {
    
    mainWindow = new BrowserWindow({width: 962, height: 764,resizable: true, frame: false, 'minHeight': 754, 'minWidth': 962})
    mainWindow.loadURL( url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file',
        slashes: true
    }))
    mainWindow.openDevTools()
    Menu.setApplicationMenu(null)

})
