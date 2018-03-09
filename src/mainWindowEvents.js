const { Map } = require('./Map')
const { dialog } = require('electron').remote

module.exports.events = function(canvas){
    let map = new Map(canvas, 100)

    let searchMethod = document.getElementById('SearchMethod')
    let buttonFind = document.getElementById('find')    
    let drawingMethod = document.getElementById('drawingMethod')    
    let obstacleIntensity = document.getElementById('obstacleIntensity')    
    let mapNameField = document.getElementById('mapNameField')
    let fileNameToOpenField = document.getElementById('fileNameToOpenField')
    
    function saveMapFile(){
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
        alert('Map save as "' + name + '.net" and "' + name + '.json"\n in' + path)
    }
    window.addEventListener('resize', () => {
        map.refreshScreen()
    })
    buttonFind.addEventListener('click',() => {
        if(buttonFind.innerText == 'Find'){
            map.activeSearchMethod(searchMethod.value)
            buttonFind.innerText = 'Stop find'
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
        saveMapFile()
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
        )[0]
        path = path.substr(0, path.length - 4)
        if(!path)
            return
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
    document.getElementById('saveButton').addEventListener('click', saveMapFile) 
    
    document.getElementById('newFileButton').addEventListener('click', () => {
        map = new Map(canvas, 100)                
        buttonFind.innerText = 'Find'
        map.activeDrawingMethod(drawingMethod.value)
        map.setObstacleIntensity(Number(obstacleIntensity.value))
    })

}
