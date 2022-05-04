import type Resources from '../Utils/Resources'

import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d-compat'
import Experience from '../Experience'
import Environment from './Environment'
import Player from './Player'
import Ball from './Ball'
import Ground from './Ground'
import Walls from './Walls'

const gravity = new THREE.Vector3(0, -9.81, 0)

class World {
    experience: Experience
    scene: THREE.Scene
    resources: Resources
    environment?: Environment

    physics!: RAPIER.World

    ground?: Ground
    ball?: Ball
    player?: Player
    walls?: Walls

    size = new THREE.Vector3(10, 10, 10)

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        RAPIER.init().then(() => {
            this.physics = new RAPIER.World(gravity)
            this.addObjects()
        })

        this.resources.on('ready', this.onReady.bind(this))
    }

    private onReady() {
        this.environment = new Environment()
    }

    addObjects() {
        this.ground = new Ground(this.physics, this.size)
        this.walls = new Walls(this.physics, this.size)
        this.player = new Player(this.physics)
        this.ball = new Ball(this.physics)
    }

    resize() {
        // noop
    }

    update() {
        if (this.physics) {
            this.physics.step()
            if (this.ball) {
                this.ball.update()
            }
            if (this.player) {
                this.player.update()
            }
        }
    }
}
export default World
