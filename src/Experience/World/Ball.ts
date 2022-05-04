import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d-compat'
import Experience from '../Experience'

class Ball {
    experience: Experience
    scene: THREE.Scene

    physics!: RAPIER.World

    ball?: {
        mesh: THREE.Mesh
        rigidBody: RAPIER.RigidBody
        collider: RAPIER.Collider
    }

    constructor(physics: RAPIER.World) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.physics = physics

        this.addBall()
    }

    addBall() {
        const mesh = new THREE.Mesh(
            new THREE.SphereBufferGeometry(0.5, 32, 32),
            new THREE.MeshStandardMaterial({
                color: 'red',
                roughness: 0.5
            })
        )
        mesh.position.set(0, 3, 0)
        const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(mesh.position.x, mesh.position.y, mesh.position.z)
            .setCanSleep(false)

        const rigidBody = this.physics.createRigidBody(rigidBodyDesc)
        const colliderDesc = RAPIER.ColliderDesc.ball(0.5).setFriction(0.1)
        const collider = this.physics.createCollider(
            colliderDesc,
            rigidBody.handle
        )
        // cant sleep

        this.ball = {
            mesh,
            rigidBody,
            collider
        }
        this.scene.add(mesh)
    }

    update() {
        if (this.ball) {
            this.ball.mesh.position.copy(
                this.ball.rigidBody.translation() as THREE.Vector3
            )
        }
    }
}
export default Ball
