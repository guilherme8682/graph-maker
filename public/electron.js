const { app, BrowserWindow } = require('electron')
const { join } = require('path')

app.on('ready', createWindow)

function createWindow() {
	const mainWindow = new BrowserWindow({
		minHeight: 730,
		minWidth: 916,
		width: 916,
		height: 730,
		resizable: true,
		frame: false,
		webPreferences: {
			nodeIntegration: true,
		},
	})
	mainWindow.loadURL(
		false ? 'http://localhost:3000' : `file://${join(__dirname, '../build/index.html')}`,
	)
	// mainWindow.webContents.toggleDevTools()
}
