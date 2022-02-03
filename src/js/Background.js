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
    // this._setupModel()
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
    camera.position.z = 80
    this._camera = camera
  }

  _setupLight() {
    const color = 0xffffff
    const intensity = 1.5
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)
    this._scene.add(light)
  }

  _setupBackground() {
    // this._scene.background = new THREE.Color('#9b59b6')
    // this._scene.fog = new THREE.Fog('#9b59b6', 0, 150)
    // this._scene.fog = new THREE.FogExp2('#9b59b6', 0.02)

    // const loader = new THREE.TextureLoader()
    // loader.load('../image/01.png', texture => {
    //   this._scene.background = texture
    //   this._setupModel()
    // })

    // const loader = new THREE.CubeTextureLoader()
    // loader.load(
    //   [
    //     '../image/NiagaraFalls2/posx.jpg',
    //     '../image/NiagaraFalls2/negx.jpg',
    //     '../image/NiagaraFalls2/posy.jpg',
    //     '../image/NiagaraFalls2/negy.jpg',
    //     '../image/NiagaraFalls2/posz.jpg',
    //     '../image/NiagaraFalls2/negz.jpg',
    //   ],
    //   cubeTexture => {
    //     this._scene.background = cubeTexture
    //     this._setupModel()
    //   }
    // )

    const loader = new THREE.TextureLoader()

    loader.load('../image/qwantani.jpg', texture => {
      const renderTarget = new THREE.WebGLCubeRenderTarget(texture.image.height)
      renderTarget.fromEquirectangularTexture(this._renderer, texture)
      this._scene.background = renderTarget.texture
      this._setupModel()
    })
  }

  _setupModel() {
    const pmremG = new THREE.PMREMGenerator(this._renderer)
    // const renderTarget = pmremG.fromEquirectangular(this._scene.background)
    const renderTarget = pmremG.fromEquirectangular(this._scene.background)

    const geometry = new THREE.SphereBufferGeometry()

    const material1 = new THREE.MeshStandardMaterial({
      color: '#2ecc71',
      roughness: 0,
      metalness: 1,
      envMap: renderTarget.texture,
    })

    const material2 = new THREE.MeshStandardMaterial({
      color: '#e74c3c',
      roughness: 0,
      metalness: 1,
      envMap: renderTarget.texture,
    })

    const rangeMin = -20.0,
      rangeMax = 20.0
    const gap = 10.0
    let flag = true

    for (let x = rangeMin; x <= rangeMax; x += gap) {
      for (let y = rangeMin; y <= rangeMax; y += gap) {
        for (let z = rangeMin * 10; z <= rangeMax; z += gap) {
          flag = !flag

          const mesh = new THREE.Mesh(geometry, flag ? material1 : material2)

          mesh.position.set(x, y, z)

          this._scene.add(mesh)
        }
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
    // this._cube.rotation.x = time
    // this._cube.rotation.y = time
  }
}

window.onload = function () {
  new App()
}
