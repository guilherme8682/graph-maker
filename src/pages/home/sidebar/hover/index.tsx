import './style.css'
import React, { Component } from 'react'

interface Props {
	icon: string
	onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}
export class Button extends Component<Props> {
	render() {
		const { icon, onClick: onclick } = this.props
		return (
			<div className='navButton left' onClick={onclick}>
				<i className='material-icons'>{icon}</i>
			</div>
		)
	}
}
