import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'

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
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

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