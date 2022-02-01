import * as THREE from '../../node_modules/three/build/three.module.js'

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

    window.onresize = this.resize.bind(this)
    this.resize()

    requestAnimationFrame(this.render.bind(this))
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

  // prettier-ignore
  _setupModel() {
    const rawPositions = [
      -1, -1, 0,
       1, -1, 0,
      -1,  1, 0,
       1,  1, 0
    ]

    const rawNormals = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
    ]

    const rawColors = [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
      1, 1, 0,
    ]

    const rawUVs = [
      0, 0,
      1, 0,
      0, 1,
      1, 1
    ]

    
    const positions = new Float32Array(rawPositions)
    const normals = new Float32Array(rawNormals)
    const colors = new Float32Array(rawColors)
    const uvs = new Float32Array(rawUVs)

    const geometry = new THREE.BufferGeometry()

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))

    geometry.setIndex([
      0, 1, 2,
      2, 1, 3
    ])

    // geometry.computeVertexNormals()

    const textureLoader = new THREE.TextureLoader()
    const map = textureLoader.load('../image/uv_grid_opengl.jpg')

    const material = new THREE.MeshPhongMaterial({ 
      color: 0xffffff, 
      // vertexColors: true,
      map: map
    })

    const box = new THREE.Mesh(geometry, material)
    this._scene.add(box)
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
