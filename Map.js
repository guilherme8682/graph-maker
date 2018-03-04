var Graph = require('./Graph')

module.exports = class Map{
    constructor(canvas, size){
        this.canvas = canvas
        this.context = canvas.getContext('2d')
        canvas.height = 600
        canvas.width = 600
        this.numberOfBlocks = size
        this.numberOfBlocksPerLine = Math.sqrt(this.numberOfBlocks)
        this.blockSize = {
            x:  canvas.width / this.numberOfBlocksPerLine,
            y: canvas.height / this.numberOfBlocksPerLine
        }
        this.makeMapGraph()
        this.drawBackGround()
        this.drawMap()
        this.graph.dijkstra(51, 58, (rota, visitados) => {
            this.drawBlocks(visitados)
            this.drawRoute(rota)
        })
    }
    drawBlocks(list){
        if(!list)
            return
        list.forEach(item => this.drawSquare(item, 'DarkOrange'))
    }
    drawRoute(list){
        list.forEach((item, index, list) => this.traceLine(list[index], list[index + 1]))
    }
    traceLine(from, to){
        var begin = {
            x: (from % this.numberOfBlocksPerLine * this.blockSize.x) + (this.blockSize.x / 2),
            y: (Math.floor(from / this.numberOfBlocksPerLine) * this.blockSize.y) + (this.blockSize.y / 2)
        }
        var end = {
            x: (to % this.numberOfBlocksPerLine * this.blockSize.x) + (this.blockSize.x / 2),
            y: (Math.floor(to / this.numberOfBlocksPerLine) * this.blockSize.y) + (this.blockSize.y / 2)
        }

        this.context.strokeStyle = 'black'
        this.context.lineWidth = this.blockSize.x / 10;
        this.context.moveTo(begin.x,begin.y);
        this.context.lineTo(end.x,end.y);
        this.context.stroke();
    }
    makeMapGraph(){
        this.graph = new Graph(this.numberOfBlocks, true)
        for(var i = 0; i < this.numberOfBlocksPerLine; i++){
            var column = i % this.numberOfBlocksPerLine
            if(column == 0){
                this.graph.createAdjacency(i, i+1, 1)
                this.graph.createAdjacency(i, i+this.numberOfBlocksPerLine, 1)
            }
            else if(column == (this.numberOfBlocksPerLine - 1)){
                this.graph.createAdjacency(i, i-1, 1)
                this.graph.createAdjacency(i, i+this.numberOfBlocksPerLine, 1)
            }
            else{
                this.graph.createAdjacency(i, i+1, 1)
                this.graph.createAdjacency(i, i-1, 1)
                this.graph.createAdjacency(i, i+this.numberOfBlocksPerLine, 1)
            }
        }
        for(var i = this.numberOfBlocksPerLine; i  < this.numberOfBlocks - this.numberOfBlocksPerLine; i++){
            var column = i % this.numberOfBlocksPerLine
            if(column == 0){
                this.graph.createAdjacency(i, i+1, 1)
                this.graph.createAdjacency(i, i+this.numberOfBlocksPerLine, 1)
                this.graph.createAdjacency(i, i-this.numberOfBlocksPerLine, 1)
            }
            else if(column == (this.numberOfBlocksPerLine - 1)){
                this.graph.createAdjacency(i, i-1, 1)
                this.graph.createAdjacency(i, i+this.numberOfBlocksPerLine, 1)
                this.graph.createAdjacency(i, i-this.numberOfBlocksPerLine, 1)
            }
            else{
                this.graph.createAdjacency(i, i+1, 1)
                this.graph.createAdjacency(i, i-1, 1)
                this.graph.createAdjacency(i, i+this.numberOfBlocksPerLine, 1)
                this.graph.createAdjacency(i, i-this.numberOfBlocksPerLine, 1)
            }
        }
        for(var i = this.numberOfBlocks - this.numberOfBlocksPerLine; i < this.numberOfBlocks; i++){
            var column = i % this.numberOfBlocksPerLine
            if(column == 0){
                this.graph.createAdjacency(i, i+1, 1)
                this.graph.createAdjacency(i, i-this.numberOfBlocksPerLine, 1)
            }
            else if(column == (this.numberOfBlocksPerLine - 1)){
                this.graph.createAdjacency(i, i-1, 1)
                this.graph.createAdjacency(i, i-this.numberOfBlocksPerLine, 1)
            }
            else{
                this.graph.createAdjacency(i, i+1, 1)
                this.graph.createAdjacency(i, i-1, 1)
                this.graph.createAdjacency(i, i-this.numberOfBlocksPerLine, 1)
            }        
        }

    }
    drawBackGround(){
        this.context.fillStyle = 'PaleTurquoise'
        this.context.fillRect(0,0, 600, 600)
    }
    drawMap(){
        for(var i = 0; i < this.numberOfBlocks; ++i)
            this.drawSquare(i,'RoyalBlue')
    }
    drawSquare(index, color){
        var origin = {
            x: (index % this.numberOfBlocksPerLine * this.blockSize.x),
            y: (Math.floor(index / this.numberOfBlocksPerLine) * this.blockSize.y)
        }
        var rectX = this.blockSize.x * 0.05 + origin.x
        var rectY = this.blockSize.y * 0.05 + origin.y
        var rectWidth = this.blockSize.x * 0.9
        var rectHeight = this.blockSize.y * 0.9

        var cornerRadius = 20;
        this.context.fillStyle = color
        this.context.strokeStyle = color
        this.context.lineJoin = "round";
        this.context.lineWidth = cornerRadius;
        this.context.strokeRect(rectX+(cornerRadius/2), rectY+(cornerRadius/2), rectWidth-cornerRadius, rectHeight-cornerRadius);
        this.context.fillRect(rectX+(cornerRadius/2), rectY+(cornerRadius/2), rectWidth-cornerRadius, rectHeight-cornerRadius);
    }
}
