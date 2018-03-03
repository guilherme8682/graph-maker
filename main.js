const electron = require('electron')
const url = require('url')
const path = require('path')
const { app, BrowserWindow, Menu } = electron

let mainWindows

app.on('ready', () => {
    mainWindow = new BrowserWindow({})

    mainWindow.loadURL( url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file',
        slashes: true
    }))

    Menu.setApplicationMenu(null)
})
