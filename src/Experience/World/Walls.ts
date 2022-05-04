import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d-compat'
import Experience from '../Experience'

class Ground {
    experience: Experience
    scene: THREE.Scene

    physics!: RAPIER.World

    walls?: {
        mesh: THREE.Mesh
        colliders: RAPIER.Collider[]
    }
    size: THREE.Vector3

    constructor(physics: RAPIER.World, size: THREE.Vector3) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.physics = physics
        this.size = size
        //this.addWalls()
    }

    addWalls() {
        const mesh = new THREE.Mesh(
            new THREE.BoxBufferGeometry(this.size.x, this.size.y, this.size.z),
            new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.5
            })
        )

        mesh.material.side = THREE.BackSide
        // flip normals

        mesh.position.y = this.size.y / 2

        // create four colliders around the walls
        const colliders = []
        const colliderDesc = RAPIER.ColliderDesc.cuboid(
            this.size.x / 2,
            this.size.y,
            this.size.z / 2
        )
        colliders.push(
            this.physics.createCollider(
                colliderDesc.setTranslation(
                    -this.size.x / 2,
                    this.size.y / 2,
                    -this.size.z / 2
                )
            )
        )
        colliders.push(
            this.physics.createCollider(
                colliderDesc.setTranslation(
                    -this.size.x / 2,
                    this.size.y / 2,
                    this.size.z / 2
                )
            )
        )
        colliders.push(
            this.physics.createCollider(
                colliderDesc.setTranslation(
                    this.size.x / 2,
                    this.size.y / 2,
                    -this.size.z / 2
                )
            )
        )
        colliders.push(
            this.physics.createCollider(
                colliderDesc.setTranslation(
                    this.size.x / 2,
                    this.size.y / 2,
                    this.size.z / 2
                )
            )
        )

        this.walls = {
            mesh,
            colliders
        }
        this.scene.add(mesh)
    }

    update() {
        // nothing
    }
}
export default Ground
