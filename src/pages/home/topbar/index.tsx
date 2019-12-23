import './style.css'
import React, { Component } from 'react'
import { Button } from './button'
import { Input } from './input'
import { AppLogo } from './appicon'
import { ButtonReadFile } from './readfile'
import { graphState, GraphComponents } from '../../../controller/GraphController'
import { isInBrowser } from '../../../controller/Utils'
import { Remote } from 'electron'

let remote: Remote
if (!isInBrowser) {
	remote = (window as any).require('electron').remote
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
	toggleFullscreen = () => {
		if (!document.fullscreenElement) {
			document.body.requestFullscreen()
		} else {
			document.exitFullscreen()
		}
	}
	minimize = () => {
		remote.getCurrentWindow().minimize()
	}
	close = () => {
		remote.getCurrentWindow().close()
	}
	fullscreen = () => {
		const win = remote.getCurrentWindow()
		const isFullscreen = win.isFullScreen()
		win.setFullScreen(!isFullscreen)
	}
	openGitHub = () => {
		window.open('https://github.com/Guilherme8482/GraphMaker')
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
					<Button icon='insert_drive_file' onClick={openGraphSetup} />
					<ButtonReadFile />
					<Button icon='save' onClick={this.saveFile} />
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
