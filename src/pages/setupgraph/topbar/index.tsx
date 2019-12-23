import './style.css'
import React, { Component } from 'react'
import { Button } from '../../home/topbar/button'
import { AppLogo } from '../../home/topbar/appicon'

interface Props {
	closeGraphSetup: () => void
}
export class TopBar extends Component<Props> {
	render() {
		const { closeGraphSetup } = this.props
		return (
			<div className='topbar-container topbar-handler'>
				<div className='topbar-left'>
					<AppLogo />
					<div className='topbar-title'>Graph maker</div>
				</div>
				<div className='topbar-right'>
					<Button icon='close' onClick={closeGraphSetup} />
				</div>
			</div>
		)
	}
}
