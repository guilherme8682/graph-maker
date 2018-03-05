var Graph = require('./Graph')

module.exports = class Map{
    constructor(canvas, size){
        this.canvas = canvas
        this.context = canvas.getContext('2d')
        this.numberOfBlocks = size
        
        this.currentSearch = null
        this.currentDrawing = this.setBeginPoint.bind(this)
        this.originPoint = 0
        this.destinyPoint = size - 1
        this.obstacleIntensity = 50

        this.refreshScreen(true)
        this.makeMapGraph()
        this.drawMap()
    }
    refreshScreen(fristTime){
        var height = window.innerHeight - 5,
            width = window.innerWidth - 300,
            resolution = height < width ? height : width
        if(resolution < 600)
            resolution = 600
        
        this.canvas.height = resolution
        this.canvas.width = resolution
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
        })
        this.currentSearch = this.searchWithDijkstra.bind(this)
    }
    drawBlocks(list){
        if(!list)
            return
        list.forEach(item => this.drawSquare(item, 'rgba(0,0,0,0.5)'))
    }
    drawRoute(list){
        var current = {
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
    makeMapGraph(){
        this.graph = new Graph(this.numberOfBlocks, true)
        this.costVertices = []
        for (var i = 0; i < this.numberOfBlocks; i++)
            this.costVertices[i] = 1//Math.floor(Math.random() * 100)

        for(var i = 0; i < this.numberOfBlocksPerLine; i++){
            var column = i % this.numberOfBlocksPerLine
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
        for(var i = this.numberOfBlocksPerLine; i  < this.numberOfBlocks - this.numberOfBlocksPerLine; i++){
            var column = i % this.numberOfBlocksPerLine
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
        for(var i = this.numberOfBlocks - this.numberOfBlocksPerLine; i < this.numberOfBlocks; i++){
            var column = i % this.numberOfBlocksPerLine
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
    drawBackGround(){
        this.context.fillStyle = 'PaleTurquoise'
        this.context.fillRect(0,0, this.canvas.width, this.canvas.height)
    }
    drawMap(){
        this.drawBackGround()
        var color = ''
        for(var i = 0; i < this.numberOfBlocks; ++i){
            let nColor = this.costVertices[i] == Infinity ? 0:Math.floor((100 - this.costVertices[i]) / 100 * 255)
            this.drawSquare(i,'rgb(255,' + nColor + ',' + nColor + ')')
        }        
        this.drawSquare(this.originPoint, 'LawnGreen')
        this.drawSquare(this.destinyPoint, 'DodgerBlue')        
        if(this.currentSearch)
            this.currentSearch()
    }
    drawSquare(index, color){
        var origin = {
            x: (index % this.numberOfBlocksPerLine * this.blockSize.x),
            y: (Math.floor(index / this.numberOfBlocksPerLine) * this.blockSize.y)
        }
        var x = this.blockSize.x * 0.05 + origin.x
        var y = this.blockSize.y * 0.05 + origin.y
        var w = this.blockSize.x * 0.9
        var h = this.blockSize.y * 0.9
        var r = this.blockSize.x / 5
        this.context.fillStyle = color
        this.context.strokeStyle = color
        this.context.beginPath(); 
        this.context.moveTo(x+r, y);
        this.context.lineTo(x+w-r, y);
        this.context.quadraticCurveTo(x+w, y, x+w, y+r);
        this.context.lineTo(x+w, y+h-r);
        this.context.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
        this.context.lineTo(x+r, y+h);
        this.context.quadraticCurveTo(x, y+h, x, y+h-r);
        this.context.lineTo(x, y+r);
        this.context.quadraticCurveTo(x, y, x+r, y);
        this.context.fill();        
    }
    setBeginPoint(click){
        this.originPoint = this.indexFromClick(click)
        this.refreshScreen()
    }
    setDestinationPoint(click){        
        this.destinyPoint = this.indexFromClick(click)
        this.refreshScreen()
    }
    indexFromClick(click){
        return Math.floor(click.offsetX / this.blockSize.x) + Math.floor(click.offsetY / this.blockSize.y) * this.numberOfBlocksPerLine
    }
    activeSearchMethod(name){
        if(name == 'dijkstra'){
            this.currentSearch = this.searchWithDijkstra.bind(this)
        }
        this.refreshScreen()
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
        var value = this.obstacleIntensity,
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
}