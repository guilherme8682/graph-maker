import './style.css'
import React, { Component } from 'react'

interface Props {
	message: string
}
export class Warning extends Component<Props> {
	render() {
		return (
			<div>
				<div className='warning'>{this.props.message}</div>
			</div>
		)
	}
}
