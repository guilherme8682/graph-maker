const { Map } = require('./Map')
const electron = require('electron')
const { dialog, getCurrentWindow, BrowserWindow} = electron.remote
const { ipcRenderer } = electron
const url = require('url')
const path = require('path')

function events(canvas){
    let map
    let searchMethod = document.getElementById('SearchMethod')
    let findButton = document.getElementById('find')    
    let drawingMethod = document.getElementById('drawingMethod')    
    let obstacleIntensity = document.getElementById('obstacleIntensity')    
    let mapNameField = document.getElementById('mapNameField')
    let saveMap = () => {
        let name = mapNameField.value
        if(name == ''){
            alert('You must choose a name!')
            return
        }
        let path = dialog.showSaveDialog({
                defaultPath: name,
                filters: [
                    {   name: '.net', 
                        extensions: ['net']
                    }
                ]
            }
        )
        if(!path)
            return
        path = path.substr(0, path.length - 4)
        map.saveMap(path,name)
        alert('Map save as "' + name + '.net" and "' + name + '.json"\n in ' + path)
    }
    let createMap = (size) => {
        map = null
        map = new Map(canvas, size)                
        findButton.innerText = 'Find'
        mapNameField.value = ''
        map.activeDrawingMethod(drawingMethod.value)
        map.setObstacleIntensity(Number(obstacleIntensity.value))
    }    
    createMap(400)
    window.addEventListener('resize', () => {
        map.refreshScreen()
    })
    findButton.addEventListener('click',() => {
        if(findButton.innerText == 'Find'){
            map.activeSearchMethod(searchMethod.value)
            findButton.innerText = 'Stop'
        }
        else{
            map.disableSearchMethod()
            findButton.innerText = 'Find'
        }
    })
    drawingMethod.addEventListener('change', () => {
        map.activeDrawingMethod(drawingMethod.value)
        if(drawingMethod.value == 'obstacle')
            document.getElementById('obstacleIntensityField').hidden = false
        else
            document.getElementById('obstacleIntensityField').hidden = true
    })
    let clicked = false
    canvas.addEventListener('mousedown', () => {
        clicked = true
    })
    canvas.addEventListener('mouseup', () => {
        clicked = false
    })
    canvas.addEventListener('mousemove', (click) => {
        if(clicked)
            map.clickEvent(click)
    })

    obstacleIntensity.addEventListener('change', () =>{
        map.setObstacleIntensity(Number(obstacleIntensity.value))
    })
    mapNameField.addEventListener('keypress', (button) => {
        let char = button.char || button.charCode || button.which;
        if(char == 13) // 13 = Enter
            saveMap()
    })
    document.getElementById('readButton').addEventListener('click', () => {
        let path = dialog.showOpenDialog({
                properties: ['openFile'], 
                filters: [
                    {   name: '.net', 
                        extensions: ['net']
                    }
                ]
            }
        )
        if(!path)
            return
        path = path[0].substr(0, path[0].length - 4)
        try {
            map = new Map(canvas, path)
            document.getElementById('mapNameField').value = map.name
            findButton.innerText = 'Find'
            map.activeDrawingMethod(drawingMethod.value)
            map.setObstacleIntensity(Number(obstacleIntensity.value))
        }
        catch (error) {
            alert('Could not open file')
            console.log(error)
        }
    })
    document.getElementById('saveButton').addEventListener('click', saveMap)     
    document.getElementById('newFileButton').addEventListener('click', () => {
        let size = 9
        ipcRenderer.send('setupNewMap')
    })
    document.getElementById('close').addEventListener('click', () => {
        ipcRenderer.send('quit')
    })
    document.getElementById('minimize').addEventListener('click', () => {
        getCurrentWindow().minimize()
    })

    ipcRenderer.on('createMap', (e,data) => {
        createMap(data.size)
    })
}

module.exports.events = events