import './style.css'
import React, { Component } from 'react'
import { Button } from './button'
import { Input } from './input'
import { AppLogo } from './appicon'
import { ButtonReadFile } from './readfile'
import { graphState, GraphComponents } from '../../../controller/GraphController'
import { isInBrowser } from '../../../controller/Utils'

async function getRemote() {
	return (await import('electron')).remote
}

interface Pops {
	openGraphSetup(): void
}
export class TopBar extends Component<Pops> {
	componentDidMount() {
		graphState.listen(this.update, ['graphName'])
	}
	componentWillUnmount() {
		graphState.stopListen(this.update, ['graphName'])
	}
	update = () => {
		this.forceUpdate()
	}
	saveFile = () => {
		const file = new Blob([GraphComponents.stateKeeper.graphToString()], { type: 'txt' })
		const filename = (graphState.graphName || 'Graph Maker') + '.json'
		const a = document.createElement('a')
		const url = URL.createObjectURL(file)
		if (window.navigator.msSaveOrOpenBlob) {
			window.navigator.msSaveOrOpenBlob(file, filename)
			return
		}
		a.href = url
		a.download = filename
		a.click()
		window.URL.revokeObjectURL(url)
	}
	async minimize() {
		const remote = await getRemote()
		remote.getCurrentWindow().minimize()
	}
	async close() {
		const remote = await getRemote()
		remote.getCurrentWindow().close()
	}
	async fullscreen() {
		const remote = await getRemote()
		const win = remote.getCurrentWindow()
		const isFullscreen = win.isFullScreen()
		win.setFullScreen(!isFullscreen)
	}
	openGitHub = () => {
		window.open('https://github.com/Guilherme8482/graph-maker')
	}
	electronWindowActions() {
		const buttons = [<Button key={0} icon='info_outline' onClick={this.openGitHub} />]
		if (!isInBrowser) {
			buttons.push(
				<Button key={1} icon='remove' onClick={this.minimize} />,
				<Button key={2} icon='crop_square' onClick={this.fullscreen} />,
				<Button key={3} icon='close' onClick={this.close} />,
			)
		}
		return <div className='topbar-right'>{buttons}</div>
	}
	render() {
		const { openGraphSetup } = this.props
		const { graphName } = graphState
		return (
			<div className='topbar-container'>
				<div className='topbar-left'>
					<AppLogo />
					<div className='topbar-title'>Graph maker</div>
					<span title='New graph map'>
						<Button icon='insert_drive_file' onClick={openGraphSetup} />
					</span>
					<span title='Open images or graph.json'>
						<ButtonReadFile />
					</span>
					<span title='Save graph map'>
						<Button icon='save' onClick={this.saveFile} />
					</span>
					<Input
						placeholder='Choose a name'
						value={graphName}
						onChange={e => (graphState.graphName = e.target.value)}
					/>
				</div>
				{this.electronWindowActions()}
			</div>
		)
	}
}
