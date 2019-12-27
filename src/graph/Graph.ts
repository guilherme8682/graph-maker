const { sqrt, floor, ceil, abs } = Math

export const INFINITY = 255
export const GRAPH_MAX_SIZE = 2 ** 30

export class Graph {
	private vertices: string[]
	private matrix: Uint8Array

	constructor(public readonly size: number, private directed = true) {
		const graphSquare = size ** 2
		if (graphSquare > GRAPH_MAX_SIZE) throw new Error('Size for a Graph not allowed!')
		this.matrix = new Uint8Array(graphSquare).fill(INFINITY)
		this.vertices = new Array(size).fill('')
	}
	static fromPajekString(file: string) {
		const data = file.split('\n')
		const size = Number((data[0].match(/\d+/) || [0])[0])
		const vertices = [] as string[]
		let currentLine = 1
		for (; currentLine < data.length; ++currentLine) {
			if (data[currentLine] === '') continue
			if (data[currentLine][0] === '*') break
			const index = Number((data[currentLine].match(/^\d+/g) || [0])[0]) - 1
			let name = (data[currentLine].match(/".*"/g) || [''])[0].substr(1, -2)
			vertices[index] = name
		}
		let directed: boolean
		if (data[currentLine].search(/Arcs/) !== -1) directed = true
		else if (data[currentLine].search(/Edges/) !== -1) directed = false
		else throw new Error('Propriedade do arquivo nao compreendida.')
		const graph = new Graph(size, directed)
		for (let i = 0; i < size; ++i) {
			graph.createVertex(i, vertices[i] || '')
		}
		for (currentLine++; currentLine < data.length; ++currentLine) {
			if (data[currentLine] === '') continue
			const [from, to, value] = data[currentLine].split(' ').map(Number)
			if (from === undefined || to === undefined || value === undefined) {
				throw new Error(`Pajek edges can't be parsed! ${[from, to, value]}`)
			}
			graph.createAdjacency(from - 1, to - 1, value)
		}
		return graph
	}
	private setMatrix(i: number, j: number, value: number) {
		this.matrix[this.size * i + j] = value
	}
	private getMatrix(i: number, j: number) {
		return this.matrix[this.size * i + j]
	}
	private heuristic(from: number, to: number) {
		//Manhattan distance on a square grid
		//Specific to a map structure
		let length = ceil(sqrt(this.size))
		let a = { x: from % length, y: floor(from / length) }
		let b = { x: to % length, y: floor(to / length) }
		return abs(a.x - b.x) + abs(a.y - b.y)
	}
	private getCostAdjacency(from: number, to: number) {
		const value = this.getMatrix(from, to)
		// if (value === undefined) {
		// 	debugger
		// 	throw new Error(`Index out of bounds! from: ${from} to: ${to} size: ${this.size}`)
		// }
		return value === INFINITY ? Infinity : value
	}
	createAdjacency(from: number, to: number, value: number) {
		if (value === Infinity || value > INFINITY || value < 0) {
			this.removeAdjacency(from, to)
		} else {
			this.setMatrix(from, to, value)
			if (!this.directed) {
				this.setMatrix(to, from, value)
			}
		}
	}
	private removeAdjacency(from: number, to: number) {
		this.setMatrix(from, to, INFINITY)
		if (this.directed) {
			this.setMatrix(to, from, INFINITY)
		}
	}
	dijkstra(origin: number, destiny: number) {
		let MEMBRO = true
		let NAOMEMBRO = false
		let caminho = [] as number[]
		let distancia = [] as number[]
		let perm = [] as boolean[]
		let corrente,
			k = origin,
			dc
		let menordist, novadist
		//Variaveis de tratamento
		let g = destiny,
			route = [destiny],
			cont = 0,
			visited = [] as number[]
		//inicialização
		for (let i = 0; i < this.size; ++i) {
			perm[i] = NAOMEMBRO
			distancia[i] = Infinity
			caminho[i] = -1
		}
		perm[origin] = MEMBRO
		distancia[origin] = 0
		corrente = origin
		while (corrente !== destiny) {
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
			if (corrente === k) {
				//Busca impossivel
				route = []
				g = origin
				break
			}
			corrente = k
			perm[corrente] = MEMBRO
		}
		//Tratando resultados
		while (g !== origin && cont < this.size) {
			route.unshift(caminho[g])
			g = caminho[g]
			cont++
		}
		perm.forEach((item, index) => {
			if (item) visited.push(index)
		})
		return { route, visited }
	}
	breadth(origin: number, destiny: number) {
		if (origin < 0 || destiny >= this.size) throw new Error('Unsupported values')
		let MEMBRO = true
		let NAOMEMBRO = false
		let caminho = []
		let distancia = []
		let perm = []
		let corrente,
			k = origin,
			dc
		let menordist, novadist
		//Variaveis de tratamento
		let g = destiny,
			route = [destiny],
			cont = 0,
			visited = [] as number[]
		//inicialização
		for (let i = 0; i < this.size; ++i) {
			perm[i] = NAOMEMBRO
			distancia[i] = Infinity
			caminho[i] = -1
		}
		perm[origin] = MEMBRO
		distancia[origin] = 0
		corrente = origin
		while (corrente !== destiny) {
			menordist = Infinity
			dc = distancia[corrente]
			for (let i = 0; i < this.size; ++i) {
				if (!perm[i]) {
					novadist = dc + (this.getCostAdjacency(corrente, i) === Infinity ? Infinity : 1)
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
			if (corrente === k) {
				//Busca impossivel
				route = []
				g = origin
				break
			}
			corrente = k
			perm[corrente] = MEMBRO
		}
		//Tratando resultados
		while (g !== origin && cont < this.size) {
			route.unshift(caminho[g])
			g = caminho[g]
			cont++
		}
		perm.forEach((item, index) => {
			if (item) visited.push(index)
		})
		return { route, visited }
	}
	greedy(origin: number, destiny: number) {
		if (origin < 0 || destiny >= this.size) throw new Error('Unsupported values')
		let MEMBRO = true
		let NAOMEMBRO = false
		let caminho = []
		let distancia = []
		let perm = []
		let corrente,
			k = origin
		let menordist, novadist
		//Variaveis de tratamento
		let g = destiny,
			route = [destiny],
			cont = 0,
			visited = [] as number[]
		//inicialização
		for (let i = 0; i < this.size; ++i) {
			perm[i] = NAOMEMBRO
			distancia[i] = Infinity
			caminho[i] = -1
		}
		perm[origin] = MEMBRO
		distancia[origin] = this.heuristic(origin, destiny)
		corrente = origin
		while (corrente !== destiny) {
			menordist = Infinity
			for (let i = 0; i < this.size; ++i) {
				if (!perm[i]) {
					novadist =
						this.getCostAdjacency(corrente, i) === Infinity
							? Infinity
							: this.heuristic(i, destiny)
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
			if (corrente === k) {
				//Busca impossivel
				route = []
				g = origin
				break
			}
			corrente = k
			perm[corrente] = MEMBRO
		}
		//Tratando resultados
		while (g !== origin && cont < this.size) {
			route.unshift(caminho[g])
			g = caminho[g]
			cont++
		}
		perm.forEach((item, index) => {
			if (item) visited.push(index)
		})
		return { route, visited }
	}
	astar(origin: number, destiny: number) {
		if (origin < 0 || destiny >= this.size) throw new Error('Unsupported values')
		let MEMBRO = true
		let NAOMEMBRO = false
		let caminho = []
		let distancia = []
		let perm = []
		let corrente,
			k = origin,
			dc
		let menordist, novadist
		//Variaveis de tratamento
		let g = destiny,
			route = [destiny],
			cont = 0,
			visited = [] as number[]
		//inicialização
		for (let i = 0; i < this.size; ++i) {
			perm[i] = NAOMEMBRO
			distancia[i] = Infinity
			caminho[i] = -1
		}
		perm[origin] = MEMBRO
		distancia[origin] = 0
		corrente = origin
		while (corrente !== destiny) {
			menordist = Infinity
			dc = distancia[corrente]
			for (let i = 0; i < this.size; ++i) {
				if (!perm[i]) {
					novadist = dc + this.getCostAdjacency(corrente, i) + this.heuristic(i, destiny)
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
			if (corrente === k) {
				//Busca impossivel
				route = []
				g = origin
				break
			}
			corrente = k
			perm[corrente] = MEMBRO
		}
		//Tratando resultados
		while (g !== origin && cont < this.size) {
			route.unshift(caminho[g])
			g = caminho[g]
			cont++
		}
		perm.forEach((item, index) => {
			if (item) visited.push(index)
		})
		return { route, visited }
	}
	toPajekString() {
		const { size } = this
		let data = `*Vertices  ${size}\n`
		data += this.vertices.map((name, i) => `${i + 1} "${name}"\n`).join('')
		if (this.directed) {
			data += '*Arcs \n'
			for (let i = 0; i < size; ++i) {
				for (let j = 0; j < size; ++j) {
					const cost = this.getCostAdjacency(i, j)
					if (cost !== Infinity) {
						data += `${i + 1} ${j + 1} ${cost}\n`
					}
				}
			}
		} else {
			data += '*Edges \n'
			for (let i = 0; i < size; ++i) {
				for (let j = i; j < size; ++j) {
					const cost = this.getCostAdjacency(i, j)
					if (cost !== Infinity) {
						data += `${i + 1} ${j + 1} ${cost}\n`
					}
				}
			}
		}
		return data
	}
	createVertex(index: number, name: string) {
		this.vertices[index] = name
	}
	getNeighboors(target: number) {
		const neighboors = [] as number[]
		for (let i = 0; i < this.size; ++i) {
			if (i !== target && this.getCostAdjacency(i, target) !== Infinity) {
				neighboors.push(i)
			}
		}
		return neighboors
	}
	printAdjacencys() {
		let data = [] as number[][]
		for (let i = 0; i < this.size; ++i) {
			data[i] = []
			for (let j = 0; j < this.size; ++j) {
				data[i][j] = this.getCostAdjacency(i, j)
			}
		}
		console.table(data)
	}
	getCostAdjacencys() {
		const costs = new Uint8Array(this.size).fill(INFINITY)
		for (let i = 0; i < this.size; ++i) {
			const [neighbood] = this.getNeighboors(i)
			if (neighbood === undefined) continue
			costs[i] = this.getCostAdjacency(neighbood, i)
		}
		return costs
	}
}
