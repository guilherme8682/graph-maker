const url = require('url')
const path = require('path')
const { app, BrowserWindow, Menu, ipcMain } = require('electron')

let setupMapWindow

app.on('ready', () => {
    
    mainWindow = new BrowserWindow({
        width: 962, 
        height: 764,
        resizable: true, 
        frame: false, 
        'minHeight': 620, 
        'minWidth': 810
    })
    mainWindow.loadURL( url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file',
        slashes: true
    }))
    //mainWindow.openDevTools()
    Menu.setApplicationMenu(null)

})

ipcMain.on('setupNewMap', (e) => {
    setupMapWindow = new BrowserWindow({
        width: 400, 
        height: 500,
        resizable: false, 
        frame: false
    })
    setupMapWindow.loadURL( url.format({
        pathname: path.join(__dirname, 'setupMapWindow.html'),
        protocol: 'file',
        slashes: true
    }))
    //setupMapWindow.openDevTools()
})

ipcMain.on('quit', () => {
    app.quit()
})
ipcMain.on('createMap', (e, data) => {
    mainWindow.webContents.send('createMap', data)
})