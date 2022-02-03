import * as THREE from '../../node_modules/three/build/three.module.js'
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js'

class Particle {
  constructor(scene, geometry, material, x, y) {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, y, 0)
    scene.add(mesh)
    mesh.wrapper = this
    this.awakeTime = undefined
    this._mesh = mesh
  }

  awake(time) {
    if (!this.awakeTime) {
      this.awakeTime = time
    }
  }

  update(time) {
    if (this.awakeTime) {
      const period = 12.0
      const t = time - this.awakeTime
      if (t >= period) this.awakeTime = undefined

      this._mesh.rotation.x = THREE.Math.lerp(
        0,
        Math.PI * 2 * period,
        t / period
      )

      let h_s, l
      if (t < period / 2) {
        h_s = THREE.Math.lerp(0.0, 1.0, t / (period / 2))
        l = THREE.Math.lerp(0.1, 1.0, t / (period / 2))
      } else {
        h_s = THREE.Math.lerp(1.0, 0.0, t / (period / 2.0) - 1)
        l = THREE.Math.lerp(1.0, 0.1, t / (period / 2.0) - 1)
      }

      this._mesh.material.color.setHSL(h_s, h_s, l)
      this._mesh.position.z = h_s * 15.0
    }
  }
}

class App {
  constructor() {
    const canvas = document.querySelector('#canvas-webgl')
    this._canvas = canvas

    // antialias : 계단현상 제어
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    canvas.appendChild(renderer.domElement)
    this._renderer = renderer

    const scene = new THREE.Scene()
    this._scene = scene

    this._setupCamera()
    this._setupLight()
    this._setupModel()
    this._setupControls()
    this._setupPicking()

    window.onresize = this.resize.bind(this)
    this.resize()

    requestAnimationFrame(this.render.bind(this))
  }

  _setupControls() {
    new OrbitControls(this._camera, this._canvas)
  }

  _setupCamera() {
    const width = this._canvas.clientWidth
    const heigth = this._canvas.clientHeight
    const camera = new THREE.PerspectiveCamera(75, width / heigth, 0.1, 100)
    camera.position.z = 40
    this._camera = camera
  }

  _setupLight() {
    const color = 0xffffff
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)
    this._scene.add(light)
  }

  _setupPicking() {
    const raycaster = new THREE.Raycaster()
    raycaster.cursorNormalizedPosistion = undefined
    this._canvas.addEventListener('mousemove', this._onMouseMove.bind(this))
    this._raycaster = raycaster
  }

  _onMouseMove(e) {
    const width = this._canvas.clientWidth
    const height = this._canvas.clientHeight

    const x = (e.offsetX / width) * 2 - 1
    const y = -(e.offsetY / height) * 2 + 1

    this._raycaster.cursorNormalizedPosistion = { x, y }
  }

  _setupModel() {
    const geometry = new THREE.BoxGeometry()

    for (let x = -20; x <= 20; x += 1.1) {
      for (let y = -20; y <= 20; y += 1.1) {
        const color = new THREE.Color()
        color.setHSL(0, 0, 0.1)
        const material = new THREE.MeshStandardMaterial({ color })

        new Particle(this._scene, geometry, material, x, y)
      }
    }
  }

  resize() {
    const width = this._canvas.clientWidth
    const height = this._canvas.clientHeight

    this._camera.aspect = width / height
    this._camera.updateProjectionMatrix()

    this._renderer.setSize(width, height)
  }

  render(time) {
    this._renderer.render(this._scene, this._camera)
    this.update(time)
    requestAnimationFrame(this.render.bind(this))
  }

  update(time) {
    time *= 0.001 // second unit

    if (this._raycaster && this._raycaster.cursorNormalizedPosistion) {
      this._raycaster.setFromCamera(
        this._raycaster.cursorNormalizedPosistion,
        this._camera
      )
      const targets = this._raycaster.intersectObjects(this._scene.children)
      if (targets.length > 0) {
        const mesh = targets[0].object
        const particle = mesh.wrapper
        particle.awake(time)
      }
    }

    this._scene.traverse(obj3d => {
      if (obj3d instanceof THREE.Mesh) {
        obj3d.wrapper.update(time)
      }
    })
  }
}

window.onload = function () {
  new App()
}
