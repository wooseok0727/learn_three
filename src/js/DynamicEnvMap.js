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
    this._setupBackground()
    this._setupModel()
    this._setupControls()

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
    const camera = new THREE.PerspectiveCamera(75, width / heigth, 0.1, 1000)
    camera.position.set(0, 4, 9)
    this._camera = camera
  }

  _setupLight() {
    this._scene.add(new THREE.AmbientLight(0xffffff, 0.2))

    const color = 0xffffff
    const intensity = 5
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)
    this._scene.add(light)
  }

  _setupBackground() {}

  _setupModel() {
    const renderTargetOptions = {
      format: THREE.RGBAFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipMapLinearFilter,
    }

    const shpereRenderTarget = new THREE.WebGLCubeRenderTarget(
      512,
      renderTargetOptions
    )
    const shpereCamera = new THREE.CubeCamera(0.1, 1000, shpereRenderTarget)

    const shpereGeometry = new THREE.SphereGeometry(1.5)
    const shereMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      envMap: shpereRenderTarget.texture,
      reflectivity: 0.95,
    })

    const sphere = new THREE.Mesh(shpereGeometry, shereMaterial)
    const spherePivot = new THREE.Object3D()
    spherePivot.add(sphere)
    spherePivot.add(shpereCamera)
    spherePivot.position.set(1, 0, 1)
    this._scene.add(spherePivot)

    const cylinderRenderTarget = new THREE.WebGLCubeRenderTarget(
      2048,
      renderTargetOptions
    )
    const cylinderCamera = new THREE.CubeCamera(0.1, 1000, cylinderRenderTarget)
    const cylinderGeometry = new THREE.CylinderGeometry(0.5, 1, 3, 32)
    const cylinderMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      envMap: cylinderRenderTarget.texture,
      reflectivity: 0.95,
    })
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial)
    const cylinderPivot = new THREE.Object3D()
    cylinderPivot.add(cylinder)
    cylinderPivot.add(cylinderCamera)
    cylinderPivot.position.set(-1, 0, -1)
    this._scene.add(cylinderPivot)

    const torusRenderTarget = new THREE.WebGLCubeRenderTarget(
      2048,
      renderTargetOptions
    )
    const torusCamera = new THREE.CubeCamera(0.1, 1000, torusRenderTarget)
    const torusGeometry = new THREE.TorusGeometry(4, 0.5, 24, 64)
    const torusMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      envMap: torusRenderTarget.texture,
      reflectivity: 0.95,
    })
    const torus = new THREE.Mesh(torusGeometry, torusMaterial)
    const torusPivot = new THREE.Object3D()
    torusPivot.add(torus)
    torusPivot.add(torusCamera)
    torus.rotation.x = Math.PI / 2
    this._scene.add(torusPivot)
    torus.name = 'torus'

    const planeRenderTarget = new THREE.WebGLCubeRenderTarget(
      2048,
      renderTargetOptions
    )
    const planeCamera = new THREE.CubeCamera(0.1, 1000, planeRenderTarget)
    const planeGeometry = new THREE.PlaneGeometry(12, 12)
    const planeMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      envMap: planeRenderTarget.texture,
      reflectivity: 0.95,
    })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    const planePivot = new THREE.Object3D()
    planePivot.add(plane)
    planePivot.add(planeCamera)
    plane.rotation.x = -Math.PI / 2
    planePivot.position.y = -4.8
    this._scene.add(planePivot)
  }

  resize() {
    const width = this._canvas.clientWidth
    const height = this._canvas.clientHeight

    this._camera.aspect = width / height
    this._camera.updateProjectionMatrix()

    this._renderer.setSize(width, height)
  }

  render(time) {
    this._scene.traverse(obj => {
      if (obj instanceof THREE.Object3D) {
        const mesh = obj.children[0]
        const cubeCamera = obj.children[1]

        if (
          mesh instanceof THREE.Mesh &&
          cubeCamera instanceof THREE.CubeCamera
        ) {
          mesh.visible = false
          cubeCamera.update(this._renderer, this._scene)
          mesh.visible = true
        }
      }
    })

    this._renderer.render(this._scene, this._camera)
    this.update(time)
    requestAnimationFrame(this.render.bind(this))
  }

  update(time) {
    time *= 0.001 // second unit

    const torus = this._scene.getObjectByName('torus')
    if (torus) torus.rotation.x = Math.sin(time)
  }
}

window.onload = function () {
  new App()
}
