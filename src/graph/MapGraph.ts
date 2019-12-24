import { Graph } from './Graph'
import { graphState, GraphComponents } from '../controller/GraphController'
import { log } from '../controller/Utils'
import { GraphState } from '../controller/State'

const { floor, random, ceil, sqrt } = Math

const drawL2ListenProps: (keyof GraphState)[] = ['originPath', 'endPath']
const processSearchListenProps: (keyof GraphState)[] = [
	'originPath',
	'endPath',
	'isSearchEnable',
	'searchMethod',
]
export const intensity = {
	max: 255,
	min: 0,
}

export class MapGraph {
	private graph: Graph
	private costVerts: Uint8Array
	private numberOfBlocksPerLine: number
	private numberOfBlocks: number
	private blockSize = {
		x: 0,
		y: 0,
	}

	constructor(numberOfBlocks: number)
	constructor(pajek: string)
	constructor(param: number | string) {
		if (typeof param === 'string') {
			this.graph = Graph.fromPajekString(param)
			this.numberOfBlocks = this.graph.size
			this.costVerts = this.graph.getCostAdjacencys()
			this.numberOfBlocksPerLine = ceil(sqrt(this.numberOfBlocks))
		} else {
			this.numberOfBlocks = param
			this.graph = new Graph(param, true)
			this.costVerts = this.generateRandomCosts()
			this.numberOfBlocksPerLine = ceil(sqrt(param))
			this.makeRandomGraph()
		}
		this.refreshScreen()
		this.proccesSearch()
		graphState.listen(this.proccesSearch, processSearchListenProps)
		graphState.listen(this.drawL2, drawL2ListenProps)
	}
	get context() {
		return GraphComponents.ctx
	}
	get currentDrawing() {
		return this[graphState.drawingMethod]
	}
	private generateRandomCosts() {
		const costs = new Uint8Array(this.numberOfBlocks)
		costs.forEach((_, i) => (costs[i] = floor(random() * (intensity.max - 1) + 1)))
		return costs
	}
	private makeRandomGraph() {
		const { numberOfBlocksPerLine: nbpl, numberOfBlocks: nb, costVerts: cv, graph: g } = this
		for (let i = 0; i < nbpl; i++) {
			const column = i % nbpl
			if (column === 0) {
				g.createAdjacency(i, i + 1, cv[i + 1])
				g.createAdjacency(i, i + nbpl, cv[i + nbpl])
			} else if (column === nbpl - 1) {
				g.createAdjacency(i, i - 1, cv[i - 1])
				g.createAdjacency(i, i + nbpl, cv[i + nbpl])
			} else {
				g.createAdjacency(i, i + 1, cv[i + 1])
				g.createAdjacency(i, i - 1, cv[i - 1])
				g.createAdjacency(i, i + nbpl, cv[i + nbpl])
			}
		}
		for (let i = nbpl; i < nb - nbpl; i++) {
			const column = i % nbpl
			if (column === 0) {
				g.createAdjacency(i, i + 1, cv[i + 1])
				g.createAdjacency(i, i + nbpl, cv[i + nbpl])
				g.createAdjacency(i, i - nbpl, cv[i - nbpl])
			} else if (column === nbpl - 1) {
				g.createAdjacency(i, i - 1, cv[i - 1])
				g.createAdjacency(i, i + nbpl, cv[i + nbpl])
				g.createAdjacency(i, i - nbpl, cv[i - nbpl])
			} else {
				g.createAdjacency(i, i + 1, cv[i + 1])
				g.createAdjacency(i, i - 1, cv[i - 1])
				g.createAdjacency(i, i + nbpl, cv[i + nbpl])
				g.createAdjacency(i, i - nbpl, cv[i - nbpl])
			}
		}
		for (let i = nb - nbpl; i < nb; i++) {
			const column = i % nbpl
			if (column === 0) {
				g.createAdjacency(i, i + 1, cv[i + 1])
				g.createAdjacency(i, i - nbpl, cv[i - nbpl])
			} else if (column === nbpl - 1) {
				g.createAdjacency(i, i - 1, cv[i - 1])
				g.createAdjacency(i, i - nbpl, cv[i - nbpl])
			} else {
				g.createAdjacency(i, i + 1, cv[i + 1])
				g.createAdjacency(i, i - 1, cv[i - 1])
				g.createAdjacency(i, i - nbpl, cv[i - nbpl])
			}
		}
	}
	private currentSearch = () => {
		return this.graph[graphState.searchMethod](graphState.originPath, graphState.endPath)
	}
	private drawBlocks(list: number[]) {
		list.forEach(index => this.drawBlock(index, 'rgba(0,0,0,0.5)', 2))
	}
	private drawRoute(list: number[]) {
		const { numberOfBlocksPerLine: nbpl, blockSize: bs } = this
		let current = {
			x: (list[0] % nbpl) * bs.x + bs.x / 2,
			y: floor(list[0] / nbpl) * bs.y + bs.y / 2,
		}
		const ctx = this.context[2]
		ctx.strokeStyle = 'white'
		ctx.lineCap = 'round'
		ctx.lineWidth = bs.x / 4
		ctx.beginPath()
		ctx.moveTo(current.x, current.y)
		for (const i of list) {
			current = {
				x: (i % nbpl) * bs.x + bs.x / 2,
				y: floor(i / nbpl) * bs.y + bs.y / 2,
			}
			ctx.lineTo(current.x, current.y)
		}
		ctx.stroke()
	}
	private getColor(i: number) {
		const { max } = intensity
		const cost = this.costVerts[i]
		if (cost === max) return 'rgb(37, 40, 57)'
		const blue = this.costVerts[i] === max ? 0 : floor(((max - cost) / max) * 255)
		const green = ceil(0.68 * blue) + 173
		return `rgb(255, ${green}, ${blue})`
	}
	private drawL1() {
		const [ctx] = this.context
		if (!ctx) return
		ctx.clearRect(0, 0, GraphComponents.canvas[0].width, GraphComponents.canvas[0].height)
		for (let i = 0; i < this.numberOfBlocks; ++i) {
			this.drawBlock(i, this.getColor(i), 0)
		}
	}
	private drawL2 = () => {
		const ctx = this.context[1]
		if (!ctx) return
		ctx.clearRect(0, 0, GraphComponents.canvas[1].width, GraphComponents.canvas[1].height)
		this.drawBlock(graphState.originPath, 'LawnGreen', 1)
		this.drawBlock(graphState.endPath, 'DodgerBlue', 1)
	}
	private drawL3() {
		const ctx = this.context[2]
		if (!ctx) return
		const { width, height } = GraphComponents.canvas[2]
		ctx.clearRect(0, 0, width, height)
	}
	private clearL3() {
		this.context[2].clearRect(
			0,
			0,
			GraphComponents.canvas[0].width,
			GraphComponents.canvas[0].height,
		)
	}
	private drawBlock(index: number, color: string, layer: number) {
		const origin = {
			x: (index % this.numberOfBlocksPerLine) * this.blockSize.x,
			y: floor(index / this.numberOfBlocksPerLine) * this.blockSize.y,
		}
		const x = this.blockSize.x * 0.05 + origin.x
		const y = this.blockSize.y * 0.05 + origin.y
		const w = this.blockSize.x * 0.9
		const h = this.blockSize.y * 0.9
		this.context[layer].fillStyle = color
		this.context[layer].fillRect(x, y, w, h)
	}
	private indexFromClick(event: MouseEvent) {
		return (
			floor(event.offsetX / this.blockSize.x) +
			floor(event.offsetY / this.blockSize.y) * this.numberOfBlocksPerLine
		)
	}
	private setBeginPoint(event: MouseEvent) {
		graphState.originPath = this.indexFromClick(event)
	}
	private setDestinationPoint(event: MouseEvent) {
		graphState.endPath = this.indexFromClick(event)
	}
	private proccesSearch = () => {
		this.clearL3()
		if (!graphState.isSearchEnable) {
			graphState.pathSize = -1
			graphState.pathCost = -1
			graphState.numberVisisted = -1
			return
		}
		log('!! Searching...')
		const { route, visited } = this.currentSearch()
		this.drawBlocks(visited)
		this.drawRoute(route)
		graphState.pathSize = route.length
		graphState.pathCost = route.reduce((before, current) => before + this.costVerts[current], 0)
		graphState.numberVisisted = visited.length
	}
	setValueForVertice(event: MouseEvent) {
		this.setValueForVerticeI(this.indexFromClick(event), graphState.obstacleIntensity)
	}
	setValueForVerticeI(i: number, value: number) {
		const { numberOfBlocksPerLine: nbpl, numberOfBlocks: nb, costVerts: cv, graph: g } = this
		const column = i % nbpl
		cv[i] = value
		if (i >= nbpl && i < nb - nbpl) {
			if (column === 0) {
				g.createAdjacency(i + 1, i, cv[i])
				g.createAdjacency(i + nbpl, i, cv[i])
				g.createAdjacency(i - nbpl, i, cv[i])
			} else if (column === nbpl - 1) {
				g.createAdjacency(i - 1, i, cv[i])
				g.createAdjacency(i + nbpl, i, cv[i])
				g.createAdjacency(i - nbpl, i, cv[i])
			} else {
				g.createAdjacency(i + 1, i, cv[i])
				g.createAdjacency(i - 1, i, cv[i])
				g.createAdjacency(i + nbpl, i, cv[i])
				g.createAdjacency(i - nbpl, i, cv[i])
			}
		} else if (i < nbpl) {
			if (column === 0) {
				g.createAdjacency(i + 1, i, cv[i])
				g.createAdjacency(i + nbpl, i, cv[i])
			} else if (column === nbpl - 1) {
				g.createAdjacency(i - 1, i, cv[i])
				g.createAdjacency(i + nbpl, i, cv[i])
			} else {
				g.createAdjacency(i + 1, i, cv[i])
				g.createAdjacency(i - 1, i, cv[i])
				g.createAdjacency(i + nbpl, i, cv[i])
			}
		} else if (i >= nb - nbpl) {
			if (column === 0) {
				g.createAdjacency(i + 1, i, cv[i])
				g.createAdjacency(i - nbpl, i, cv[i])
			} else if (column === nbpl - 1) {
				g.createAdjacency(i - 1, i, cv[i])
				g.createAdjacency(i - nbpl, i, cv[i])
			} else {
				g.createAdjacency(i + 1, i, cv[i])
				g.createAdjacency(i - 1, i, cv[i])
				g.createAdjacency(i - nbpl, i, cv[i])
			}
		}
		this.drawBlock(i, this.getColor(i), 0)
		this.proccesSearch()
		graphState.graphVersionUpdate++
	}
	refreshScreen() {
		const [canvas] = GraphComponents.canvas
		if (!canvas) return
		this.blockSize = {
			x: canvas.width / this.numberOfBlocksPerLine,
			y: canvas.height / this.numberOfBlocksPerLine,
		}
		this.drawAll()
	}
	loadFromPajek(pajek: string) {
		this.graph = Graph.fromPajekString(pajek)
		this.numberOfBlocks = this.graph.size
		this.numberOfBlocksPerLine = ceil(sqrt(this.numberOfBlocks))
		this.costVerts = this.graph.getCostAdjacencys()
		this.drawAll()
	}
	drawAll() {
		this.drawL1()
		this.drawL2()
		this.drawL3()
	}
	toString() {
		return this.graph.toPajekString()
	}
	destruct() {
		delete this.graph
		graphState.stopListen(this.proccesSearch, processSearchListenProps)
		graphState.stopListen(this.drawL2, drawL2ListenProps)
	}
}
