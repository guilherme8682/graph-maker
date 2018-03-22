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
    let pathSize = document.getElementById('pathSize')
    let numberVisited = document.getElementById('numberVisited')
    let obstacleIntensityView = document.getElementById('obstacleIntensityView')
    let clicked = false
    
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
    let changeDate = (pathNum, visistedNum) => {
        pathSize.innerHTML = pathNum
        numberVisited.innerHTML = visistedNum
    }
    let createMap = (size) => {
        map = null
        map = new Map(canvas, size)                
        findButton.innerText = 'Find'
        mapNameField.value = ''
        map.activeDrawingMethod(drawingMethod.value)
        map.setObstacleIntensity(Number(obstacleIntensity.value))        
        map.setSendSearchData(changeDate.bind(this))
    }

    obstacleIntensityView.addEventListener('input', () => {
        let value = obstacleIntensityView.value
        if(obstacleIntensityView.value > 100)
            obstacleIntensityView.value = 100
        else if(obstacleIntensityView < 1)
            obstacleIntensityView.value = 1
        obstacleIntensity.value = value
    })
    searchMethod.addEventListener('change', () => {
        map.activeSearchMethod(searchMethod.value)
    })
    createMap(9)
    window.addEventListener('resize', () => {
        map.refreshScreen()
    })
    findButton.addEventListener('click',() => {
        if(findButton.innerText == 'Find'){
            findButton.innerText = 'Stop'
            map.searchEnable = true
            map.drawMap()
        }
        else{
            findButton.innerText = 'Find'
            map.searchEnable = false
            map.drawMap()
        }
    })
    drawingMethod.addEventListener('change', () => {
        map.activeDrawingMethod(drawingMethod.value)
        if(drawingMethod.value == 'obstacle')
            document.getElementById('obstacleIntensityField').hidden = false
        else
            document.getElementById('obstacleIntensityField').hidden = true
    })
    canvas.addEventListener('mousedown', (click) => {
        clicked = true
        map.clickEvent(click)
    })
    canvas.addEventListener('mouseup', () => {
        clicked = false
    })
    canvas.addEventListener('mousemove', (click) => {
        if(clicked)
            map.clickEvent(click)
    })
    obstacleIntensity.addEventListener('input', () =>{
        let value = Number(obstacleIntensity.value)
        map.setObstacleIntensity(value)
        obstacleIntensityView.value = value
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
        }
        catch (error) {
            alert('Could not open file')
            console.log(error)
        }
        mapNameField.value = map.name
        findButton.innerText = 'Find'
        map.activeSearchMethod(searchMethod.value)
        map.activeDrawingMethod(drawingMethod.value)
        map.setObstacleIntensity(Number(obstacleIntensity.value))        
        map.setSendSearchData(changeDate.bind(this))
    })
    document.getElementById('saveButton').addEventListener('click', saveMap)     
    document.getElementById('newFileButton').addEventListener('click', () => {
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
    return map
}

module.exports.events = events