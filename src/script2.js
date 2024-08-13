import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

/**
 * Debug
 */
const gui = new GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Textures
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace
matcapTexture.colorSpace = THREE.SRGBColorSpace

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// // MeshBasicMaterial
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// material.color = new THREE.Color(0x00ff00)
// material.wireframe = true
// material.transparent = true
// material.opacity = 0.5
// material.alphaMap = doorAlphaTexture
// // !Becareful using doubleside, it will bad for performance
// material.side = THREE.DoubleSide

// // MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

// // MeshMatcapMaterial
// // >> Matcap is a texture that is used to simulate the reflection of a material
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// // MeshDepthMaterial
// const material = new THREE.MeshDepthMaterial()

// // MeshLambertMaterial
// // >> MeshLambertMaterial is the most performant material that uses lighting
// // ** Unfortunatelly, the parameter are not convinient and you can see strange pattern in the geometry if you look closely at rounder geometry like sphere
// const material = new THREE.MeshLambertMaterial()

// // MeshPhongMaterial
// // >> MeshPhongMaterial is less performant than MeshLambertMaterial but it has more parameters to play with
// // ** It has shininess, specular, emissive, emissiveIntensity, emissiveMap, reflectivity, refractionRatio, combine, flatShading, wireframe, wireframeLinewidth, wireframeLinecap, wireframeLinejoin
// // *** specular is the color of the reflection
// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0x1188ff)

// // MeshToonMaterial
// // >> MeshToonMaterial is a material that is used to create a toon shading effect
// // ** It has gradientMap, wireframe, wireframeLinewidth, wireframeLinecap, wireframeLinejoin
// // *** To use MeshToonMaterial, you need to use a gradient texture and set the minFilter, magFilter, and generateMipmaps to false to avoid the GPU to interpolate the colors between the pixels
// const material = new THREE.MeshToonMaterial()
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false
// material.gradientMap = gradientTexture

// // MeshStandardMaterial
// // >> MeshStandardMaterial uses physically based rendering (PBR) to simulate the interaction of light with materials
// // ** We get realistic output with realistic parameters and similiar result regardless of the technology
// const material = new THREE.MeshStandardMaterial()
// material.metalness = 1
// material.roughness = 1
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)
// material.transparent = true
// material.alphaMap = doorAlphaTexture

// MeshPhysicalMaterial
// >> MeshPhysicalMaterial is the same as MeshStandardMaterial but with more properties
// ** We get realistic physical properties into the material like clearcoat, clearcoatRoughness, reflectivity, transmission, sheen, sheenTint, specularIntensity, specularTint, ior, thickness, attenuationColor, attenuationDistance, attenuation
// ! MeshPhysicalMaterial is heavy on performance make sure to use it wisely, and check the performance on the old devices
const material = new THREE.MeshPhysicalMaterial()
material.metalness = 0
material.roughness = 0
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)
// material.transparent = true
// material.alphaMap = doorAlphaTexture

// gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)

// // >! MeshPhysicalMaterial Tweaks : Clearcoat
// // >> Clearcoat is for simulates a thin layer of varnish on top of the actual material
// // ** It good for car paint, or varnish effect
// // ! Clearcoat is heavy on performance
// material.clearcoat = 1
// material.clearcoatRoughness = 0

// gui.add(material, 'clearcoat').min(0).max(1).step(0.0001)
// gui.add(material, 'clearcoatRoughness').min(0).max(1).step(0.0001)

// // >! MeshPhysicalMaterial Tweaks : Sheen
// // >> Sheen is for higlights the material when seen from a narrow angle
// // ** It good for fabric, or cloth effect
// material.sheen = 1
// material.sheenRoughness = 0.25
// material.sheenColor.set(1, 1, 1)

// gui.add(material, 'sheen').min(0).max(1).step(0.0001)
// gui.add(material, 'sheenRoughness').min(0).max(1).step(0.0001)
// gui.addColor(material, 'sheenColor')

// // >! MeshPhysicalMaterial Tweaks : Iridescence
// // >> Iridescene is for simulates the rainbow effect on the material
// // ** It good for oil, soap, or bubble effect
// material.iridescence = 1
// material.iridescenceIOR = 1.6
// material.iridescenceThicknessRange = [100, 800]

// gui.add(material, 'iridescence').min(0).max(1).step(0.0001)
// // iridescenceIOR max value is not more than 2.333, because above that value is not realistic
// gui.add(material, 'iridescenceIOR').min(1).max(2.333).step(0.0001)
// gui.add(material.iridescenceThicknessRange, '0').min(1).max(1000).step(1)
// gui.add(material.iridescenceThicknessRange, '1').min(1).max(1000).step(1)

// >! MeshPhysicalMaterial Tweaks : Transmission
// >> Transmission is for simulates the transparency of the material
// ** It good for glass, water, or ice effect
material.transmission = 1
material.ior = 1.5
material.thickness = 0.5

gui.add(material, 'transmission').min(0).max(1).step(0.0001)
// ior max value is not more than 2.333, because above that value is not realistic, but you can set more than 2.333 to get cool effect
// ior = Index Of Refraction
// IOR of Diamond is 2.417
// IOR of Water is 1.333
// IOR of Air is 1.000293
// IOR of Glass is 1.5
// IOR of Ice is 1.31
// IOR of Ruby is 1.77
// IOR of Sapphire is 1.77
// IOR wikipedia = https://en.wikipedia.org/wiki/List_of_refractive_indices
gui.add(material, 'ior').min(1).max(10).step(0.0001)
gui.add(material, 'thickness').min(0).max(1).step(0.0001)


const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 64, 64),
  material
)
sphere.position.x = -1.5
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 100, 100),
  material
)

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
)
torus.position.x = 1.5
scene.add(sphere, plane, torus)

/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 1)
// scene.add(ambientLight)
// const pointLight = new THREE.PointLight(0xffffff, 30)
// pointLight.position.set(2, 3, 4)
// scene.add(pointLight)

/**
 * Environment map
 */
const rgbeLoader = new RGBELoader()
rgbeLoader.load('/textures/environmentMap/2k.hdr', (environtmentMap) => {
  environtmentMap.mapping = THREE.EquirectangularReflectionMapping

  scene.background = environtmentMap
  scene.environment = environtmentMap
})

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = -0.15 * elapsedTime
    plane.rotation.x = -0.15 * elapsedTime
    torus.rotation.x = -0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()