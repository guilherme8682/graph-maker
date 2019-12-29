import React from 'react'
import ReactDOM from 'react-dom'
import { Main } from './pages'

document.addEventListener('contextmenu', event => event.preventDefault())

ReactDOM.render(<Main />, document.getElementById('root'))
