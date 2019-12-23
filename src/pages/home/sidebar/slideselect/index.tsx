import './style.css'
import React, { Component } from 'react'

interface Props {
	label: string
	options: string[]
	selected: number
	onChange?: ((option: number) => void) | undefined
}
export class SlideSelect extends Component<Props> {
	state = {
		selected: 0,
		clicked: false,
	}
	componentWillReceiveProps(nextProps: Readonly<Props>) {
		const { selected } = nextProps
		this.setState({ selected })
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
		const { onChange } = this.props
		if (onChange) onChange(selected)
	}
	changeSelected = (selected: number) => {
		return () => {
			this.setState({ selected })
			const { onChange } = this.props
			if (onChange) onChange(selected)
		}
	}
	render() {
		const { label, options } = this.props
		const { selected } = this.state
		return (
			<div className='slideselect-container'>
				<div className='slideselect-title'>{label}:</div>
				<div
					onMouseDown={() => this.setState({ clicked: true })}
					onMouseUp={() => this.setState({ clicked: false })}
					onMouseMove={this.onMouseMove}
					onMouseLeave={() => this.setState({ clicked: false })}
				>
					<div className='slideselect-options-container'>
						<div style={{ height: 0 }}>
							<div
								className='slideselect-selected'
								style={{ top: selected * 30 + 'px' }}
							></div>
						</div>
						{options.map((o, i) => (
							<div
								className='slideselect-option'
								key={i}
								onClick={this.changeSelected(i)}
							>
								{o}
							</div>
						))}
					</div>
				</div>
			</div>
		)
	}
}
