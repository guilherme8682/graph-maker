import './style.css'
import React, { Component } from 'react'

interface Props<T extends string> {
	label: string
	options: T[]
	optionLabels?: string[]
	selected: T
	onChange?(option: T): void
}
export class SlideSelect<T extends string> extends Component<Props<T>> {
	state = {
		selected: 0,
		clicked: false,
	}
	componentWillReceiveProps(nextProps: Readonly<Props<T>>) {
		const { selected, options } = nextProps
		this.setState({ selected: options.indexOf(selected) })
	}
	onMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (!this.state.clicked) return
		const selected = 0 | ((event.pageY - event.currentTarget.getBoundingClientRect().top) / 30)
		if (
			selected === this.state.selected ||
			selected < 0 ||
			selected >= this.props.options.length
		)
			return
		this.setState({ selected })
		const { onChange, options } = this.props
		if (onChange) onChange(options[selected])
	}
	changeSelected = (selected: T) => {
		return () => {
			const { options, onChange } = this.props
			this.setState({ selected: options.indexOf(selected) })
			if (onChange) onChange(selected)
		}
	}
	setClicked = () => {
		this.setState({ clicked: true })
	}
	setNotClicked = () => {
		this.setState({ clicked: false })
	}
	render() {
		const { label, options, optionLabels } = this.props
		const { selected } = this.state
		const labels = optionLabels || options
		return (
			<div className='slideselect-container'>
				<div className='slideselect-title'>{label}:</div>
				<div
					onMouseDown={this.setClicked}
					onMouseUp={this.setNotClicked}
					onMouseMove={this.onMouseMove}
					onMouseLeave={this.setNotClicked}
				>
					<div className='slideselect-options-container'>
						<div style={{ height: 0 }}>
							<div
								className='slideselect-selected'
								style={{ top: selected * 30 + 'px' }}
							/>
						</div>
						{options.map((o, i) => (
							<div
								className='slideselect-option'
								key={i}
								onClick={this.changeSelected(o)}
							>
								{labels[i]}
							</div>
						))}
					</div>
				</div>
			</div>
		)
	}
}
