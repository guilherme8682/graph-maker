const { Map } = require('./Map')
const { dialog, getCurrentWindow } = require('electron').remote

function events(canvas){
    let map
    let searchMethod = document.getElementById('SearchMethod')
    let buttonFind = document.getElementById('find')    
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
    let createMap = () => {
        map = new Map(canvas, 400)                
        buttonFind.innerText = 'Find'
        mapNameField.value = ''
        map.activeDrawingMethod(drawingMethod.value)
        map.setObstacleIntensity(Number(obstacleIntensity.value))
    }    
    createMap()
    window.addEventListener('resize', () => {
        map.refreshScreen()
    })
    buttonFind.addEventListener('click',() => {
        if(buttonFind.innerText == 'Find'){
            map.activeSearchMethod(searchMethod.value)
            buttonFind.innerText = 'Stop'
        }
        else{
            map.disableSearchMethod()
            buttonFind.innerText = 'Find'
        }
    })
    drawingMethod.addEventListener('change', () => {
        map.activeDrawingMethod(drawingMethod.value)
        if(drawingMethod.value == 'obstacle')
            document.getElementById('obstacleIntensityField').hidden = false
        else
            document.getElementById('obstacleIntensityField').hidden = true
    })
    canvas.addEventListener('click', (click) => {
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
            buttonFind.innerText = 'Find'
            map.activeDrawingMethod(drawingMethod.value)
            map.setObstacleIntensity(Number(obstacleIntensity.value))
        }
        catch (error) {
            alert('Arquivo não encontrado')
            console.log(error)
        }
    })
    document.getElementById('saveButton').addEventListener('click', saveMap)     
    document.getElementById('newFileButton').addEventListener('click', createMap)
    document.getElementById('close').addEventListener('click', () => {
        getCurrentWindow().close()
    })
    document.getElementById('minimize').addEventListener('click', () => {
        getCurrentWindow().minimize()
    })
    return map
}

module.exports.events = events