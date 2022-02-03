import * as THREE from '../../node_modules/three/build/three.module.js'
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from '../../node_modules/three/examples/jsm/loaders/FBXLoader.js'

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

  _setupControls() {
    this._controls = new OrbitControls(this._camera, this._canvas)
  }

  _zoomFit(object3D, camera, viewMode, bFront) {
    const box = new THREE.Box3().setFromObject(object3D)
    const sizeBox = box.getSize(new THREE.Vector3()).length()
    const centerBox = box.getCenter(new THREE.Vector3())

    //
    let offsetX = 0,
      offsetY = 0,
      offsetZ = 0

    viewMode === 'X'
      ? (offsetX = 1)
      : viewMode === 'Y'
      ? (offsetY = 1)
      : (offsetZ = 1)

    if (!bFront) {
      offsetX *= -1
      offsetY *= -1
      offsetZ *= -1
    }
    camera.position.set(
      centerBox.x + offsetX,
      centerBox.y + offsetY,
      centerBox.z + offsetZ
    )

    const halfSizeModel = sizeBox * 0.5
    const halfFov = THREE.Math.degToRad(camera.fov * 0.5)
    const distance = halfSizeModel / Math.tan(halfFov)
    const direction = new THREE.Vector3()
      .subVectors(camera.position, centerBox)
      .normalize()
    const position = direction.multiplyScalar(distance).add(centerBox)

    camera.position.copy(position)
    camera.near = sizeBox / 100
    camera.far = sizeBox * 100

    camera.updateProjectionMatrix()

    camera.lookAt(centerBox.x, centerBox.y, centerBox.z)
    this._controls.target.set(centerBox.x, centerBox.y, centerBox.z)
  }

  _setupCamera() {
    const width = this._canvas.clientWidth
    const heigth = this._canvas.clientHeight
    const camera = new THREE.PerspectiveCamera(75, width / heigth, 0.1, 100)

    camera.position.z = 2
    this._camera = camera
  }

  _setupLight() {
    const color = 0xffffff
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)
    this._scene.add(light)
  }

  _setupModel() {
    this._clock = new THREE.Clock()

    const loader = new FBXLoader()
    loader.load('../data/Short Left Side Step.fbx', object => {
      this._mixer = new THREE.AnimationMixer(object)
      this._mixer.loop
      const action = this._mixer.clipAction(object.animations[0])
      action.play()

      object.rotation.x = THREE.Math.degToRad(15)
      this._scene.add(object)

      this._zoomFit(object, this._camera, 'Z', true)
    })
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

    // 호출후 다시 호출되기까지의 경과된 시간
    const delta = this._clock.getDelta()
    if (this._mixer) this._mixer.update(delta)
  }
}

window.onload = function () {
  new App()
}
