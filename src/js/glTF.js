import * as THREE from '../../node_modules/three/build/three.module.js'
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from '../../node_modules/three/examples/jsm/loaders/GLTFLoader.js'

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
    new OrbitControls(this._camera, this._canvas)
  }

  _zoomFit(object3D, camera) {
    // 모델의 경계 박스
    const box = new THREE.Box3().setFromObject(object3D)

    // 모델의 경계 박스 대각 길이
    const sizeBox = box.getSize(new THREE.Vector3()).length()

    // 모델의 경계 박스 중심 위치
    const centerBox = box.getCenter(new THREE.Vector3())

    // 모델 크기의 절반값
    const halfSizeModel = sizeBox * 0.5

    // 카메라의 fov의 절반값
    const halfFov = THREE.Math.degToRad(camera.fov * 0.5)

    // 모델을 화면에 꽉 채우기 위한 적당한 거리
    const distance = halfSizeModel / Math.tan(halfFov)

    // 모델 중심에서 카메라 위치로 향하는 방향 단위 백터 계산
    const direction = new THREE.Vector3()
      .subVectors(camera.position, centerBox)
      .normalize()

    // '단위 방향 벡터' 방향으로 모델 중심 위치에서 distance 거리에 대한 위치
    const position = direction.multiplyScalar(distance).add(centerBox)
    camera.position.copy(position)

    // 모델의 크기에 맞춰 카메라의 near, far 값을 대략적으로 조정
    camera.near = sizeBox / 100
    camera.far = sizeBox * 100

    // 카메라 기본 속성 변경에 따른 투영행렬 업데이트
    camera.updateProjectionMatrix()

    // 카메라가 모델의 중심을 바라보도록
    camera.lookAt(centerBox.x, centerBox.y, centerBox.z)
  }

  _setupCamera() {
    const width = this._canvas.clientWidth
    const heigth = this._canvas.clientHeight
    const camera = new THREE.PerspectiveCamera(75, width / heigth, 0.1, 100)

    camera.position.z = 4
    this._camera = camera

    this._scene.add(this._camera)
  }

  _setupLight() {
    const color = 0xffffff
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)
    // this._scene.add(light)
    this._camera.add(light)
  }

  _setupModel() {
    const gltfLoader = new GLTFLoader()
    const url = '../data/adamHead/adamHead.gltf'
    gltfLoader.load(url, gltf => {
      const root = gltf.scene
      root.rotation.y = Math.PI
      this._scene.add(root)

      this._zoomFit(root, this._camera)
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
    // this._cube.rotation.x = time
    // this._cube.rotation.y = time
  }
}

window.onload = function () {
  new App()
}
