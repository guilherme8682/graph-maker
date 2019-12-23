import './style.css'
import React, { Component } from 'react'

interface Props {
	label: string
	options: string[]
	selected: number
	onChange?: ((option: number) => void) | undefined
}
export class Select extends Component<Props> {
	getOptions() {
		return this.props.options.map((o, i) => (
			<option key={i} value={i}>
				{o}
			</option>
		))
	}
	onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const { onChange } = this.props
		const option = Number(event.target.value)
		if (onChange) onChange(option)
	}
	render() {
		const { label, selected } = this.props
		return (
			<div className='sidebar-select-container'>
				<div>{label}:</div>
				<select onChange={this.onChange} value={selected}>
					{this.getOptions()}
				</select>
			</div>
		)
	}
}
