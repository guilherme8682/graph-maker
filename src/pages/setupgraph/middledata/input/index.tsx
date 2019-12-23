import './style.css'
import React, { Component } from 'react'
import { graphState, GraphController } from '../../../../controller/GraphController'
import { GRAPH_MAX_SIZE } from '../../../../graph/Graph'

const { round, sqrt } = Math

interface Props {
	label: string
	defaultValue: number
	onEnter(): void
}
export class SquareRootInput extends Component<Props> {
	state: { value: number }
	constructor(props: Props) {
		super(props)
		this.state = {
			value: props.defaultValue,
		}
	}
	normalizeSize(size: number) {
		if (size ** 2 > GRAPH_MAX_SIZE) size = sqrt(GRAPH_MAX_SIZE)
		const value = round(sqrt(size)) ** 2
		this.setState({ value })
		graphState.newSize = value
	}
	onBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
		const size = Number(event.target.value)
		this.normalizeSize(size)
	}
	onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number(event.target.value)
		this.setState({ value })
	}
	onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			this.normalizeSize(this.state.value)
			GraphController.resetGraph()
			this.props.onEnter()
		}
	}
	render() {
		return (
			<div className='input-container'>
				<b>{this.props.label}:</b>
				<input
					type='number'
					className='squarerootinput-size'
					min={9}
					value={this.state.value}
					onChange={this.onChange}
					onBlur={this.onBlur}
					onKeyDown={this.onKeyPress}
					autoFocus
				/>
			</div>
		)
	}
}
