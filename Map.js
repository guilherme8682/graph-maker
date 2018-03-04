var Graph = require('./Graph')

module.exports = class Map{
    constructor(canvas, size){
        this.canvas = canvas
        this.context = canvas.getContext('2d')
        canvas.height = 600
        canvas.width = 600
        this.numberOfBlocks = size
        this.numberOfBlocksPerLine = Math.ceil(Math.sqrt(this.numberOfBlocks))
        this.blockSize = {
            x:  canvas.width / this.numberOfBlocksPerLine,
            y: canvas.height / this.numberOfBlocksPerLine
        }
        this.makeMapGraph()
        this.drawMap()
    }
    searchWithDijkstra(from, to){
        this.graph.dijkstra(from, to, (rota, visitados) => {
            this.drawBlocks(visitados)
            this.drawRoute(rota)
        })
    }
    drawBlocks(list){
        if(!list)
            return
        console.log(list)
        list.forEach(item => this.drawSquare(item, 'rgba(0,0,0,0.5)'))
    }
    drawRoute(list){        
        var current = {
            x: (list[0] % this.numberOfBlocksPerLine * this.blockSize.x) + (this.blockSize.x / 2),
            y: (Math.floor(list[0] / this.numberOfBlocksPerLine) * this.blockSize.y) + (this.blockSize.y / 2)
        }
        this.context.strokeStyle = 'black'
        this.context.lineCap="round"
        this.context.lineWidth = this.blockSize.x / 10
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
            this.costVertices[i] = Math.floor(Math.random() * 100)

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
                this.graph.createAdjacency(i, i-1, 1)
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
        this.context.fillRect(0,0, 600, 600)
    }
    drawMap(){
        this.drawBackGround()
        var color = ''
        for(var i = 0; i < this.numberOfBlocks; ++i){
            let nColor = Math.floor((100 - this.costVertices[i]) / 100 * 255)
            this.drawSquare(i,'rgb(255,' + nColor + ',' + nColor + ')')
        }
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
        var r = this.blockSize.x / 3
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
}