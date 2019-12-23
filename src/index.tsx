import React from 'react'
import ReactDOM from 'react-dom'
import { Main } from './pages'

ReactDOM.render(<Main />, document.getElementById('root'))

document.addEventListener('contextmenu', event => event.preventDefault())
