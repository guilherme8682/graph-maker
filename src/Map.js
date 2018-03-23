const { Graph } = require('./Graph')
const { readFileSync, writeFile } = require('fs')

class Map{ // Overload: (canvas:Canvas, size:Number), (canvas:Canvas, fileName:String)
    constructor(canvas, size){
        if(!canvas)
            throw new Error('Missing parameter in Map.')
        this.canvas = canvas
        this.context = []
        this.canvas.forEach(item => this.context.push(item.getContext('2d')))
        this.name = ''
        this.currentSearch = this.searchWithDijkstra.bind(this)
        this.currentDrawing = this.setBeginPoint.bind(this)
        this.originPoint = 0
        this.destinyPoint = size - 1
        this.obstacleIntensity = 50
        this.searchEnable = false
        this.sendSearchData = null
        if(typeof size == 'number')
            this.makeRandomGraph(size)
        else if(typeof size == 'string')
            this.loadGraphFromFile(size)
        else
            throw new Error('Missing parameter in Map.')
        this.drawL1()
        this.drawL2()
        this.drawL3()
    }
    makeRandomGraph(size){
        this.numberOfBlocks = size
        this.refreshScreen(true)
        this.graph = new Graph(this.numberOfBlocks, true)
        this.costVertices = []
        for (let i = 0; i < this.numberOfBlocks; i++)
            this.costVertices[i] = Math.floor(Math.random() * 99 + 1)
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
        let height = window.innerHeight - 80,
            width = window.innerWidth - 270,
            resolution = height < width ? height : width
        if(resolution < 430)
            resolution = 600        
        if(this.resolution == resolution)        
            return
        else
            this.resolution = resolution
        this.canvas.forEach(item => {
            item.height = this.resolution
            item.width = this.resolution
        })
        this.numberOfBlocksPerLine = Math.ceil(Math.sqrt(this.numberOfBlocks))
        this.blockSize = {
            x:  this.canvas[0].width / this.numberOfBlocksPerLine,
            y: this.canvas[0].height / this.numberOfBlocksPerLine
            
        }
        if(fristTime)
            return
        this.drawL1()
        this.drawL2()
        this.drawL3()
    }
    setSendSearchData(func){
        this.sendSearchData = func
    }
    proccesSearch(route, visited){
        this.drawBlocks(visited)
        this.drawRoute(route)
        let pathCost = route.reduce((before, current) => before + this.costVertices[current],0)
        if(this.sendSearchData)
            this.sendSearchData(route.length, pathCost, visited.length)
    }
    searchWithDijkstra(){
        this.graph.dijkstra(this.originPoint, this.destinyPoint, this.proccesSearch.bind(this))
    }
    searchWithBreadth(){
        this.graph.breadth(this.originPoint, this.destinyPoint, this.proccesSearch.bind(this))
    }
    searchWithGreedy(){
        this.graph.greedy(this.originPoint, this.destinyPoint, this.proccesSearch.bind(this))
    }
    searchWithAStar(){
        this.graph.astar(this.originPoint, this.destinyPoint, this.proccesSearch.bind(this))
    }
    drawBlocks(list){
        if(!list)
            return
        list.forEach(item => this.drawSquare(item, 'rgba(0,0,0,0.5)', 2))
    }
    drawRoute(list){
        let current = {
            x: (list[0] % this.numberOfBlocksPerLine * this.blockSize.x) + (this.blockSize.x / 2),
            y: (Math.floor(list[0] / this.numberOfBlocksPerLine) * this.blockSize.y) + (this.blockSize.y / 2)
        }
        this.context[2].strokeStyle = 'white'
        this.context[2].lineCap="round"
        this.context[2].lineWidth = this.blockSize.x / 4
        this.context[2].beginPath()
        this.context[2].moveTo(current.x, current.y)
        for (let i = 1; i < list.length; i++) {
            current = {
                x: (list[i] % this.numberOfBlocksPerLine * this.blockSize.x) + (this.blockSize.x / 2),
                y: (Math.floor(list[i] / this.numberOfBlocksPerLine) * this.blockSize.y) + (this.blockSize.y / 2)
            }
            this.context[2].lineTo(current.x, current.y)
        }        
        this.context[2].stroke()
    }
    drawL1(){
        let nColor = 0
        this.context[0].clearRect(0, 0, this.canvas[0].width, this.canvas[0].height)
        for(let i = 0; i < this.numberOfBlocks; ++i){
            nColor = this.costVertices[i] == Infinity ? 0:Math.floor((100 - this.costVertices[i]) / 100 * 255)
            this.drawSquare(i,'rgb(255,' + (Math.ceil(0.68 * nColor) + 173) + ',' + nColor + ')', 0)
        }        
    }
    drawL2(){
        this.context[1].clearRect(0, 0, this.canvas[1].width, this.canvas[1].height)
        this.drawSquare(this.originPoint, 'LawnGreen', 1)
        this.drawSquare(this.destinyPoint, 'DodgerBlue', 1)
    }
    drawL3(){
        this.context[2].clearRect(0, 0, this.canvas[2].width, this.canvas[2].height)
        if(this.currentSearch && this.searchEnable)
            this.currentSearch()
    }

    drawSquare(index, color, layer){
        let origin = {
            x: (index % this.numberOfBlocksPerLine * this.blockSize.x),
            y: (Math.floor(index / this.numberOfBlocksPerLine) * this.blockSize.y)
        }
        let x = this.blockSize.x * 0.05 + origin.x
        let y = this.blockSize.y * 0.05 + origin.y
        let w = this.blockSize.x * 0.9
        let h = this.blockSize.y * 0.9
        this.context[layer].fillStyle = color
        this.context[layer].fillRect(x,y,w,h)
    }
    setBeginPoint(click){
        this.originPoint = this.indexFromClick(click)
        this.drawL2()
        this.drawL3()
    }
    setDestinationPoint(click){
        this.destinyPoint = this.indexFromClick(click)
        this.drawL2()
        this.drawL3()
    }
    indexFromClick(click){
        return Math.floor(click.offsetX / this.blockSize.x) + Math.floor(click.offsetY / this.blockSize.y) * this.numberOfBlocksPerLine
    }
    activeSearchMethod(name){
        if(name == '0')
            this.currentSearch = this.searchWithDijkstra.bind(this)
        else if(name == '1')
            this.currentSearch = this.searchWithBreadth.bind(this)
        else if(name == '2')
            this.currentSearch = this.searchWithGreedy.bind(this)
        else if(name == '3')
            this.currentSearch = this.searchWithAStar.bind(this)
        else
            throw new Error('Search method not found.')
        this.drawL3()
    }
    activeDrawingMethod(name){
        if(name == 'beginPoint')
            this.currentDrawing = this.setBeginPoint.bind(this)
        else if(name == 'destinynPoint')
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
        let nColor = this.costVertices[index] == Infinity ? 0:Math.floor((100 - this.costVertices[index]) / 100 * 255)
        this.drawSquare(index,'rgb(255,' + (Math.ceil(0.68 * nColor) + 173) + ',' + nColor + ')', 0)
        this.drawL3()
    }
    disableSearchMethod(){
        this.currentSearch = null
        this.drawL3()
    }
    saveMap(fileName, mapName){
        let data = JSON.stringify({
            name: mapName,
            origin: this.originPoint, 
            destiny: this.destinyPoint}
        )
        writeFile(fileName + '.json', data, error => {if(error) throw new Error(error)})        
        this.graph.savePajek(fileName)        
    }
}

module.exports.Map = Map