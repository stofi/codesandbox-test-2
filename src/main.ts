import './entry.css'
import './style.css'

import Experience from './Experience/Experience.ts'
;(() => {
    const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement

    console.log(canvas)

    new Experience(canvas)

    console.log('hi xxx')
})()
