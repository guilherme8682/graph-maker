/*module.exports = */class Graph{
    constructor(size, directed){
        this.directed = directed
        this.size = size

        this.vertices = []
        for(var i = 0; i < this.size; ++i)
            this.vertices[i] = {
                name: '',
                getName(){
                    return this.name
                },
                setName(name){
                    this.name = name
                }
            }        
        this.matrix = []
        for (var i = 0; i < this.size; ++i){
            this.matrix[i] = []
            for(var j = 0; j < this.size; ++j)
                this.matrix[i][j] = Infinity
        }
    }
    createAdjacency(from, to, cost){
        if(this.directed)
            this.matrix[from][to] = cost
        else        
            this.matrix[from][to] = cost
            this.matrix[to][from] = cost
    }
	removeAdjacency(from, to){
        if(this.directed)
            this.matrix[from][to] = Infinity
        else        
            this.matrix[from][to] = Infinity
            this.matrix[to][from] = Infinity       
    }
    setInformation(index, name){
        this.vertices[index].name = name
    }    
    printAdjacencys(){
        console.log('Adjacencys:')
        this.matrix.forEach((line) => {
            line.forEach((element) => process.stdout.write(element + ' '))
            process.stdout.write('\n')
        })
    }
    printVertices(){
        console.log('Vertices:')
        this.vertices.forEach((vertice, index) => console.log('index:',index,'name:',vertice.name))
    }
}

var a = new Graph(5, true)
a.printAdjacencys()
a.printVertices()