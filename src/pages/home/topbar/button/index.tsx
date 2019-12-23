import './style.css'
import React, { Component } from 'react'

interface Props {
	icon: string
	onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}
export class Button extends Component<Props> {
	render() {
		const { icon, onClick } = this.props
		return (
			<span className='notranslate topbar-icon' onClick={onClick}>
				<i className='topbar-icon-i'>{icon}</i>
			</span>
		)
	}
}
