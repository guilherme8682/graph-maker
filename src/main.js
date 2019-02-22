const url = require('url')
const path = require('path')
const { app, BrowserWindow, Menu, ipcMain } = require('electron')

app.on('ready', () => {    
    mainWindow = new BrowserWindow({
        width: 962, 
        height: 764,
        resizable: true, 
        frame: false, 
        'minHeight': 620, 
        'minWidth': 860
    })
    mainWindow.loadURL( url.format({
        pathname: path.join(__dirname, 'views/main/mainWindow.html'),
        protocol: 'file',
        slashes: true
    }))
    // mainWindow.openDevTools()
    //Menu.setApplicationMenu(null)
})
ipcMain.on('quit', () => {
    app.quit()
})
let enableSetupMap = false
ipcMain.on('setupNewMap', (e) => {
    if(!enableSetupMap){
        enableSetupMap = true
        setupMapWindow = new BrowserWindow({
            width: 400, 
            height: 500,
            resizable: false, 
            frame: false
        })
        setupMapWindow.loadURL( url.format({
            pathname: path.join(__dirname, 'views/setupMap/setupMapWindow.html'),
            protocol: 'file',
            slashes: true
        }))
        //setupMapWindow.openDevTools()
    }
})
ipcMain.on('createMap', (e, data) => {
    enableSetupMap = false
    mainWindow.webContents.send('createMap', data)
})
ipcMain.on('closeSetupMap', () => {
    enableSetupMap = false
})

