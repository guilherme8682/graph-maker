const { writeFileSync, readFileSync } = require('fs')

class Vertex{
    constructor(name){
        if(name)
            this.setName(name)
        else
            this.setName('')
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
        this.matrix = []
    }
    getCostAdjacency(from, to){
        if(!this.matrix[from] || !this.matrix[from][to])
            return Infinity
        else 
            return this.matrix[from][to]
    }
    createAdjacency(from, to, value){
        let cost = Number(value)
        if(cost == NaN)
            throw new Error('Invalid parameters') 
        if(cost == Infinity)
            this.removeAdjacency(from, to)
        else{
            if(!this.matrix[from])
                this.matrix[from] = []
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
        let currentCost, line
        for(let i = 0; i < this.size; ++i){
            line = ''
            for(let j = 0; j < this.size; ++j){
                currentCost = this.getCostAdjacency(i, j)
                line += (currentCost == Infinity ? 'I' : currentCost) + ' '
            }            
            console.log(line)
        }
    }
    printVertices(){
        console.log('All vertex::\n')
        this.vertices.forEach((vertex, index) => console.log('index:',index,'name:',vertex.getName()))
    }
    neighbors(vertex){
        let list = []
        for(let i = 0; i < this.size; ++i)
            if(this.getCostAdjacency(vertex, i) != Infinity)
                list.push(i)        
        return list
    }
    dijkstra(origin, destiny){
        if(origin < 0 || destiny >= this.size)
            throw 'Unsupported values'
        let MEMBRO = true
        let NAOMEMBRO = false
        let caminho = []
        let distancia = []
        let perm = []
        let corrente, k = origin, dc, j = 0
        let menordist, novadist
        //Variaveis de tratamento            
        let g = destiny, route = [destiny], cont = 0, visited = []
        //inicialização
        for (let i = 0; i < this.size; ++i) {
            perm[i] = NAOMEMBRO
            distancia[i] = Infinity
            caminho[i] = -1
        }
        perm[origin] = MEMBRO
        distancia[origin] = 0
        corrente = origin
        while (corrente != destiny) {
            menordist = Infinity
            dc = distancia[corrente]
            for (let i = 0; i < this.size; ++i) {
                if (!perm[i]) {
                    novadist = dc + this.getCostAdjacency(corrente, i)
                    if (novadist < distancia[i]) {

                        distancia[i] = novadist
                        caminho[i] = corrente
                    }
                    if (distancia[i] < menordist) {
                        menordist = distancia[i]
                        k = i
                    }
                }
            }
            if(corrente == k){  //Busca impossivel
                route = []
                g = origin
                break
            }
            corrente = k
            perm[corrente] = MEMBRO
        }
        //Tratando resultados
        while(g != origin && cont < this.size){
            route.unshift(caminho[g])
            g = caminho[g]
            cont++
        }
        perm.forEach( (item, index) => {
            if(item)
                visited.push(index)
        })
        return {route, visited}
    }
    
    breadth(origin, destiny){
        if(origin < 0 || destiny >= this.size)
            throw 'Unsupported values'
        let MEMBRO = true
        let NAOMEMBRO = false
        let caminho = []
        let distancia = []
        let perm = []
        let corrente, k = origin, dc, j = 0
        let menordist, novadist
        //Variaveis de tratamento            
        let g = destiny, route = [destiny], cont = 0, visited = []
        //inicialização
        for (let i = 0; i < this.size; ++i) {
            perm[i] = NAOMEMBRO
            distancia[i] = Infinity
            caminho[i] = -1
        }
        perm[origin] = MEMBRO
        distancia[origin] = 0
        corrente = origin
        while (corrente != destiny) {
            menordist = Infinity
            dc = distancia[corrente]
            for (let i = 0; i < this.size; ++i) {
                if (!perm[i]) {
                    novadist = dc + (this.getCostAdjacency(corrente, i) == Infinity ? Infinity : 1)
                    if (novadist < distancia[i]) {

                        distancia[i] = novadist
                        caminho[i] = corrente
                    }
                    if (distancia[i] < menordist) {
                        menordist = distancia[i]
                        k = i
                    }
                }
            }
            if(corrente == k){  //Busca impossivel
                route = []
                g = origin
                break
            }
            corrente = k
            perm[corrente] = MEMBRO
        }
        //Tratando resultados
        while(g != origin && cont < this.size){
            route.unshift(caminho[g])
            g = caminho[g]
            cont++
        }
        perm.forEach( (item, index) => {
            if(item)
                visited.push(index)
        })
        return {route, visited}
    }
    
    heuristic(from, to){
        //Manhattan distance on a square grid
        //Specific to a map structure
        let length = Math.ceil(Math.sqrt(this.size))
        let a = {x: from % length,y: Math.floor(from / length)}
        let b = {x: to % length,y: Math.floor(to / length)}
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
    }    
    greedy(origin, destiny){        
        if(origin < 0 || destiny >= this.size)
            throw 'Unsupported values'
        let MEMBRO = true
        let NAOMEMBRO = false
        let caminho = []
        let distancia = []
        let perm = []
        let corrente, k = origin, dc, j = 0
        let menordist, novadist
        //Variaveis de tratamento            
        let g = destiny, route = [destiny], cont = 0, visited = []
        //inicialização
        for (let i = 0; i < this.size; ++i) {
            perm[i] = NAOMEMBRO
            distancia[i] = Infinity
            caminho[i] = -1
        }
        perm[origin] = MEMBRO
        distancia[origin] = this.heuristic(origin, destiny)
        corrente = origin
        while (corrente != destiny) {
            menordist = Infinity
            dc = distancia[corrente]
            for (let i = 0; i < this.size; ++i) {
                if (!perm[i]) {
                    novadist = (this.getCostAdjacency(corrente, i) == Infinity ? Infinity : this.heuristic(i, destiny))
                    if (novadist < distancia[i]) {
                        distancia[i] = novadist
                        caminho[i] = corrente
                    }
                    if (distancia[i] < menordist) {
                        menordist = distancia[i]
                        k = i
                    }
                }
            }
            if(corrente == k){  //Busca impossivel
                route = []
                g = origin
                break
            }
            corrente = k
            perm[corrente] = MEMBRO
        }
        //Tratando resultados
        while(g != origin && cont < this.size){
            route.unshift(caminho[g])
            g = caminho[g]
            cont++
        }
        perm.forEach( (item, index) => {
            if(item)
                visited.push(index)
        })
        return {route, visited}
    }    
    astar(origin, destiny){
        if(origin < 0 || destiny >= this.size)
            throw 'Unsupported values'
        let MEMBRO = true
        let NAOMEMBRO = false
        let caminho = []
        let distancia = []
        let perm = []
        let corrente, k = origin, dc, j = 0
        let menordist, novadist
        //Variaveis de tratamento            
        let g = destiny, route = [destiny], cont = 0, visited = []
        //inicialização
        for (let i = 0; i < this.size; ++i) {
            perm[i] = NAOMEMBRO
            distancia[i] = Infinity
            caminho[i] = -1
        }
        perm[origin] = MEMBRO
        distancia[origin] = 0
        corrente = origin
        while (corrente != destiny) {
            menordist = Infinity
            dc = distancia[corrente]
            for (let i = 0; i < this.size; ++i) {
                if (!perm[i]) {
                    novadist =  dc + this.getCostAdjacency(corrente, i) + this.heuristic(i, destiny)
                    if (novadist < distancia[i]) {

                        distancia[i] = novadist
                        caminho[i] = corrente
                    }
                    if (distancia[i] < menordist) {
                        menordist = distancia[i]
                        k = i
                    }
                }
            }
            if(corrente == k){  //Busca impossivel
                route = []
                g = origin
                break
            }
            corrente = k
            perm[corrente] = MEMBRO
        }
        //Tratando resultados
        while(g != origin && cont < this.size){
            route.unshift(caminho[g])
            g = caminho[g]
            cont++
        }
        perm.forEach( (item, index) => {
            if(item)
                visited.push(index)
        })
        return {route, visited}
    }
    savePajek(fileName){
        let data = '*Vertices  ' + this.size + '\n';
        this.vertices.forEach((vertice, index) =>{
            data += (index + 1) + ' "' + vertice.getName() + '"\n'
        })
        if (this.directed) {
            data += '*Arcs \n'
            for (let i = 0; i < this.size; ++i){
                for (let j = 0; j < this.size; ++j){
                    if (this.getCostAdjacency(i, j) != Infinity){
                        data += (i + 1) + ' ' + (j + 1) + ' ' + this.getCostAdjacency(i, j) + '\n'
                    }
                }
            }
        }
        else {
            data += '*Edges \n'
            for (let i = 0; i < this.size; ++i){
                for (let j = i; j < this.size; ++j){
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
        this.matrix = []
        let index = 0
        let name = ''
        let currentLine  = 1
        this.vertices = []
        for(; currentLine < data.length; ++currentLine){
            if(data[currentLine] == '')
                continue
            if(data[currentLine][0] == '*')
                break
            index = Number(data[currentLine].match(/^\d+/g)[0]) - 1
            name = data[currentLine].match(/".*"/g)[0]
            name = name.substr(1,name.length - 2)
            this.vertices[index] = new Vertex(name)            
        }
        if(data[currentLine].search(/Arcs/) != -1)
            this.directed = true
        else if(data[currentLine].search(/Edges/) != -1)
            this.directed = false
        else
            throw new Error('Propriedade do arquivo nao compreendida.')        
        
        let fromToCost = []
        for (currentLine++; currentLine < data.length; ++currentLine) {
            if(data[currentLine] == '')
                continue
            fromToCost = data[currentLine].split(' ')            
            this.createAdjacency(fromToCost[0] - 1, fromToCost[1] - 1, fromToCost[2])            
        }
    }
}

module.exports.Graph = Graph
module.exports.Vertex = Vertex