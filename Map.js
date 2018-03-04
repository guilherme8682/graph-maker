var Graph = require('./Graph')

module.exports = class Map{
    constructor(canvas){
        this.canvas = canvas
        this.context = canvas.getContext('2d')
        canvas.height = 600
        canvas.width = 600

        this.numberOfBlocks = 16
        this.numberOfBlocksPerLine = Math.sqrt(this.numberOfBlocks)
        this.blockSize = {
            x:  canvas.width / this.numberOfBlocksPerLine,
            y: canvas.height / this.numberOfBlocksPerLine
        }

        this.makeMapGraph()
        this.drawBackGround()
        this.drawMap()
    }
    makeMapGraph(){
        this.graph = new Graph(this.numberOfBlocks, true)

        /*for(var i = this.numberOfBlocksPerLine; i  < this.numberOfBlocks - this.numberOfBlocksPerLine; i++){


        }*/

    }
    drawBackGround(){
        this.context.fillStyle = 'PaleTurquoise'
        this.context.fillRect(0,0, 600, 600)
    }  
    drawSquare(context, rectX, rectY, rectWidth, rectHeight, color){
        var cornerRadius = 20;
        context.fillStyle = color
        context.strokeStyle = color
        context.lineJoin = "round";
        context.lineWidth = cornerRadius;
        context.strokeRect(rectX+(cornerRadius/2), rectY+(cornerRadius/2), rectWidth-cornerRadius, rectHeight-cornerRadius);
        context.fillRect(rectX+(cornerRadius/2), rectY+(cornerRadius/2), rectWidth-cornerRadius, rectHeight-cornerRadius);
    }
    drawMap(){
        var color = 'RoyalBlue'
        var rectX = this.blockSize.x * 0.05
        var rectY = this.blockSize.y * 0.05
        var rectWidth = this.blockSize.x * 0.9
        var rectHeight = this.blockSize.y * 0.9

        for(var i = 0; i < this.numberOfBlocksPerLine; i++){
            rectY = this.blockSize.y * 0.05 + i * this.blockSize.y
            for(var j = 0; j < this.numberOfBlocksPerLine; j++){
                rectX = this.blockSize.x * 0.05 + j * this.blockSize.x
                this.drawSquare(this.context, rectX, rectY, rectWidth, rectHeight, color)
            }
        }
    }
}