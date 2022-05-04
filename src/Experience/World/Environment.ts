import * as THREE from 'three'
import Experience from '../Experience'

class Environment {
    experience: Experience
    scene: THREE.Scene

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.addHemiSphereLight()
    }

    setBackground(color: string) {
        this.scene.background = new THREE.Color(color)
    }

    addHemiSphereLight() {
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6)
        hemiLight.color.setHSL(0.6, 1, 0.6)
        hemiLight.groundColor.setHSL(0.095, 1, 0.75)
        hemiLight.position.set(0, 50, 0)
        this.scene.add(hemiLight)
    }
}
export default Environment
