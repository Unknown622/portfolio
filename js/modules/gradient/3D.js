/**
  @module gradient/3D
  @description Contains Gradient3D class and its required functions, Based off of https://kevinhufnagl.com/how-to-stripe-website-gradient-effect/
  @author Vincent Zimmer
  @version 2.0.0
  @requires [MiniGl, GradientAbstract, helper/random, helper/isString]
*/
import MiniGl from "../miniGL.js"
import GradientAbstract from "./abstract.js"
import {isString, random} from "../helper.js"

/**
  Converts input to correct format for gradient class

  @params {string} hexCode: Color hex code to convert

  @return {array}
*/
export function normalizeColor(hexCode) {
  if (!isString(hexCode) || hexCode.charAt(0) !== '#') {throw new Error("Invalid color format")} // Check color format
  hexCode = "0x" + hexCode.replace("#", "")
  return [(hexCode >> 16 & 255) / 255, (hexCode >> 8 & 255) / 255, (255 & hexCode) / 255]
}

// Don't want to deal with importing different file types
const VERTEX_SHADER = ["vec3 mod289(vec3 x) {return x - floor(x * (1.0 / 289.0)) * 289.0;}vec4 mod289(vec4 x) {return x - floor(x * (1.0 / 289.0)) * 289.0;}vec4 permute(vec4 x) {return mod289(((x * 34.0) + 1.0) * x);}vec4 taylorInvSqrt(vec4 r) {return 1.79284291400159 - 0.85373472095314 * r;}float snoise(vec3 v) {const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);vec3 i = floor(v + dot(v, C.yyy));vec3 x0 = v - i + dot(i, C.xxx);vec3 g = step(x0.yzx, x0.xyz);vec3 l = 1.0 - g;vec3 i1 = min(g.xyz, l.zxy);vec3 i2 = max(g.xyz, l.zxy);vec3 x1 = x0 - i1 + C.xxx;vec3 x2 = x0 - i2 + C.yyy;vec3 x3 = x0 - D.yyy;i = mod289(i);vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));float n_ = 0.142857142857;vec3 ns = n_ * D.wyz - D.xzx;vec4 j = p - 49.0 * floor(p * ns.z * ns.z);vec4 x_ = floor(j * ns.z);vec4 y_ = floor(j - 7.0 * x_ );vec4 x = x_ *ns.x + ns.yyyy;vec4 y = y_ *ns.x + ns.yyyy;vec4 h = 1.0 - abs(x) - abs(y);vec4 b0 = vec4(x.xy, y.xy);vec4 b1 = vec4(x.zw, y.zw);vec4 s0 = floor(b0) * 2.0 + 1.0;vec4 s1 = floor(b1) * 2.0 + 1.0;vec4 sh = -step(h, vec4(0.0));vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;vec3 p0 = vec3(a0.xy, h.x);vec3 p1 = vec3(a0.zw, h.y);vec3 p2 = vec3(a1.xy, h.z);vec3 p3 = vec3(a1.zw, h.w);vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));p0 *= norm.x;p1 *= norm.y;p2 *= norm.z;p3 *= norm.w;vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);m = m * m;return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));}", "vec3 blendNormal(vec3 base, vec3 blend) {return blend;}vec3 blendNormal(vec3 base, vec3 blend, float opacity) {return (blendNormal(base, blend) * opacity + base * (1.0 - opacity));}float blendScreen(float base, float blend) {return 1.0-((1.0-base)*(1.0-blend));}vec3 blendScreen(vec3 base, vec3 blend) {return vec3(blendScreen(base.r, blend.r), blendScreen(base.g, blend.g), blendScreen(base.b, blend.b));}vec3 blendScreen(vec3 base, vec3 blend, float opacity) {return (blendScreen(base, blend) * opacity + base * (1.0 - opacity));}vec3 blendMultiply(vec3 base, vec3 blend) {return base * blend;}vec3 blendMultiply(vec3 base, vec3 blend, float opacity) {return (blendMultiply(base, blend) * opacity + base * (1.0 - opacity));}float blendOverlay(float base, float blend) {return base < 0.5 ? (2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend));}vec3 blendOverlay(vec3 base, vec3 blend) {return vec3(blendOverlay(base.r, blend.r), blendOverlay(base.g, blend.g), blendOverlay(base.b, blend.b));}vec3 blendOverlay(vec3 base, vec3 blend, float opacity) {return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));}vec3 blendHardLight(vec3 base, vec3 blend) {return blendOverlay(blend, base);}vec3 blendHardLight(vec3 base, vec3 blend, float opacity) {return (blendHardLight(base, blend) * opacity + base * (1.0 - opacity));}float blendSoftLight(float base, float blend) {return (blend < 0.5) ? (2.0 * base * blend + base * base * (1.0 - 2.0 * blend)) : (sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend));}vec3 blendSoftLight(vec3 base, vec3 blend) {return vec3(blendSoftLight(base.r, blend.r), blendSoftLight(base.g, blend.g), blendSoftLight(base.b, blend.b));}vec3 blendSoftLight(vec3 base, vec3 blend, float opacity) {return (blendSoftLight(base, blend) * opacity + base * (1.0 - opacity));}float blendColorDodge(float base, float blend) {return (blend == 1.0) ? blend : min(base / (1.0 - blend), 1.0);}vec3 blendColorDodge(vec3 base, vec3 blend) {return vec3(blendColorDodge(base.r, blend.r), blendColorDodge(base.g, blend.g), blendColorDodge(base.b, blend.b));}vec3 blendColorDodge(vec3 base, vec3 blend, float opacity) {return (blendColorDodge(base, blend) * opacity + base * (1.0 - opacity));}float blendColorBurn(float base, float blend) {return (blend == 0.0) ? blend : max((1.0 - ((1.0 - base) / blend)), 0.0);}vec3 blendColorBurn(vec3 base, vec3 blend) {return vec3(blendColorBurn(base.r,blend.r),blendColorBurn(base.g,blend.g),blendColorBurn(base.b,blend.b));}vec3 blendColorBurn(vec3 base, vec3 blend, float opacity) {return (blendColorBurn(base, blend) * opacity + base * (1.0 - opacity));}float blendVividLight(float base, float blend) {return (blend < 0.5) ? blendColorBurn(base, (2.0 * blend)) : blendColorDodge(base, (2.0 * (blend - 0.5)));}vec3 blendVividLight(vec3 base, vec3 blend) {return vec3(blendVividLight(base.r, blend.r), blendVividLight(base.g, blend.g), blendVividLight(base.b, blend.b));}vec3 blendVividLight(vec3 base, vec3 blend, float opacity) {return (blendVividLight(base, blend) * opacity + base * (1.0 - opacity));}float blendLighten(float base, float blend) {return max(blend, base);}vec3 blendLighten(vec3 base, vec3 blend) {return vec3(blendLighten(base.r, blend.r), blendLighten(base.g, blend.g), blendLighten(base.b, blend.b));}vec3 blendLighten(vec3 base, vec3 blend, float opacity) {return (blendLighten(base, blend) * opacity + base * (1.0 - opacity));}float blendLinearBurn(float base, float blend) {return max(base + blend - 1.0, 0.0);}vec3 blendLinearBurn(vec3 base, vec3 blend) {return max(base + blend - vec3(1.0), vec3(0.0));}vec3 blendLinearBurn(vec3 base, vec3 blend, float opacity) {return (blendLinearBurn(base, blend) * opacity + base * (1.0 - opacity));}float blendLinearDodge(float base, float blend) {return min(base + blend, 1.0);}vec3 blendLinearDodge(vec3 base, vec3 blend) {return min(base + blend, vec3(1.0));}vec3 blendLinearDodge(vec3 base, vec3 blend, float opacity) {return (blendLinearDodge(base, blend) * opacity + base * (1.0 - opacity));}float blendLinearLight(float base, float blend) {return (blend < 0.5) ? blendLinearBurn(base, (2.0 * blend)) : blendLinearDodge(base, (2.0 * (blend - 0.5)));}vec3 blendLinearLight(vec3 base, vec3 blend) {return vec3(blendLinearLight(base.r, blend.r), blendLinearLight(base.g, blend.g), blendLinearLight(base.b, blend.b));}vec3 blendLinearLight(vec3 base, vec3 blend, float opacity) {return (blendLinearLight(base, blend) * opacity + base * (1.0 - opacity));}", "varying vec3 v_color; void main() { float time = u_time * u_global.noiseSpeed; vec2 noiseCoord = resolution * uvNorm * u_global.noiseFreq; vec2 st = 1. - uvNorm.xy; float tilt = resolution.y / 2.0 * uvNorm.y; float incline = resolution.x * uvNorm.x / 2.0 * 0.0; float offset = resolution.x / 2.0 * 0.0 * mix(u_vertDeform.offsetBottom, u_vertDeform.offsetTop, uv.y); float noise = snoise(vec3(noiseCoord.x * u_vertDeform.noiseFreq.x + time * u_vertDeform.noiseFlow, noiseCoord.y * u_vertDeform.noiseFreq.y, time * u_vertDeform.noiseSpeed + u_vertDeform.noiseSeed)) * u_vertDeform.noiseAmp; noise *= 1.0 - pow(abs(uvNorm.y), 2.0); noise = max(0.0, noise); vec3 pos = vec3(position.x, position.y + tilt + incline + noise - offset, position.z); v_color = u_baseColor; for (int i = 0; i < u_waveLayers_length; i++) { WaveLayers layer = u_waveLayers[i]; float noise = smoothstep(layer.noiseFloor, layer.noiseCeil, snoise(vec3(noiseCoord.x * layer.noiseFreq.x + time * layer.noiseFlow, noiseCoord.y * layer.noiseFreq.y, time * layer.noiseSpeed + layer.noiseSeed)) / 2.0 + 0.5); v_color = blendNormal(v_color, layer.color, pow(noise, 4.)); } gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0); }"].join("\n")

export default class Gradient3D extends GradientAbstract {
  /**
    Constructor for 3D Gradient object

    @param {HTMLElement} canvas: The canvas to add the gradient to
    @param {array} colors: The list of colors for the gradient, can only be color hex codes
    @param {object} options: Other options for the gradient (optional)
      Values:
        - amp {number} (default 100): Amplitude of gradient mesh
        - fps {int} (default 60): Max frame rate for canvas
        - saturate {boolean} (default false): Determines saturation of colors

    @return {void}
  */
  constructor(canvas, colors, options = {}) {
    super()
    this._canvas = canvas // Set canvas element
    this._isPaused = true // Gradient is paused by default
    this._minigl = new MiniGl(canvas) // Initialize graphics
    this.density = [0.06, 0.16] // x and y values
    // Frequency values for mesh
    this.freqX = 14e-5
    this.freqY = 29e-5
    this.amp = options?.amp || 100 // Amplitude for mesh
    this.saturate = options?.saturate || false // Determines saturation of colors
    this._seed = random(1, 1000) // Determines startup mesh
    this._time = 0 // For animating
    this._fpsInterval = 1000 / (options?.fps || 60) // Max frame rate
    this._lastFrameTime = 0 // Need to keep track of the time between frames for fps
    this.updateColors(colors) // Set initial colors
    this._minigl.render() // Render initial gradient
    window.addEventListener("resize", this._resize.bind(this)) // Update dimensions on window resize
  }

  /**
    Updates gradient colors, reinitializes gradient, and updates canvas dimensions

    @params {array} colors: Array of color hex code strings

    @return {void}
  */
  updateColors(colors) {
    this.colors = colors.map(color => normalizeColor(color)) // Convert colors for gradient
    this._initializeGradient() // Reinitialize gradient
    this._resize() // Set
  }

  /**
    Set uniforms and initialize material, geometry, and mesh

    @params none

    @return {void}
  */
  _initializeGradient() {
    // Set variables for shaders
    this._uniforms = {
      u_time: new this._minigl.Uniform({
        value: this._time
      }),
      u_shadow_power: new this._minigl.Uniform({
        value: 10
      }),
      u_darken_top: new this._minigl.Uniform({
        value: this.saturate ? 1 : 0
      }),
      u_global: new this._minigl.Uniform({
        value: {
          noiseFreq: new this._minigl.Uniform({
            value: [this.freqX, this.freqY],
            type: "vec2"
          }),
          noiseSpeed: new this._minigl.Uniform({
            value: 5e-6
          })
        },
        type: "struct"
      }),
      u_vertDeform: new this._minigl.Uniform({
        value: {
          offsetTop: new this._minigl.Uniform({
            value: -0.5
          }),
          offsetBottom: new this._minigl.Uniform({
            value: -0.5
          }),
          noiseFreq: new this._minigl.Uniform({
            value: [random(0, 4), random(0, 4)],
            type: "vec2"
          }),
          noiseAmp: new this._minigl.Uniform({
            value: this.amp
          }),
          noiseSpeed: new this._minigl.Uniform({
            value: random(0, 10)
          }),
          noiseFlow: new this._minigl.Uniform({
            value: random(0, 10)
          }),
          noiseSeed: new this._minigl.Uniform({
            value: this._seed
          })
        },
        type: "struct",
        excludeFrom: "fragment"
      }),
      u_baseColor: new this._minigl.Uniform({
        value: this.colors[0],
        type: "vec3",
        excludeFrom: "fragment"
      }),
      u_waveLayers: new this._minigl.Uniform({
        value: [],
        excludeFrom: "fragment",
        type: "array"
      })
    }
    // Loop thru all colors
    for (let i = 1; i < this.colors.length; i += 1) this._uniforms.u_waveLayers.value.push(new this._minigl.Uniform({
      value: {
        color: new this._minigl.Uniform({
          value: this.colors[i],
          type: "vec3"
        }),
        noiseFreq: new this._minigl.Uniform({
          value: [2 + i / this.colors.length, 3 + i / this.colors.length],
          type: "vec2"
        }),
        noiseSpeed: new this._minigl.Uniform({
          value: 11 + 0.3 * i
        }),
        noiseFlow: new this._minigl.Uniform({
          value: 6.5 + 0.3 * i
        }),
        noiseSeed: new this._minigl.Uniform({
          value: this._seed + 10 * i
        }),
        noiseFloor: new this._minigl.Uniform({
          value: 0.1
        }),
        noiseCeil: new this._minigl.Uniform({
          value: 0.63 + 0.07 * i
        })
      },
      type: "struct"
    }))
    // Make gradient mesh
    this._material = new this._minigl.Material(VERTEX_SHADER, "varying vec3 v_color; void main() { vec3 color = v_color; if (u_darken_top == 1.0) { vec2 st = gl_FragCoord.xy/resolution.xy; color.g -= pow(st.y + sin(-12.0) * st.x, u_shadow_power) * 0.4; } gl_FragColor = vec4(color, 1.0); }", this._uniforms)
    this._geometry = new this._minigl.PlaneGeometry
    this._mesh = new this._minigl.Mesh(this._geometry, this._material)
  }

  /**
    Animate gradient on canvas by

    @params currentTime {number}

    @return {void}
  */
  _animate(currentTime) {
    if (this._isPaused) {return}
    // Check if enough time has passed to update the canvas (cap fps)
    if (currentTime - this._lastFrameTime >= this._fpsInterval) {
      this._time += Math.min(currentTime - this._lastFrameTime, 1e3 / 15)
      this._lastFrameTime = currentTime
      this._mesh.material.uniforms.u_time.value = this._time
      this._minigl.render()
    }
    requestAnimationFrame(this._animate.bind(this))
  }

  /**
    Increments frequency values for gradient mesh

    @params value {number}: Number used to increment frequency values

    @return {void}
  */
  updateFrequency(value) {
    this.freqX += value
    this.freqY += value
  }

  /**
    Plays gradient

    @params none

    @return {void}
  */
  play() {
    if (this._isPaused) {
      this._isPaused = false
      requestAnimationFrame(this._animate.bind(this))
    }
  }

  /**
    Pauses gradient

    @params none

    @return {void}
  */
  pause() {
    this._isPaused = true
  }

  /**
    Required Gradient class function

    @params none

    @return {string}
  */
  getType() {
    return "3d"
  }

  /**
    To be used with resize event listener, updates canvas dimensions and gradient values

    @params none

    @return {void}
  */
  _resize() {
    // Update canvas and miniGL dimensions
    this._canvas.height = window.innerHeight
    this._canvas.width = window.innerWidth
    this._minigl.setSize(window.innerWidth, window.innerHeight)
    this._minigl.setOrthographicCamera() // Update camera
    // Update geometry and material
    this._xSegCount = Math.ceil(window.innerWidth * this.density[0])
    this._ySegCount = Math.ceil(window.innerHeight * this.density[1])
    this._mesh.geometry.setTopology(this._xSegCount, this._ySegCount)
    this._mesh.geometry.setSize(window.innerWidth, window.innerHeight)
  }
}
