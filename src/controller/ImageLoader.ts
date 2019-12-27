import { read, intToRGBA } from 'jimp'
import { graphState, GraphController } from './GraphController'

export async function loadImagGraph(path: string) {
	let img = await read(path)
	const size = Math.min(img.getHeight(), img.getWidth(), 50)
	img.resize(size, size).grayscale()
	graphState.newSize = size ** 2
	GraphController.resetGraph()
	let index = 0
	for (let i = 0; i < size; ++i) {
		for (let j = 0; j < size; ++j) {
			const { r } = intToRGBA(img.getPixelColor(j, i))
			GraphController.map.setValueForVerticeI(index++, 255 - r, false)
		}
	}
}
