import './style.css'
import React, { Component } from 'react'
import { intensity } from '../../../../graph/MapGraph'

interface Props {
	className?: string
	label: string
	value: number
	onChange: (event: number) => void
}
export class SlideBar extends Component<Props> {
	state = {
		value: 0,
	}

	componentWillReceiveProps(nextProps: Readonly<Props>) {
		const { value } = nextProps
		this.setState({ value })
	}
	normaliaze(value: number) {
		if (value > intensity.max) value = intensity.max
		if (value < intensity.min) value = intensity.min
		return value
	}
	setValue = (value: number) => {
		this.setState({ value })
		this.props.onChange(value)
	}
	inputOnKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		let { value } = this.state
		if (event.key === 'ArrowUp') value++
		else if (event.key === 'ArrowDown') value--
		else return
		this.setValue(this.normaliaze(value))
	}
	inputOnValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let value = Number(event.currentTarget.value.replace(/\D/g, ''))
		this.setValue(this.normaliaze(value))
	}
	render() {
		const { className, label } = this.props
		const { value } = this.state
		return (
			<div className={`sidebar-slidebar-container ${className}`}>
				<div className='sidebar-slidebar-title'>{label}:</div>
				<div className='sidebar-slidebar-slidecontainer'>
					<input
						className='sidebar-slidebar'
						type='range'
						min={intensity.min}
						max={intensity.max}
						value={value}
						onChange={e => this.setValue(Number(e.target.value))}
					/>
					<input
						className='sidebar-slidebar-numberfield'
						type='text'
						min={intensity.min}
						max={intensity.max}
						value={value === intensity.max ? '∞' : value}
						onKeyDown={this.inputOnKeyPress}
						onChange={this.inputOnValueChange}
					/>
				</div>
			</div>
		)
	}
}
