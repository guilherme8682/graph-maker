import './style.css'
import React, { Component } from 'react'
import { Button } from '../button'
import { GraphController } from '../../../../controller/GraphController'

export class ButtonReadFile extends Component {
	loadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files![0]
		if (!file) return
		const reader = new FileReader()
		reader.readAsText(file)
		const e = (await new Promise(r => (reader.onload = r))) as ProgressEvent<FileReader>
		GraphController.loadGraphFile(e.target!.result as string)
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
