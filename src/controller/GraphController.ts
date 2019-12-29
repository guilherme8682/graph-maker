import { MapGraph } from '../graph/MapGraph'
import { GraphState } from './State'
import { StateKeeper } from './StateKeeper'

export enum SearchMethod {
	Dijkstra = 'dijkstra',
	BreadthFirstSearch = 'breadth',
	GreedyFirstSearch = 'greedy',
	AStart = 'astar',
}
export enum DrawingMethod {
	BeginPoint = 'setBeginPoint',
	DestinyPoint = 'setDestinationPoint',
	Obstacle = 'setValueForVertice',
}
export interface GraphMakerJSONStructure {
	graphState: GraphState
	pajek: string
	date: Date
}

export let graphState = new GraphState()

export class GraphController {
	static map: MapGraph

	static resetGraph(graphMaker?: GraphMakerJSONStructure) {
		if (graphMaker) {
			Object.assign(graphState, graphMaker.graphState)
			if (this.map) this.map.destruct()
			this.map = new MapGraph(graphMaker.pajek)
		} else {
			const { nextSize } = graphState
			graphState = new GraphState(nextSize - 1, graphState)
			if (this.map) this.map.destruct()
			this.map = new MapGraph(nextSize)
		}
		graphState.graphVersionUpdate++
	}
	static loadGraphFile(data: string) {
		try {
			const object = JSON.parse(data) as GraphMakerJSONStructure
			if (!object.graphState || !object.pajek) {
				throw new Error('Data not valid for Graph Maker')
			}
			this.resetGraph(object)
		} catch (error) {
			console.error(error)
		}
	}
	static resizeCanvas() {
		const { offsetHeight, offsetWidth } = document.getElementById('graph-container')!
		const res = Math.min(offsetHeight, offsetWidth)
		for (const canvas of GraphComponents.canvas) {
			canvas.height = res
			canvas.width = res
		}
		if (this.map) {
			this.map.refreshScreen()
		}
	}
	static draw(event: MouseEvent) {
		this.map[graphState.drawingMethod](event)
	}
}

export class GraphComponents {
	static canvas = [] as HTMLCanvasElement[]
	static ctx = [] as CanvasRenderingContext2D[]
	static stateKeeper = new StateKeeper()
}
