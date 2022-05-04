import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d-compat'
import Experience from '../Experience'

class Ground {
    experience: Experience
    scene: THREE.Scene

    physics!: RAPIER.World

    ground?: {
        mesh: THREE.Mesh
        collider: RAPIER.Collider
    }
    size: THREE.Vector3

    constructor(physics: RAPIER.World, size: THREE.Vector3) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.physics = physics

        this.size = size.clone()
        this.size.y = 1
        this.addGround()
    }

    addGround() {
        const mesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(this.size.x, this.size.z),
            new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.5,
            })
        )
        mesh.rotation.x = -Math.PI / 2
        mesh.position.y = 0
        const colliderDesc = RAPIER.ColliderDesc.cuboid(
            this.size.x / 2,
            this.size.y,
            this.size.z / 2
        )
            .setFriction(0.1)
            .setTranslation(0, -this.size.y, 0)
        const collider = this.physics.createCollider(colliderDesc)
        this.ground = {
            mesh,
            collider,
        }
        this.scene.add(mesh)
    }

    update() {
        // nothing
    }
}
export default Ground
