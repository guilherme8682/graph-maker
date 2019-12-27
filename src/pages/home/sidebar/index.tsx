import './style.css'
import React, { Component } from 'react'
import { Button } from './button'
import { InfoField } from './infofield'
import { graphState, SearchMethod, DrawingMethod } from '../../../controller/GraphController'
import { SlideBar } from './slidebar'
import { GraphState } from '../../../controller/State'
import { SlideSelect } from './slideselect'

const searchMethods = Object.values(SearchMethod)
const searchMethodsLabels = ['Dijkstra', 'First Breadth', 'First Greedy', 'A*']
const drawingMethods = Object.values(DrawingMethod)
const drawingMethodsLabels = ['Start Point', 'End Point', 'Intensity Point']
const listenProps: (keyof GraphState)[] = [
	'searchMethod',
	'isSearchEnable',
	'drawingMethod',
	'pathSize',
	'pathCost',
	'numberVisisted',
]

export class SideBar extends Component {
	componentDidMount() {
		graphState.listen(this.update, listenProps)
	}
	componentWillUnmount() {
		graphState.stopListen(this.update, listenProps)
	}
	update = () => {
		this.forceUpdate()
	}
	setSearchMethod = (option: SearchMethod) => {
		graphState.searchMethod = option
	}
	setDrawingMethod = (option: DrawingMethod) => {
		graphState.drawingMethod = option
	}
	findPath = () => {
		graphState.isSearchEnable = !graphState.isSearchEnable
		this.forceUpdate()
	}
	setObstacleIntensity = (value: number) => {
		graphState.obstacleIntensity = value
	}
	render() {
		const {
			isSearchEnable,
			obstacleIntensity,
			pathSize,
			pathCost,
			numberVisisted,
			searchMethod,
			drawingMethod,
		} = graphState
		return (
			<div className='sidebar-container'>
				<div className='sidebar-subcontainer'>
					<div className='sidebar-title'>
						<span className='notranslate'>
							<i className='material-icons'>settings</i>
						</span>

						<div className='sidebar-title-text'>Options</div>
					</div>
					<SlideSelect
						label='Search mode'
						options={searchMethods}
						optionLabels={searchMethodsLabels}
						selected={searchMethod}
						onChange={this.setSearchMethod}
					/>
					<Button label={isSearchEnable ? 'Stop' : 'Find'} onClick={this.findPath} />
					<SlideSelect
						label='Drawing mode'
						options={drawingMethods}
						optionLabels={drawingMethodsLabels}
						selected={drawingMethod}
						onChange={this.setDrawingMethod}
					/>
					<SlideBar
						className={
							drawingMethod === DrawingMethod.Obstacle ? '' : 'sidebar-slidebar-hide'
						}
						label='Obstacle intensity'
						value={obstacleIntensity}
						onChange={this.setObstacleIntensity}
					/>
					<InfoField label='Path size' value={pathSize} />
					<InfoField label='Path cost' value={pathCost} />
					<InfoField label='Number of visisted' value={numberVisisted} />
				</div>
			</div>
		)
	}
}
