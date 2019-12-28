import './style.css'
import React, { Component } from 'react'
import { Button } from '../../home/topbar/button'
import { GraphController } from '../../../controller/GraphController'

interface Props {
	closeSetupGraph: () => void
}
export class BottomBar extends Component<Props> {
	confirm = () => {
		GraphController.resetGraph()
		this.props.closeSetupGraph()
	}
	render() {
		return (
			<div className='botbar-container'>
				<div className='botbar-left'/>
				<div className='botbar-right'>
					<Button icon='arrow_forward' onClick={this.confirm} />
				</div>
			</div>
		)
	}
}
