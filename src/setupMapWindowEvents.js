const { ipcRenderer } = require('electron')

const electron = require('electron')
const { getCurrentWindow } = electron.remote

function events(){
    let sendButton = document.getElementById('send')
    let sizeField = document.getElementById('size')
    let warning = document.getElementById('warning')

    function sendValues(){
        let size = sizeField.value
        if(size){
            ipcRenderer.send('createMap', {size: Number(size)})
            getCurrentWindow().close()
        }
        else{
            warning.hidden = false
        }
    }

    document.getElementById('close').addEventListener('click', () => {
        getCurrentWindow().close()
    })
    document.getElementById('minimize').addEventListener('click', () => {
        getCurrentWindow().minimize()
    })
    sendButton.addEventListener('click', sendValues)
    sizeField.addEventListener('keypress',(button) => {
        let char = button.char || button.charCode || button.which;
        if(char == 13) // 13 = Enter
            sendValues()
    })
}

module.exports.events = events