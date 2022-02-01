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
    camera.position.z = 3
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
    const material = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0x0000,
      roughness: 0.25,
      metalness: 0,
      flatShading: false,
      wireframe: false,
    })

    const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)
    box.position.set(-1, 0, 0)
    this._scene.add(box)

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 32, 32),
      material
    )
    sphere.position.set(1, 0, 0)
    this._scene.add(sphere)
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
