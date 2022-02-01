import * as THREE from '../../node_modules/three/build/three.module.js'
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js'
import { RectAreaLightUniformsLib } from '../../node_modules/three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import { RectAreaLightHelper } from '../../node_modules/three/examples/jsm/helpers/RectAreaLightHelper.js'

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

    // const aspect = window.innerWidth / window.innerHeight
    // const camera = new THREE.OrthographicCamera(
    //   -1 * aspect,
    //   1 * aspect,
    //   1,
    //   -1,
    //   0.1,
    //   100
    // )

    // camera.zoom = 0.15

    // camera.position.z = 2
    camera.position.set(7, 7, 0)
    camera.lookAt(0, 0, 0)

    this._camera = camera
  }

  _setupControls() {
    new OrbitControls(this._camera, this._canvas)
  }

  _setupLight() {
    RectAreaLightUniformsLib.init()

    const light = new THREE.RectAreaLight(0xffffff, 10, 6, 1)
    light.position.set(0, 5, 0)
    light.rotation.x = THREE.Math.degToRad(-90)

    const helper = new RectAreaLightHelper(light)
    light.add(helper)

    this._scene.add(light)
    this._light = light
  }

  _setupModel() {
    const groundGeometry = new THREE.PlaneGeometry(10, 10)
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: '#2c3e50',
      roughness: 0.5,
      metalness: 0.5,
      side: THREE.DoubleSide,
      wireframe: false,
    })

    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = THREE.Math.degToRad(-90)
    this._scene.add(ground)

    const bigSphereGeometry = new THREE.SphereGeometry(1.5, 64, 64, 0, Math.PI)
    const bigSphereMaterial = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.1,
      metalness: 0.2,
    })
    const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial)
    bigSphere.rotation.x = THREE.Math.degToRad(-90)
    this._scene.add(bigSphere)

    const torusGeometry = new THREE.TorusGeometry(0.4, 0.1, 32, 32)
    const torusMaterial = new THREE.MeshStandardMaterial({
      color: '#9b59b6',
      roughness: 0.5,
      metalness: 0.9,
    })

    for (let i = 0; i < 8; i++) {
      const torusPivot = new THREE.Object3D()
      const torus = new THREE.Mesh(torusGeometry, torusMaterial)
      torusPivot.rotation.y = THREE.Math.degToRad(45 * i)
      torus.position.set(3, 0.5, 0)
      torusPivot.add(torus)
      this._scene.add(torusPivot)
    }

    const smallSphereGeometry = new THREE.SphereGeometry(0.3, 32, 32)
    const smallSphereMaterial = new THREE.MeshStandardMaterial({
      color: '#e74c3c',
      roughness: 0.2,
      metalness: 0.5,
    })

    const smallSpherePivot = new THREE.Object3D()
    const smallSphere = new THREE.Mesh(smallSphereGeometry, smallSphereMaterial)
    smallSpherePivot.add(smallSphere)
    smallSpherePivot.name = 'smallSpherePivot'
    smallSphere.position.set(3, 0.5, 0)
    this._scene.add(smallSpherePivot)

    const targetPivot = new THREE.Object3D()
    const target = new THREE.Object3D()
    targetPivot.add(target)
    targetPivot.name = 'targetPivot'
    target.position.set(3, 0.5, 0)
    this._scene.add(targetPivot)
  }

  // resize() {
  //   const width = this._canvas.clientWidth
  //   const height = this._canvas.clientHeight

  //   this._camera.aspect = width / height
  //   this._camera.updateProjectionMatrix()

  //   this._renderer.setSize(width, height)
  // }

  resize() {
    const width = this._canvas.clientWidth
    const height = this._canvas.clientHeight
    const aspect = width / height

    if (this._camera instanceof THREE.PerspectiveCamera) {
      this._camera.aspect = aspect
    } else {
      this._camera.left = -1 * aspect // xLeft
      this._camera.right = 1 * aspect // xRight
    }

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

    const smallSpherePivot = this._scene.getObjectByName('smallSpherePivot')
    if (smallSpherePivot) {
      smallSpherePivot.rotation.y = THREE.Math.degToRad(time * 50)

      const smallSphere = smallSpherePivot.children[0]
      smallSphere.getWorldPosition(this._camera.position)

      const targetPivot = this._scene.getObjectByName('targetPivot')
      if (targetPivot) {
        targetPivot.rotation.y = THREE.Math.degToRad(time * 50 + 10)

        const target = targetPivot.children[0]
        const pt = new THREE.Vector3()

        target.getWorldPosition(pt)
        this._camera.lookAt(pt)
      }

      if (this._light.target) {
        const smallSphere = smallSpherePivot.children[0]
        smallSphere.getWorldPosition(this._light.target.position)

        if (this._lightHelper) this._lightHelper.update()
      }
    }
  }
}

window.onload = function () {
  new App()
}
