import './style.css'
import React, { Component } from 'react'
import { TopBar } from './topbar'
import { SideBar } from './sidebar'
import { Graph } from './graph'

interface Props {
	openGraphSetup: () => void
}
export class Home extends Component<Props> {
	render() {
		const { openGraphSetup } = this.props
		return (
			<div className='main-container'>
				<div className='main-topbar'>
					<TopBar openGraphSetup={openGraphSetup} />
				</div>
				<div className='main-midcontent'>
					<SideBar />
					<Graph />
				</div>
			</div>
		)
	}
}
