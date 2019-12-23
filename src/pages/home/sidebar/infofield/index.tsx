import './style.css'
import React, { Component } from 'react'

interface Props {
	label: string
	value: number
}
export class InfoField extends Component<Props> {
	render() {
		const { value, label } = this.props
		return (
			<div className='datafield-result-container'>
				<div className='datafield-result-title'>{label}</div>
				<div className='datafield-result'>{value === -1 ? '∞' : value}</div>
			</div>
		)
	}
}
