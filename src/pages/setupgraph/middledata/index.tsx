import './style.css'
import React, { Component } from 'react'
import { SquareRootInput } from './input'
import { Warning } from './warning'
import { graphState } from '../../../controller/GraphController'

interface Props {
	onEnter(): void
}
export class MiddleData extends Component<Props> {
	render() {
		return (
			<div className='middle-container'>
				<div className='middle-subcontainer'>
					<SquareRootInput
						label='Size'
						defaultValue={graphState.newSize}
						onEnter={this.props.onEnter}
					/>
					<Warning message='Size value must be a square root valid' />
				</div>
			</div>
		)
	}
}
