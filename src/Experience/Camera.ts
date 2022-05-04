import * as THREE from 'three'

import type Sizes from './Utils/Sizes'

import Experience from './Experience'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

class Camera {
    experience: Experience
    sizes: Sizes
    scene: THREE.Scene
    canvas: HTMLCanvasElement
    instance!: THREE.PerspectiveCamera
    controls: OrbitControls
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.setInstance()
        this.controls = new OrbitControls(this.instance, this.canvas)
    }

    private setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            65,
            this.sizes.width / this.sizes.height,
            0.1,
            100
        )
        this.instance.position.set(0, 15, 15)

        this.instance.lookAt(new THREE.Vector3(0, 0, 0))
        this.scene.add(this.instance)
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        this.controls.update()
    }
}

export default Camera
