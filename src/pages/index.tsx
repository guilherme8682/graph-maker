import './style.css'
import React, { Component } from 'react'
import { Home } from './home'
import { SetupGraph } from './setupgraph'

export class Main extends Component {
	state = {
		isSetupVisible: false,
	}
	setVisibleSetupGraph = (isSetupVisible: boolean) => {
		this.setState({ isSetupVisible })
	}
	getSetupGraph() {
		if (!this.state.isSetupVisible) return <div />
		return (
			<div className='float-container'>
				<SetupGraph closeSetupGraph={() => this.setVisibleSetupGraph(false)} />
			</div>
		)
	}
	render() {
		return (
			<div className='main-container'>
				<Home openGraphSetup={() => this.setVisibleSetupGraph(true)} />
				{this.getSetupGraph()}
			</div>
		)
	}
}
