import { EventEmitter } from 'events'
import { SearchMethod, DrawingMethod } from './GraphController'
import { log } from './Utils'

class State<T extends State<T>> {
	private readonly emitter: EventEmitter

	constructor(oldState?: State<T>) {
		this.emitter = oldState?.emitter || new EventEmitter()
		return new Proxy(this, { set: this.set as any })
	}
	private set(self: T, prop: keyof T, value: any) {
		if (self[prop] === value) return true
		self[prop] = value
		log(`[] ${prop}: ${value}`)
		self.dispatch([...self.all, prop])
		return true
	}
	private get all() {
		return ['*' as keyof T]
	}
	private dispatch(props = this.all) {
		props.forEach(p => this.emitter.emit(p as string))
	}
	listen(listener: () => void, props = this.all) {
		props.forEach(p => this.emitter.addListener(p as string, listener))
	}
	stopListen(listener: () => void, props = this.all) {
		props.forEach(p => this.emitter.removeListener(p as string, listener))
	}
}
export class GraphState extends State<GraphState> {
	/** Saves the size of a graph that will be created */
	nextSize = 1024
	obstacleIntensity = 0
	graphName = ''
	searchMethod = SearchMethod.Dijkstra
	drawingMethod = DrawingMethod.BeginPoint
	originPath = 0
	isSearchEnable = false
	pathSize = 0
	pathCost = 0
	numberVisisted = 0
	/** Change every time graph sctructure has some update */
	graphVersionUpdate = 0

	constructor(public endPath = 9, graphState?: State<GraphState>) {
		super(graphState)
	}
}
