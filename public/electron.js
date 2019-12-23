const { app, BrowserWindow } = require('electron')
const { join } = require('path')
// const isDev = require('electron-is-dev')

let mainWindow
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 916,
		height: 730,
		resizable: true,
		frame: false,
		minHeight: 730,
		minWidth: 916,
		webPreferences: {
			nodeIntegration: true,
		},
	})
	mainWindow.loadURL(
		false ? 'http://localhost:3000' : `file://${join(__dirname, '../build/index.html')}`,
	)
	// mainWindow.webContents.toggleDevTools()
}
app.on('ready', createWindow)
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})
app.on('activate', () => {
	if (mainWindow === null) {
		createWindow()
	}
})
