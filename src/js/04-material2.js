import * as THREE from '../../node_modules/three/build/three.module.js'
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js'

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

    window.onresize = this.resize.bind(this)
    this.resize()

    requestAnimationFrame(this.render.bind(this))
  }

  _setupCamera() {
    const width = this._canvas.clientWidth
    const heigth = this._canvas.clientHeight
    const camera = new THREE.PerspectiveCamera(75, width / heigth, 0.1, 100)
    camera.position.z = 7
    this._camera = camera
  }

  _setupControls() {
    new OrbitControls(this._camera, this._canvas)
  }

  _setupLight() {
    const color = 0xffffff
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)
    this._scene.add(light)
  }

  _setupModel() {
    // prettier-ignore
    const vertices = [
      -1,  1,  0,
       1,  1,  0,
      -1, -1,  0,
       1, -1,  0,
    ]

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    )

    // LineBasicMaterial, LineDashedMaterial
    const material = new THREE.LineDashedMaterial({
      color: 0xff0000,
      dashSize: 0.2,
      gapSize: 0.1,
      scale: 2,
    })

    // Line, LineSegment, LineLoop
    const line = new THREE.Line(geometry, material)
    line.computeLineDistances()
    this._scene.add(line)
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
  }
}

window.onload = function () {
  new App()
}
