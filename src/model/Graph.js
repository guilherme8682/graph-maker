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
    dijkstraJS(){


    }

    dijkstra(s, t, callback){
        if(s < 0 || t >= this.size)
            throw 'Unsupported values'
        let MEMBRO = true
        let NAOMEMBRO = false
        let caminho = []
        let distancia = []
        let perm = []
        let corrente, k = s, dc, j = 0
        let menordist, novadist
        //Variaveis de tratamento            
        let g = t, rota = [t], cont = 0, visitados = []
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
                rota = []
                g = s
                break
            }
            corrente = k
            perm[corrente] = MEMBRO
        }
        //Tratando resultados
        while(g != s && cont < this.size){
            rota.unshift(caminho[g])
            g = caminho[g]
            cont++
        }
        perm.forEach( (item, index) => {
            if(item)
                visitados.push(index)
        })
        if(callback)                
            callback(rota, visitados)
        return caminho
    }
    
    breadth(s, t, callback){
        if(s < 0 || t >= this.size)
            throw 'Unsupported values'
        let MEMBRO = true
        let NAOMEMBRO = false
        let caminho = []
        let distancia = []
        let perm = []
        let corrente, k = s, dc, j = 0
        let menordist, novadist
        //Variaveis de tratamento            
        let g = t, rota = [t], cont = 0, visitados = []
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
                rota = []
                g = s
                break
            }
            corrente = k
            perm[corrente] = MEMBRO
        }
        //Tratando resultados
        while(g != s && cont < this.size){
            rota.unshift(caminho[g])
            g = caminho[g]
            cont++
        }
        perm.forEach( (item, index) => {
            if(item)
                visitados.push(index)
        })
        if(callback)                
            callback(rota, visitados)
        return caminho
    }
    
    heuristic(from, to){
        //Manhattan distance on a square grid
        //Specific to a map structure
        let length = Math.ceil(Math.sqrt(this.size))
        let a = {x: from % length,y: Math.floor(from / length)}
        let b = {x: to % length,y: Math.floor(to / length)}
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
    }    
    greedy(s, t, callback){        
        if(s < 0 || t >= this.size)
            throw 'Unsupported values'
        let MEMBRO = true
        let NAOMEMBRO = false
        let caminho = []
        let distancia = []
        let perm = []
        let corrente, k = s, dc, j = 0
        let menordist, novadist
        //Variaveis de tratamento            
        let g = t, rota = [t], cont = 0, visitados = []
        //inicialização
        for (let i = 0; i < this.size; ++i) {
            perm[i] = NAOMEMBRO
            distancia[i] = Infinity
            caminho[i] = -1
        }
        perm[s] = MEMBRO
        distancia[s] = this.heuristic(s, t)
        corrente = s
        while (corrente != t) {
            menordist = Infinity
            dc = distancia[corrente]
            for (let i = 0; i < this.size; ++i) {
                if (!perm[i]) {
                    novadist = (this.getCostAdjacency(corrente, i) == Infinity ? Infinity : this.heuristic(i, t))
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
                rota = []
                g = s
                break
            }
            corrente = k
            perm[corrente] = MEMBRO
        }
        //Tratando resultados
        while(g != s && cont < this.size){
            rota.unshift(caminho[g])
            g = caminho[g]
            cont++
        }
        perm.forEach( (item, index) => {
            if(item)
                visitados.push(index)
        })
        if(callback)                
            callback(rota, visitados)
        return caminho
    }    
    astar(s, t, callback){
        if(s < 0 || t >= this.size)
            throw 'Unsupported values'
        let MEMBRO = true
        let NAOMEMBRO = false
        let caminho = []
        let distancia = []
        let perm = []
        let corrente, k = s, dc, j = 0
        let menordist, novadist
        //Variaveis de tratamento            
        let g = t, rota = [t], cont = 0, visitados = []
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
            for (let i = 0; i < this.size; ++i) {
                if (!perm[i]) {
                    novadist =  dc + this.getCostAdjacency(corrente, i) + this.heuristic(i, t)
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
                rota = []
                g = s
                break
            }
            corrente = k
            perm[corrente] = MEMBRO
        }
        //Tratando resultados
        while(g != s && cont < this.size){
            rota.unshift(caminho[g])
            g = caminho[g]
            cont++
        }
        perm.forEach( (item, index) => {
            if(item)
                visitados.push(index)
        })
        if(callback)                
            callback(rota, visitados)
        return caminho
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