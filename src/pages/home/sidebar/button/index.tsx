import './style.css'
import React, { Component } from 'react'

interface Props {
	label: string
	onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}
export class Button extends Component<Props> {
	render() {
		const { label, onClick } = this.props
		return (
			<div onClick={onClick}>
				<button className='sidebar-button'>{label}</button>
			</div>
		)
	}
}
