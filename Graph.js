module.exports = class Graph{
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
        else{
            this.matrix[from][to] = cost
            this.matrix[to][from] = cost
        }
    }
	removeAdjacency(from, to){
        if(this.directed)
            this.matrix[from][to] = Infinity
        else{
            this.matrix[from][to] = Infinity
            this.matrix[to][from] = Infinity
        }
    }
    setInformation(index, name){
        this.vertices[index].name = name
    }    
    printAdjacencys(){
        console.log('Adjacencys:')
        this.matrix.forEach((line) => {
            line.forEach((element) => process.stdout.write((element == Infinity ? 'I' : element) + ' '))
            process.stdout.write('\n')
        })
    }
    printVertices(){
        console.log('Vertices:')
        this.vertices.forEach((vertice, index) => console.log('index:',index,'name:',vertice.name))
    }
    dijkstra(s, t){
        var MEMBRO = true
        var NAOMEMBRO = false
        var caminho = new Array(this.size)
        var distancia = new Array(this.size)
        var perm = new Array(this.size)
        var corrente, k = s, dc, j = 0
        var menordist, novadist
        //inicialização
        for (var i = 0; i < this.size; ++i) {
            perm[i] = NAOMEMBRO
            distancia[i] = Infinity
            caminho[i] = -1
        }
        perm[s] = MEMBRO
        distancia[s] = 0
        corrente = s
        while (corrente != t) {
            menordist = Infinity
            dc = distancia[corrente]
            for (var i = 0; i < this.size; i++) {
                if (!perm[i]) {
                    novadist = dc + this.matrix[corrente][i]
                    if (novadist < distancia[i]) {

                        distancia[i] = novadist
                        caminho[i] = corrente
                    }
                    if (distancia[i] < menordist) {
                        menordist = distancia[i]
                        k = i;
                    }
                }
            }
            corrente = k;
            perm[corrente] = MEMBRO;
        }        
        var i = t, result = [t]
        while(i != s){
            result.unshift(caminho[i])
            i = caminho[i]
        }
        return result;
 
    }
}