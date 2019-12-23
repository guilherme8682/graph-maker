import './style.css'
import React, { Component } from 'react'
const logo = require('./img/logo2.png')

export class AppLogo extends Component {
	render() {
		return (
			<div className='logo'>
				<img src={logo} alt='logo' />
			</div>
		)
	}
}
