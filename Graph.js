var fs = require('fs')

module.exports = class Graph{
    constructor(size, directed){ //Overload: new Graph(path:String), new Graph(size:Number, directed:Boolean)
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
        this.vertices[index].setName(name)
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
        this.vertices.forEach((vertice, index) => console.log('index:',index,'name:',vertice.getName()))
    }
    dijkstra(s, t, callback){
        try {
            if(s < 0 || t >= this.size)
                throw 'Unsupported values'
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
            //Tratando resultados
            var i = t, rota = [t]
            while(i != s){
                rota.unshift(caminho[i])
                i = caminho[i]
            }
            var visitados = []
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
        var data = ''
        
        data += '*Vertices  ' + this.size + '\n';
        this.vertices.forEach((vertice, index) =>{
            data += (index + 1) + ' "' + vertice.getName() + '"\n'
        })
        if (this.directed) {
            data += '*Arcs \n'
            for (var i = 0; i < this.size; i++){
                for (var j = 0; j < this.size; j++){
                    if (this.matrix[i][j] != Infinity){
                        data += (i + 1) + ' ' + (j + 1) + ' ' + this.matrix[i][j] + '\n'
                    }
                }
            }
        }
        else {
            data += '*Edges \n'
            for (var i = 0; i < this.size; i++){
                for (var j = i; j < this.size; j++){
                    if (this.matrix[i][j] != Infinity){
                        data += (i + 1) + ' ' + (j + 1) + ' ' + this.matrix[i][j] + '\n'
                    }
                }
            }
        }
        fs.writeFileSync(fileName + '.net', data)
    }
    loadPajek(fileName){        
        let data
        try {            
            data = fs.readFileSync(fileName + '.net', 'utf8').split('\n')
        } 
        catch (error) {
            throw error
        }


        this.size = Number(data[0].match(/\d+$/)[0])
        this.matrix = []
        for (var i = 0; i < this.size; i++){
            this.matrix[i] = []
            for(var j = 0; j < this.size; ++j)
                this.matrix[i][j] = Infinity
        }
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