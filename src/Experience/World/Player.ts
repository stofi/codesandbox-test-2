import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d-compat'
import Experience from '../Experience'

class Player {
    experience: Experience
    scene: THREE.Scene

    physics!: RAPIER.World

    player?: {
        group: THREE.Group
        mesh: THREE.Mesh
        rigidBody: RAPIER.RigidBody
        collider: RAPIER.Collider
        camera: THREE.PerspectiveCamera
    }
    line!: THREE.Line
    renderTarget?: THREE.WebGLRenderTarget
    texture?: THREE.Texture
    renderer?: THREE.WebGLRenderer
    renderPlane?: THREE.Mesh
    up = false
    down = false
    left = false
    right = false
    mouse?: {
        x: number
        y: number
    }
    movementSpeed = 10
    rotationSpeed = 3

    constructor(physics: RAPIER.World) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.physics = physics

        this.addPlayer()
        this.addRenderTarget()
        this.addLine(new THREE.Vector3(), new THREE.Vector3(0, 0, -10))
        window.addEventListener('keydown', this.onKeyDown.bind(this))
        window.addEventListener('keyup', this.onKeyUp.bind(this))
        // window.addEventListener('mousemove', this.onMouseMove.bind(this))
    }

    onKeyDown(event: KeyboardEvent) {
        const up = event.key === 'w' || event.key === 'ArrowUp'
        const down = event.key === 's' || event.key === 'ArrowDown'
        const left = event.key === 'a' || event.key === 'ArrowLeft'
        const right = event.key === 'd' || event.key === 'ArrowRight'
        if (up) {
            this.up = true
        }
        if (down) {
            this.down = true
        }
        if (left) {
            this.left = true
        }
        if (right) {
            this.right = true
        }
    }
    onKeyUp(event: KeyboardEvent) {
        const up = event.key === 'w' || event.key === 'ArrowUp'
        const down = event.key === 's' || event.key === 'ArrowDown'
        const left = event.key === 'a' || event.key === 'ArrowLeft'
        const right = event.key === 'd' || event.key === 'ArrowRight'
        if (up) {
            this.up = false
        }
        if (down) {
            this.down = false
        }
        if (left) {
            this.left = false
        }
        if (right) {
            this.right = false
        }
    }

    addPlayer() {
        // capsule
        const geometry = new THREE.CylinderBufferGeometry(0.5, 0.5, 2, 32)
        const material = new THREE.MeshStandardMaterial({
            color: 'pink',
            roughness: 1,
        })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(0, 1, 0)
        const rigidBodyDesc = RAPIER.RigidBodyDesc.kinematicVelocityBased()
            .restrictTranslations(true, false, true)
            .restrictRotations(false, true, false)

        const rigidBody = this.physics.createRigidBody(rigidBodyDesc)
        const colliderDesc = RAPIER.ColliderDesc.cylinder(2, 0.5).setFriction(
            0.1
        )
        const collider = this.physics.createCollider(
            colliderDesc,
            rigidBody.handle
        )
        const group = new THREE.Group()
        group.add(mesh)
        const camera = new THREE.PerspectiveCamera(
            100,
            window.innerWidth / window.innerHeight,
            0.1,
            10
        )
        // add camera helper
        const helper = new THREE.CameraHelper(camera)
        this.scene.add(helper)

        camera.position.copy(mesh.position)
        camera.position.y = 1.6
        group.add(camera)

        this.scene.add(group)
        this.player = {
            mesh,
            rigidBody,
            collider,
            group,
            camera,
        }
        // activate camera
    }
    addRenderTarget() {
        this.renderer = this.experience.renderer.instance
        const width = window.innerWidth / 4
        this.renderTarget = new THREE.WebGLRenderTarget(width, width, {
            format: THREE.RGBAFormat,
            minFilter: THREE.LinearFilter,
            magFilter: THREE.NearestFilter,
        })
        const planeHeight = 0.5
        const planeWidth = 0.5
        const planelikeGeometry = new THREE.PlaneBufferGeometry(
            planeWidth,
            planeHeight
        )
        const plane = new THREE.Mesh(
            planelikeGeometry,
            new THREE.MeshBasicMaterial({ map: this.renderTarget.texture })
            // new THREE.MeshBasicMaterial({ color: 'red' })
        )
        plane.position.set(-0.37, 0.37, -1)

        this.experience.camera.instance.add(plane)
        this.renderPlane = plane
    }

    addImpulse(impulse: THREE.Vector3) {
        if (this.player) {
            this.player.rigidBody.applyImpulse(impulse as RAPIER.Vector3, true)
        }
    }

    addLine(start: THREE.Vector3, end: THREE.Vector3) {
        if (this.line) {
            this.scene.remove(this.line)
        }
        const points = [start, end]

        const line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(points),
            new THREE.LineBasicMaterial({
                color: 'green',
                linewidth: 200,
            })
        )
        this.line = line
        this.scene.add(line)
    }

    getInputDirectionVector(): THREE.Vector3 {
        const direction = new THREE.Vector3()
        if (this.up) {
            direction.z -= 1
        }
        if (this.down) {
            direction.z += 1
        }
        return direction.normalize()
    }
    getInputRotationVector(): THREE.Vector3 {
        const rotation = new THREE.Vector3()
        if (this.left) {
            rotation.y += 1
        }
        if (this.right) {
            rotation.y -= 1
        }
        return rotation.normalize()
    }

    resize() {
        // noop
    }

    update() {
        // noop
        if (this.physics) {
            if (this.player) {
                if (this.renderer && this.renderTarget && this.renderPlane) {
                    this.renderer.setRenderTarget(this.renderTarget)
                    this.renderer.render(this.scene, this.player.camera)
                    this.renderer.setRenderTarget(null)
                }
                const inputDirection = this.getInputDirectionVector()
                const inputRotation = this.getInputRotationVector()

                this.player.rigidBody.setAngvel(
                    inputRotation.multiplyScalar(
                        this.rotationSpeed
                    ) as RAPIER.Vector3,
                    true
                )

                const currentDirection = this.player.rigidBody.rotation()
                const currentDirectionQ = new THREE.Quaternion()
                currentDirectionQ.x = currentDirection.x
                currentDirectionQ.y = currentDirection.y
                currentDirectionQ.z = currentDirection.z
                currentDirectionQ.w = currentDirection.w
                // quternion to euler
                const rotation = new THREE.Euler().setFromQuaternion(
                    currentDirectionQ,
                    'YXZ'
                )

                const newDirection = inputDirection.clone().applyEuler(rotation)

                this.line.position.copy(this.player.group.position).y += 0.5
                this.line.rotation.y = rotation.y

                this.player.rigidBody.setLinvel(
                    newDirection.multiplyScalar(
                        this.movementSpeed
                    ) as RAPIER.Vector3,
                    true
                )

                this.player.group.position.copy(
                    this.player.rigidBody.translation() as THREE.Vector3
                )
                this.player.group.quaternion.copy(
                    this.player.rigidBody.rotation() as THREE.Quaternion
                )
            }
        }
    }
}
export default Player
