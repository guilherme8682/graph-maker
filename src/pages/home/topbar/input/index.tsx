import './style.css'
import React, { Component } from 'react'

interface Props {
	placeholder: string
	value: string
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}
export class Input extends Component<Props> {
	render() {
		const { placeholder, onChange, value } = this.props
		return (
			<div className='topbar-input-container'>
				<input
					className='topbar-input'
					value={value}
					placeholder={placeholder}
					type='text'
					spellCheck={false}
					onChange={onChange}
				/>
			</div>
		)
	}
}
