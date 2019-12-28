import './style.css'
import React, { Component } from 'react'
import { GraphComponents, GraphController } from '../../../controller/GraphController'

export class Graph extends Component {
	state = {
		isClicked: false,
	}

	async componentDidMount() {
		const { children } = document.getElementById('graph-container')!
		if (!children) return
		const canvas = [0, 1, 2].map(i => children.item(i)!)
		GraphComponents.canvas = canvas as HTMLCanvasElement[]
		GraphComponents.ctx = GraphComponents.canvas.map(c => c.getContext('2d')!)
		GraphController.resizeCanvas()
		window.addEventListener('resize', () => GraphController.resizeCanvas())
		const sucess = await GraphComponents.stateKeeper.restore()
		if (!sucess) GraphController.resetGraph()
	}
	setClick = (isClicked: boolean) => {
		this.setState({ isClicked })
	}
	onMouseMove = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
		if (this.state.isClicked) {
			GraphController.draw(event.nativeEvent)
		}
	}
	onClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
		GraphController.draw(event.nativeEvent)
	}
	render() {
		return (
			<div className='graph-container' id='graph-container'>
				<canvas className='graph-canvas'/>
				<canvas className='graph-canvas'/>
				<canvas
					className='graph-canvas'
					onMouseDown={() => this.setClick(true)}
					onMouseUp={() => this.setClick(false)}
					onMouseMove={this.onMouseMove}
					onClick={this.onClick}
				/>
			</div>
		)
	}
}
