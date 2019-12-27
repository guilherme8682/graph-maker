import { GraphController, graphState, GraphMakerJSONStructure } from './GraphController'
import { log } from './Utils'
import { loadImagGraph } from './ImageLoader'

const UPDATE_TIME_MS = 1000
const LOCALSTORAGE_PATH = 'GraphMakerState'

export class StateKeeper {
	lastBackup = new Date()
	timout = 0

	cachePajek!: string
	lastCacheBackup = new Date()
	cacheTimout = 0

	constructor() {
		graphState.listen(this.checkCache, ['graphVersionUpdate'])
		graphState.listen(this.check)
	}
	checkCache = () => {
		const { map } = GraphController
		if (!map) return
		const diff = new Date().getTime() - this.lastCacheBackup.getTime()
		window.clearTimeout(this.cacheTimout)
		if (diff > UPDATE_TIME_MS && map) {
			this.lastCacheBackup = new Date()
			this.cachePajek = map.toString()
			const elapsedTime = new Date().getTime() - this.lastCacheBackup.getTime()
			log(`-> Cache backup was made in ${elapsedTime}ms`)
		} else {
			this.cacheTimout = window.setTimeout(this.checkCache, UPDATE_TIME_MS)
		}
	}
	check = () => {
		const diff = new Date().getTime() - this.lastBackup.getTime()
		window.clearTimeout(this.timout)
		if (diff > UPDATE_TIME_MS) {
			this.backup()
		} else {
			this.timout = window.setTimeout(this.check, UPDATE_TIME_MS)
		}
	}
	backup() {
		if (!this.cachePajek) return
		const start = new Date()
		const stateString = this.graphToString()
		localStorage.setItem(LOCALSTORAGE_PATH, stateString)
		this.lastBackup = new Date()
		const elapsedTime = this.lastBackup.getTime() - start.getTime()
		log(`-> Backup was made in ${elapsedTime}ms`)
	}
	async restore(): Promise<boolean> {
		try {
			const start = new Date()
			let stateString = localStorage.getItem(LOCALSTORAGE_PATH)
			if (!stateString) {
				await loadImagGraph('smile.png')
				return true
			}
			GraphController.loadGraphFile(stateString)
			const elapsedTime = new Date().getTime() - start.getTime()
			log(`<- Restore was made in ${elapsedTime}ms`)
		} catch (err) {
			console.error(err)
			return false
		} finally {
			return true
		}
	}
	graphToString() {
		const data = JSON.parse(JSON.stringify(graphState))
		delete data.emitter
		const output: GraphMakerJSONStructure = {
			graphState: data,
			pajek: this.cachePajek,
			date: new Date(),
		}
		return JSON.stringify(output)
	}
}
