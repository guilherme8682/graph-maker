const { writeFileSync, readFileSync } = require('fs')

class Vertex{
    constructor(){
        this.name = ''        
    }
    getName(){
        return this.name
    }
    setName(name){
        this.name = name
    }
}
class Graph{
    constructor(size, directed){ //Overload: (path:String), (size:Number, directed:Boolean)
        if(typeof size == 'string' && !directed)
            this.loadPajek(size)
        else if(typeof size == 'number' && typeof directed == 'boolean')
            this.makeGraphBy(size, directed)
        else
            throw new Error('Missing parameter in Graph.')
    }
    makeGraphBy(size, directed){
        this.directed = directed
        this.size = size
        this.vertices = []
        for(let i = 0; i < this.size; ++i)
            this.vertices[i] = new Vertex()     
        this.matrix = new Array(this.size)
    }
    getCostAdjacency(from, to){
        if(!this.matrix[from] || !this.matrix[from][to])
            return Infinity
        else 
            return this.matrix[from][to]
    }
    createAdjacency(from, to, cost){
        if(cost == Infinity)
            this.removeAdjacency(from, to)
        else{
            if(!this.matrix[from])
                this.matrix[from] = new Array(this.size)
            if(this.directed)
                this.matrix[from][to] = cost
            else{
                this.matrix[from][to] = cost
                this.matrix[to][from] = cost
            }
        }
    }
	removeAdjacency(from, to){
        if(!this.matrix[from])
            return
        if(this.directed)
            delete this.matrix[from][to]
        else{
            delete this.matrix[from][to]
            delete this.matrix[to][from]
        }
    }
    setInformation(index, name){
        this.vertes[index].setName(name)
    }    
    printAdjacencys(){
        console.log('Adjacencys:')
        let currentCost
        for(let i = 0; i < this.size; ++i){
            for(let j = 0; j < this.size; ++j){
                currentCost = this.getCostAdjacency(i, j)
                process.stdout.write((currentCost == Infinity ? 'I' : currentCost) + ' ')
            }            
            process.stdout.write('\n')
        }
    }
    printVertices(){
        console.log('All vertex:')
        this.vertices.forEach((vertex, index) => console.log('index:',index,'name:',vertex.getName()))
    }
    dijkstra(s, t, callback){
        try {
            if(s < 0 || t >= this.size)
                throw 'Unsupported values'
            let MEMBRO = true
            let NAOMEMBRO = false
            let caminho = new Array(this.size)
            let distancia = new Array(this.size)
            let perm = new Array(this.size)
            let corrente, k = s, dc, j = 0
            let menordist, novadist
            //inicialização
            for (let i = 0; i < this.size; ++i) {
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
                for (let i = 0; i < this.size; i++) {
                    if (!perm[i]) {
                        novadist = dc + this.getCostAdjacency(corrente, i)                        
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
            //Tratando resultados
            let i = t, rota = [t]
            while(i != s){
                rota.unshift(caminho[i])
                i = caminho[i]
            }
            let visitados = []
            perm.forEach( (item, index) => {
                if(item)
                    visitados.push(index)
            })
            callback(rota, visitados)
            return caminho
        }
        catch (error) {
            throw(new Error(error))
        }
    }
    savePajek(fileName){
        let data = ''
        
        data += '*Vertices  ' + this.size + '\n';
        this.vertices.forEach((vertice, index) =>{
            data += (index + 1) + ' "' + vertice.getName() + '"\n'
        })
        if (this.directed) {
            data += '*Arcs \n'
            for (let i = 0; i < this.size; i++){
                for (let j = 0; j < this.size; j++){
                    if (this.getCostAdjacency(i, j) != Infinity){
                        data += (i + 1) + ' ' + (j + 1) + ' ' + this.getCostAdjacency(i, j) + '\n'
                    }
                }
            }
        }
        else {
            data += '*Edges \n'
            for (let i = 0; i < this.size; i++){
                for (let j = i; j < this.size; j++){
                    if (this.getCostAdjacency(i, j) != Infinity){
                        data += (i + 1) + ' ' + (j + 1) + ' ' + this.getCostAdjacency(i, j) + '\n'
                    }
                }
            }
        }
        writeFileSync(fileName + '.net', data)
    }
    loadPajek(fileName){        
        let data           
        data = readFileSync(fileName + '.net', 'utf8').split('\n')
        this.size = Number(data[0].match(/\d+/)[0])
        this.matrix = new Array(this.size)
        let index = 0
        let name = ''
        let currentLine  = 1
        this.vertices = []
        for(; currentLine < data.length; currentLine++){
            if(data[currentLine] == '')
                continue
            if(data[currentLine][0] == '*')
                break
            index = Number(data[currentLine].match(/^\d+/g)[0]) - 1
            name = data[currentLine].match(/".*"/g)[0]
            name = name.substr(1,name.length - 2)
            this.vertices[index] = {
                name: name,
                getName(){
                    return this.name
                },
                setName(name){
                    this.name = name
                }
            }
        }
        if(data[currentLine].search(/Arcs/) != -1)
            this.directed = true
        else if(data[currentLine].search(/Edges/) != -1)
            this.directed = false
        else
            throw new Error('Propriedade do arquivo nao compreendida.')        
        
        let fromToCost = []
        for (currentLine++; currentLine < data.length; currentLine++) {
            if(data[currentLine] == '')
                continue
            fromToCost = data[currentLine].split(' ')            
            this.createAdjacency(fromToCost[0] - 1, fromToCost[1] - 1, fromToCost[2])            
        }
    }
}

module.exports.Graph = Graph