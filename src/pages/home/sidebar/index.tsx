import './style.css'
import React, { Component } from 'react'
import { Button } from './button'
import { InfoField } from './infofield'
import { graphState, SearchMethod, DrawingMethod } from '../../../controller/GraphController'
import { SlideBar } from './slidebar'
import { GraphState } from '../../../controller/State'
import { SlideSelect } from './slideselect'

const searchMethodsKeys = Object.keys(SearchMethod)
const searchMethodsValues = Object.values(SearchMethod) as SearchMethod[]
const drawingMethodsKeys = Object.keys(DrawingMethod)
const drawingMethodsValues = Object.values(DrawingMethod) as DrawingMethod[]
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
	setSearchMethod = (option: number) => {
		graphState.searchMethod = searchMethodsValues[option]
	}
	setDrawingMethod = (option: number) => {
		graphState.drawingMethod = drawingMethodsValues[option]
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
						options={searchMethodsKeys}
						selected={searchMethodsValues.indexOf(searchMethod)}
						onChange={this.setSearchMethod}
					/>
					<Button label={isSearchEnable ? 'Stop' : 'Find'} onClick={this.findPath} />
					<SlideSelect
						label='Drawing mode'
						options={drawingMethodsKeys}
						selected={drawingMethodsValues.indexOf(drawingMethod)}
						onChange={this.setDrawingMethod}
					/>
					<SlideBar
						className={
							drawingMethod === DrawingMethod.Obstacle ? '' : 'sidebar-slidebar-hide'
						}
						label='Obstacle intensity'
						value={obstacleIntensity}
						onChange={v => this.setObstacleIntensity(v)}
					/>
					<InfoField label='Path size' value={pathSize} />
					<InfoField label='Path cost' value={pathCost} />
					<InfoField label='Number of visisted' value={numberVisisted} />
				</div>
			</div>
		)
	}
}
