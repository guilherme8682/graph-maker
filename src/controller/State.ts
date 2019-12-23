import { EventEmitter } from 'events'
import { SearchMethod, DrawingMethod } from './GraphController'
import { log } from './Utils'

class State<T> {
	static readonly all = '*'
	private readonly emitter: EventEmitter

	constructor(oldState?: State<T>) {
		this.emitter = oldState ? oldState.emitter : new EventEmitter()
		return new Proxy(this, { set: this.set })
	}
	private set = (self: any, prop: keyof T, value: any) => {
		if (self[prop] === value) return true
		self[prop] = value
		this.dispatch([State.all as keyof T, prop])
		log(`[] ${prop}: ${value}`)
		return true
	}
	private dispatch(props: (keyof T)[] = [State.all as keyof T]) {
		props.forEach(p => this.emitter.emit(p as string))
	}
	listen(listener: () => void, props: (keyof T)[] = [State.all as keyof T]) {
		props.forEach(p => this.emitter.addListener(p as string, listener))
	}
	stopListen(listener: () => void, props: (keyof T)[] = [State.all as keyof T]) {
		props.forEach(p => this.emitter.removeListener(p as string, listener))
	}
}

export class GraphState extends State<GraphState> {
	newSize = 1024
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
