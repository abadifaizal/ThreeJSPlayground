import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import gsap from 'gsap'
import GUI from 'lil-gui'

/**
 * Debug
 */
const gui = new GUI({
  width: 300,
  title: 'Nice Debug UI',
  closeFolders: false
})
//gui.close() // Close the GUI by default
//gui.hide() // Hide the GUI by default
window.addEventListener('keydown', (event) => {
  if(event.key === 'h') {
    gui.show(gui._hidden)
  } 
})

const debugObject = {}

/**
 * Cursor
 * >> The cursor position is normalized, meaning that the x and y values are between -0.5 and 0.5
 * ** The x value is between -0.5 and 0.5, where -0.5 is the far left and 0.5 is the far right
 * ** The y value is between -0.5 and 0.5, where -0.5 is the bottom and 0.5 is the top
 * ** The y value must be inverted because the y value is reversed in the 3D space
 */
const cursor = {
  x: 0,
  y: 0
}

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5
  cursor.y =  - (event.clientY / sizes.height - 0.5)
})

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load('/textures/door/color.jpg')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// loadingManager.onStart = () => {
//   console.log('loading started')
// }

// loadingManager.onLoad = () => {
//   console.log('loading finished')
// }

// loadingManager.onProgress = () => {
//   console.log('loading progressing')
// }

// loadingManager.onError = (e) => {
//   console.log('loading error', e)
// }

// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
// colorTexture.wrapS = THREE.MirroredRepeatWrapping
// colorTexture.wrapT = THREE.MirroredRepeatWrapping
// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5
// colorTexture.rotation = Math.PI * 0.25
// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5

// colorTexture.minFilter = THREE.NearestFilter
colorTexture.magFilter = THREE.NearestFilter

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Make the canvas responsive
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  // Renderer the canvas size to match the device pixel ratio but set the maximum pixel ratio to 2
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Make canvas fullscreen on double click
// Make it work on Safari
window.addEventListener('dblclick', () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

  if(!fullscreenElement) {
    if(canvas.requestFullscreen) {
      canvas.requestFullscreen()
    } else if(canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen()
    }
  } else {
    if(document.exitFullscreen) {
      document.exitFullscreen()
    } else if(document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }
})

// Scene
const scene = new THREE.Scene()

// Object
debugObject.color = '#a778d8'

// const geometry = new THREE.BufferGeometry()
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)

const count = 50
const positionsArray = new Float32Array(count * 3 * 3)

for(let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = (Math.random() - 0.5) * 4
}

/**
 * >! BufferGeometry Index
 * 
 * ** To improve performance, we can use an index buffer to reuse vertices
 * *** The index buffer is an array of integers that reference the vertices in the position buffer
 * *** The index buffer is set using the setIndex method
 */

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)

// geometry.setAttribute('position', positionsAttribute)

const material = new THREE.MeshBasicMaterial({
  map: colorTexture
})

const mesh = new THREE.Mesh(geometry,material)
scene.add(mesh)

const cubeTweaks = gui.addFolder('Awesome Cube')
cubeTweaks.close() // Close the folder by default

cubeTweaks.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation')
cubeTweaks.add(mesh, 'visible').name('visible')
cubeTweaks.add(material, 'wireframe').name('wireframe')
cubeTweaks.addColor(debugObject, 'color').name('color').onChange(() => {
  material.color.set(debugObject.color)
})
debugObject.spin = () => {
  gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2 })
}
cubeTweaks.add(debugObject, 'spin')
debugObject.subdivision = 2
/**
 * >! BufferGeometry Subdivision
 * 
 * ** To subdivide a BufferGeometry, we can use the BufferGeometryUtils.mergeVertices method
 * *** The method will merge vertices that are close to each other
 * *** The recommended value is between 1 and 20
 * *** use onFinishedChange instead of onChange to avoid performance issues
 */
cubeTweaks.add(debugObject, 'subdivision').min(1).max(20).step(1).onFinishChange(() => {
  /**
   * >! BufferGeometry Disposal
   * 
   * ** To dispose of a BufferGeometry, we can use the dispose method
   * *** The dispose method will remove the geometry from memory
   * *** Dispose of the geometry before creating a new one
   */
  mesh.geometry.dispose()
  mesh.geometry = new THREE.BoxGeometry(
    1, 1, 1,
    debugObject.subdivision,
    debugObject.subdivision,
    debugObject.subdivision
  )
})

/**
 * >! Camera
 * >> Camera attributes: (field of view, aspect ratio, near and far clipping plane)
 * 
 * ** field of view: the extent of the scene that is visible on the display at any given moment
 * *** The recommended value is between 45 and 75 degrees, maximum value is 180 degrees
 * 
 * ** aspect ratio: the aspect ratio of the camera’s view (width / height)
 * 
 * ** near clipping plane: objects closer to the camera than the near value will not be rendered
 * *** The recommended value is between 0.1 and 1000
 */

/**
 * >! Orthographic Camera
 * >> Orthographic Camera attributes: (left, right, top, bottom, near and far clipping plane)
 * 
 * ** left: the position of the camera’s left plane
 * ** right: the position of the camera’s right plane
 * ** top: the position of the camera’s top plane
 * ** bottom: the position of the camera’s bottom plane
 */

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio, 
//   1 * aspectRatio, 
//   1, 
//   -1, 
//   0.1, 
//   100
// )

// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

/**
 * >! Controls
 * >> OrbitControls attributes: (camera, domElement)
 * 
 * ** camera: the camera to be controlled
 * ** domElement: the HTML element used for event listeners
 * 
 * *** damping is the smoothness of the camera movement
 * *** The controls need to be updated on each frame for the damping to work
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// controls.target.y = 2
// controls.update()

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
// Renderer the canvas size to match the device pixel ratio but set the maximum pixel ratio to 2
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  // mesh.rotation.y = elapsedTime;

  // Update camera
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
  // camera.position.y = cursor.y * 5
  // camera.lookAt(mesh.position)

  // Update controls
  /**
   * >! Controls : Damping
   * >> Damping needs to be updated on each frame for the smoothness to work
   */
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()