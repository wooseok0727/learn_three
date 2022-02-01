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
    this._setupVideo()
    this._setupControls()

    window.onresize = this.resize.bind(this)
    this.resize()

    requestAnimationFrame(this.render.bind(this))
  }

  _setupVideo() {
    const video = document.createElement('video')

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = {
        video: { width: 1280, height: 720 },
      }
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          video.srcObject = stream
          video.play()

          const videoTexture = new THREE.VideoTexture(video)
          this._videoTexture = videoTexture

          this._setupModel()
        })
        .catch(function (error) {
          console.error('카메라에 접근할 수 없습니다', error)
        })
    } else {
      console.error('MediaDevices 인터페이스 사용 불가')
    }
  }

  _setupControls() {
    new OrbitControls(this._camera, this._canvas)
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
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshPhongMaterial({
      map: this._videoTexture,
      // color: 0x44a88,
    })

    const cube = new THREE.Mesh(geometry, material)

    this._scene.add(cube)
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
    // this._cube.rotation.x = time
    // this._cube.rotation.y = time
  }
}

window.onload = function () {
  new App()
}
