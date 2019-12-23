import './style.css'
import React, { Component } from 'react'
import { TopBar } from './topbar'
import { BottomBar } from './bottombar'
import { MiddleData } from './middledata'
import Draggable from 'react-draggable'

interface Props {
	closeSetupGraph: () => void
}
export class SetupGraph extends Component<Props> {
	render() {
		const { closeSetupGraph } = this.props
		return (
			<Draggable handle='.topbar-handler'>
				<div className='setupgraph-container'>
					<div className='topbar'>
						<TopBar closeGraphSetup={closeSetupGraph} />
					</div>
					<div className='middledata'>
						<MiddleData onEnter={closeSetupGraph} />
					</div>
					<div className='bottombar'>
						<BottomBar closeSetupGraph={closeSetupGraph} />
					</div>
				</div>
			</Draggable>
		)
	}
}
