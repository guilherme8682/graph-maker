const { Graph } = require('./Graph')
const { readFileSync } = require('fs')

module.exports.Map = class Map{ // Overload: new Map(canvas:Canvas, size:Number), new Map(canvas:Canvas, fileName:String)
    constructor(canvas, size){
        if(!canvas)
            throw new Error('Missing parameter in Map.')
        this.canvas = canvas
        this.context = canvas.getContext('2d')
        this.name = ''
        this.currentSearch = null
        this.currentDrawing = this.setBeginPoint.bind(this)
        this.originPoint = 0
        this.destinyPoint = size - 1
        this.obstacleIntensity = 50
        if(typeof size == 'number')
            this.makeRandomGraph(size)
        else if(typeof size == 'string')
            this.loadGraphFromFile(size)
        else
            throw new Error('Missing parameter in Map.')
        this.drawMap()
    }
    makeRandomGraph(size){
        this.numberOfBlocks = size
        this.refreshScreen(true)
        this.graph = new Graph(this.numberOfBlocks, true)
        this.costVertices = []
        for (let i = 0; i < this.numberOfBlocks; i++)
            this.costVertices[i] = Math.floor(Math.random() * 100)
        for(let i = 0; i < this.numberOfBlocksPerLine; i++){
            let column = i % this.numberOfBlocksPerLine
            if(column == 0){
                this.graph.createAdjacency(i, i+1, this.costVertices[i+1])
                this.graph.createAdjacency(i, i+this.numberOfBlocksPerLine, this.costVertices[i+this.numberOfBlocksPerLine])
            }
            else if(column == (this.numberOfBlocksPerLine - 1)){
                this.graph.createAdjacency(i, i-1, this.costVertices[i-1])
                this.graph.createAdjacency(i, i+this.numberOfBlocksPerLine, this.costVertices[i+this.numberOfBlocksPerLine])
            }
            else{
                this.graph.createAdjacency(i, i+1, this.costVertices[i+1])
                this.graph.createAdjacency(i, i-1, this.costVertices[i-1])
                this.graph.createAdjacency(i, i+this.numberOfBlocksPerLine, this.costVertices[i+this.numberOfBlocksPerLine])
            }
        }
        for(let i = this.numberOfBlocksPerLine; i  < this.numberOfBlocks - this.numberOfBlocksPerLine; i++){
            let column = i % this.numberOfBlocksPerLine
            if(column == 0){
                this.graph.createAdjacency(i, i+1, this.costVertices[i+1])
                this.graph.createAdjacency(i, i+this.numberOfBlocksPerLine, this.costVertices[i+this.numberOfBlocksPerLine])
                this.graph.createAdjacency(i, i-this.numberOfBlocksPerLine, this.costVertices[i-this.numberOfBlocksPerLine])
            }
            else if(column == (this.numberOfBlocksPerLine - 1)){
                this.graph.createAdjacency(i, i-1, this.costVertices[i-1])
                this.graph.createAdjacency(i, i+this.numberOfBlocksPerLine, this.costVertices[i+this.numberOfBlocksPerLine])
                this.graph.createAdjacency(i, i-this.numberOfBlocksPerLine, this.costVertices[i-this.numberOfBlocksPerLine])
            }
            else{
                this.graph.createAdjacency(i, i+1, this.costVertices[i+1])
                this.graph.createAdjacency(i, i-1, this.costVertices[i-1])
                this.graph.createAdjacency(i, i+this.numberOfBlocksPerLine, this.costVertices[i+this.numberOfBlocksPerLine])
                this.graph.createAdjacency(i, i-this.numberOfBlocksPerLine, this.costVertices[i-this.numberOfBlocksPerLine])
            }
        }
        for(let i = this.numberOfBlocks - this.numberOfBlocksPerLine; i < this.numberOfBlocks; i++){
            let column = i % this.numberOfBlocksPerLine
            if(column == 0){
                this.graph.createAdjacency(i, i+1, this.costVertices[i+1])
                this.graph.createAdjacency(i, i-this.numberOfBlocksPerLine, this.costVertices[i-this.numberOfBlocksPerLine])
            }
            else if(column == (this.numberOfBlocksPerLine - 1)){
                this.graph.createAdjacency(i, i-1, this.costVertices[i-1])
                this.graph.createAdjacency(i, i-this.numberOfBlocksPerLine, this.costVertices[i-this.numberOfBlocksPerLine])
            }
            else{
                this.graph.createAdjacency(i, i+1, this.costVertices[i+1])
                this.graph.createAdjacency(i, i-1, this.costVertices[i-1])
                this.graph.createAdjacency(i, i-this.numberOfBlocksPerLine, this.costVertices[i-this.numberOfBlocksPerLine])
            }        
        }
    }
    loadGraphFromFile(fileName){
        try {
            let dataJson = readFileSync(fileName + '.json')
            let data = JSON.parse(dataJson)
            this.name = data.name            
            this.originPoint = data.origin
            this.destinyPoint = data.destiny            
            this.graph = new Graph(fileName)
        } 
        catch (error) {
            throw error
        }
        this.numberOfBlocks = this.graph.size
        this.costVertices = []
        for (let i = 0; i < this.numberOfBlocks; i++) {
            this.costVertices[i] = Infinity
            for (let j = 0; j < this.numberOfBlocks; j++) {
                if(this.graph.getCostAdjacency(j, i) != Infinity){
                    this.costVertices[i] = this.graph.getCostAdjacency(j, i)
                    break
                }                
            }            
        }
        this.refreshScreen()
    }
    refreshScreen(fristTime){
        let height = window.innerHeight - 100,
            width = window.innerWidth - 300,
            resolution = height < width ? height : width
        if(resolution < 600)
            resolution = 600        
        if(this.resolution == resolution)        
            return
        else
            this.resolution = resolution
        this.canvas.height = this.resolution
        this.canvas.width = this.resolution
        this.numberOfBlocksPerLine = Math.ceil(Math.sqrt(this.numberOfBlocks))
        this.blockSize = {
            x:  canvas.width / this.numberOfBlocksPerLine,
            y: canvas.height / this.numberOfBlocksPerLine
        }
        if(fristTime)
            return
        this.drawMap()
    }
    searchWithDijkstra(){
        this.graph.dijkstra(this.originPoint, this.destinyPoint, (rota, visitados) => {
            this.drawBlocks(visitados)
            this.drawRoute(rota)
            console.log('pronto')
        })
    }
    drawBlocks(list){
        if(!list)
            return
        list.forEach(item => this.drawSquare(item, 'rgba(0,0,0,0.5)'))
    }
    drawRoute(list){
        let current = {
            x: (list[0] % this.numberOfBlocksPerLine * this.blockSize.x) + (this.blockSize.x / 2),
            y: (Math.floor(list[0] / this.numberOfBlocksPerLine) * this.blockSize.y) + (this.blockSize.y / 2)
        }
        this.context.strokeStyle = 'white'
        this.context.lineCap="round"
        this.context.lineWidth = this.blockSize.x / 4
        this.context.beginPath()
        this.context.moveTo(current.x, current.y)
        for (let i = 1; i < list.length; i++) {
            current = {
                x: (list[i] % this.numberOfBlocksPerLine * this.blockSize.x) + (this.blockSize.x / 2),
                y: (Math.floor(list[i] / this.numberOfBlocksPerLine) * this.blockSize.y) + (this.blockSize.y / 2)
            }
            this.context.lineTo(current.x, current.y)
        }        
        this.context.stroke()
    }
    drawBackGround(){
        this.context.fillStyle = 'PaleTurquoise'
        this.context.fillRect(0,0, this.canvas.width, this.canvas.height)
    }
    drawMap(){
        this.drawBackGround()
        let nColor = 0
        for(let i = 0; i < this.numberOfBlocks; ++i){
            nColor = this.costVertices[i] == Infinity ? 0:Math.floor((100 - this.costVertices[i]) / 100 * 255)
            this.drawSquare(i,'rgb(255,' + nColor + ',' + nColor + ')')
        }        
        this.drawSquare(this.originPoint, 'LawnGreen')
        this.drawSquare(this.destinyPoint, 'DodgerBlue')
        if(this.currentSearch)
            this.currentSearch()
    }
    drawSquare(index, color){
        let origin = {
            x: (index % this.numberOfBlocksPerLine * this.blockSize.x),
            y: (Math.floor(index / this.numberOfBlocksPerLine) * this.blockSize.y)
        }
        let x = this.blockSize.x * 0.05 + origin.x
        let y = this.blockSize.y * 0.05 + origin.y
        let w = this.blockSize.x * 0.9
        let h = this.blockSize.y * 0.9
        this.context.fillStyle = color
        this.context.fillRect(x,y,w,h)   
    }
    setBeginPoint(click){
        this.originPoint = this.indexFromClick(click)
        this.drawMap()
    }
    setDestinationPoint(click){
        this.destinyPoint = this.indexFromClick(click)
        this.drawMap()
    }
    indexFromClick(click){
        return Math.floor(click.offsetX / this.blockSize.x) + Math.floor(click.offsetY / this.blockSize.y) * this.numberOfBlocksPerLine
    }
    activeSearchMethod(name){
        if(name == 'dijkstra'){
            this.currentSearch = this.searchWithDijkstra.bind(this)
        }
        this.drawMap()
    }
    activeDrawingMethod(name){
        if(name == 'beginPoint')
            this.currentDrawing = this.setBeginPoint.bind(this)
        else if(name == 'destinationPoint')
            this.currentDrawing = this.setDestinationPoint.bind(this)
        else if(name == 'obstacle')
            this.currentDrawing = this.setValueForVertice.bind(this)
    }
    clickEvent(click){
        if(this.currentDrawing)
            this.currentDrawing(click)
    }
    setObstacleIntensity(value){
        if(value > 99)
            this.obstacleIntensity = Infinity
        else
            this.obstacleIntensity = value
    }
    setValueForVertice(click){
        let value = this.obstacleIntensity,
            index = this.indexFromClick(click),
            column = index % this.numberOfBlocksPerLine
        
        this.costVertices[index] = value

        if(index >= this.numberOfBlocksPerLine && index < (this.numberOfBlocks - this.numberOfBlocksPerLine)){
            if(column == 0){
                this.graph.createAdjacency(index+1, index, this.costVertices[index])
                this.graph.createAdjacency(index+this.numberOfBlocksPerLine, index, this.costVertices[index])
                this.graph.createAdjacency(index-this.numberOfBlocksPerLine, index, this.costVertices[index])
            }
            else if(column == (this.numberOfBlocksPerLine - 1)){
                this.graph.createAdjacency(index-1, index, this.costVertices[index])
                this.graph.createAdjacency(index+this.numberOfBlocksPerLine, index, this.costVertices[index])
                this.graph.createAdjacency(index-this.numberOfBlocksPerLine, index, this.costVertices[index])
            }
            else{
                this.graph.createAdjacency(index+1, index, this.costVertices[index])
                this.graph.createAdjacency(index-1, index, this.costVertices[index])
                this.graph.createAdjacency(index+this.numberOfBlocksPerLine, index, this.costVertices[index])
                this.graph.createAdjacency(index-this.numberOfBlocksPerLine, index, this.costVertices[index])
            }
        }
        else if(index < this.numberOfBlocksPerLine){
            if(column == 0){
                this.graph.createAdjacency(index + 1, index, this.costVertices[index])
                this.graph.createAdjacency(index+this.numberOfBlocksPerLine, index, this.costVertices[index])
            }
            else if(column == (this.numberOfBlocksPerLine - 1)){
                this.graph.createAdjacency(index - 1, index, this.costVertices[index])
                this.graph.createAdjacency(index+this.numberOfBlocksPerLine, index, this.costVertices[index])
            }
            else{
                this.graph.createAdjacency(index+1, index, this.costVertices[index])
                this.graph.createAdjacency(index-1, index, this.costVertices[index])
                this.graph.createAdjacency(index+this.numberOfBlocksPerLine, index, this.costVertices[index])
            }
        }
        else if(index >= (this.numberOfBlocks - this.numberOfBlocksPerLine)){
            if(column == 0){
                this.graph.createAdjacency(index+1, index, this.costVertices[index])
                this.graph.createAdjacency(index-this.numberOfBlocksPerLine, index, this.costVertices[index])
            }
            else if(column == (this.numberOfBlocksPerLine - 1)){
                this.graph.createAdjacency(index-1, index, this.costVertices[index])
                this.graph.createAdjacency(index-this.numberOfBlocksPerLine, index, this.costVertices[index])
            }
            else{
                this.graph.createAdjacency(index+1, index, this.costVertices[index])
                this.graph.createAdjacency(index-1, index, this.costVertices[index])
                this.graph.createAdjacency(index-this.numberOfBlocksPerLine, index, this.costVertices[index])
            }
        }
        this.drawMap()
    }
    disableSearchMethod(){
        this.currentSearch = null
        this.drawMap()
    }
    saveMap(fileName, mapName){
        let data = JSON.stringify({
            name: mapName,
            origin: this.originPoint, 
            destiny: this.destinyPoint}
        )
        fs.writeFile(fileName + '.json', data, error => {if(error) throw new Error(error)})        
        this.graph.savePajek(fileName)        
    }
}