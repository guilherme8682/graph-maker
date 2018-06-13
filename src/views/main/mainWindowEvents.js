const { Map } = require('./../../model/Map')
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
    let pathCost = document.getElementById('pathCost')
    let numberVisited = document.getElementById('numberVisited')
    let obstacleIntensityView = document.getElementById('obstacleIntensityView')
    let contactMe = document.getElementById('contact-me')
    let contactMeTrigger = document.getElementById('contact-me-trigger')
    let clicked = false
    let contactMeStatus = {trigger: false, content: false}

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
    let changeDate = (pathNum, pathC, visistedNum) => {
        pathSize.innerHTML = pathNum
        pathCost.innerHTML = pathC
        numberVisited.innerHTML = visistedNum
    }
    let createMap = (size) => {
        map = null
        map = new Map(canvas, size)
        findButton.innerText = 'Find'
        mapNameField.value = ''
        map.activeDrawingMethod(drawingMethod.value)
        map.activeSearchMethod(searchMethod.value)
        map.setObstacleIntensity(Number(obstacleIntensity.value))
        map.setSendSearchData(changeDate.bind(this))
        changeDate('--','--','--')
    }
    obstacleIntensityView.addEventListener('input', () => {
        if(obstacleIntensityView.value > 100)
            obstacleIntensityView.value = 100
        else if(obstacleIntensityView.value < 1)
            obstacleIntensityView.value = 1
        obstacleIntensity.value = obstacleIntensityView.value
    })
    searchMethod.addEventListener('change', () => {
        map.activeSearchMethod(searchMethod.value)
    })
    window.addEventListener('resize', () => {
        map.refreshScreen()
    })
    findButton.addEventListener('click',() => {
        if(findButton.innerText == 'Find'){
            findButton.innerText = 'Stop'
            map.searchEnable = true
            map.drawL3()
        }
        else{
            findButton.innerText = 'Find'
            map.searchEnable = false
            map.drawL3()
            changeDate('--','--','--')
        }
    })
    drawingMethod.addEventListener('change', () => {
        map.activeDrawingMethod(drawingMethod.value)
        if(drawingMethod.value == 'obstacle')
            document.getElementById('obstacleIntensityField').hidden = false
        else
            document.getElementById('obstacleIntensityField').hidden = true
    })
    canvas[canvas.length-1].addEventListener('mousedown', (click) => {
        clicked = true
        map.clickEvent(click)
    })
    canvas[canvas.length-1].addEventListener('mouseup', () => {
        clicked = false
    })
    canvas[canvas.length-1].addEventListener('mousemove', (click) => {
        if(clicked)
            map.clickEvent(click)
    })
    canvas[canvas.length-1].addEventListener('mouseout', () => {
        clicked = false
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
        changeDate('--','--','--')
    })
    document.getElementById('saveButton').addEventListener('click', saveMap)
    document.getElementById('newFileButton').addEventListener('click', () => {
        ipcRenderer.send('setupNewMap')
    })
    document.getElementById('close').addEventListener('click', () => {
        ipcRenderer.send('quit')
    })
    document.getElementById('fullScreen').addEventListener('click', () => {
        getCurrentWindow().maximize()
    })
    document.getElementById('minimize').addEventListener('click', () => {
        getCurrentWindow().minimize()
    })
    contactMeTrigger.addEventListener('mouseover', () => {
        contactMeStatus.trigger = true
        enableContactMe()
    })
    contactMeTrigger.addEventListener('mouseout', () => {
        contactMeStatus.trigger = false
        disableContactMe()
    })
    contactMe.addEventListener('mouseover', () => {
        contactMeStatus.content = true
        enableContactMe()
    })
    contactMe.addEventListener('mouseout', () => {
        contactMeStatus.content = false
        disableContactMe()
    })
    function enableContactMe(){
        contactMe.style.bottom = '25px'
        contactMe.style.opacity = '1'
    }
    function disableContactMe(){
        if(!(contactMeStatus.content || contactMeStatus.trigger)){
            contactMe.style.bottom = '-150px'
            contactMe.style.opacity = 0
        }
    }
    ipcRenderer.on('createMap', (e,data) => {
        createMap(data.size)
    })
    createMap(1024)
    return map
}
module.exports.events = events