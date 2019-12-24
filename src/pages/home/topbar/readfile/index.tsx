import './style.css'
import React, { Component } from 'react'
import { Button } from '../button'
import { GraphController } from '../../../../controller/GraphController'
import { loadImagGraph } from '../../../../controller/ImageLoader'

const imagesSupported = ['PNG', 'JPG', 'JPEG']

export class ButtonReadFile extends Component {
	loadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const [file] = event.target.files!
		if (!file) return
		const extension = file.name.split('.').pop()
		if (!extension) return
		const ext = extension.toUpperCase()
		const reader = new FileReader()
		if (ext === 'JSON') {
			reader.readAsText(file)
			await new Promise(r => (reader.onload = r))
			GraphController.loadGraphFile(reader.result as string)
		} else if (imagesSupported.includes(ext)) {
			reader.readAsDataURL(file)
			await new Promise(r => (reader.onload = r))
			loadImagGraph(reader.result as string)
		}
		const a = document.getElementById('file-selector') as HTMLInputElement
		a.value = ''
	}
	render() {
		return (
			<div className='button-readfile-container'>
				<input
					className='button-readfile'
					id='file-selector'
					type='file'
					onChange={this.loadFile}
				></input>
				<label htmlFor='file-selector'>
					<Button icon='folder_open' />
				</label>
			</div>
		)
	}
}
