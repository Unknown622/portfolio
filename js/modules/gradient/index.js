/**
  @module gradient
  @description Contains Gradient class and global gradient function
  @author Vincent Zimmer
  @version 1.0.0
  @requires [GradientAbstract, Gradient2D, Gradient3D, GradientCSS, helper/isCanvas2DSupported, helper/isWebGL2Supported, helper/random]
*/
import GradientAbstract from "./abstract.js"
import Gradient2D from "./2D.js"
import Gradient3D from "./3D.js"
import GradientCSS from "./css.js"
import {isCanvas2DSupported, isWebGL2Supported, random} from "../helper.js"

export default class Gradient extends GradientAbstract {
  /**
    Constructor for CSS Gradient object

    @param {HTMLElement} canvas: The canvas to add the gradient to
    @param {HTMLElement} fallbackElement: The element to add the css gradient class to
    @param {array} colors: The list of colors for the gradient, can only be color hex codes
    @param {object} options: Other options for the gradient (optional)
      Values:
        - listenerTimeout {int} (default 0): The time in ms the gradient will play after scrolling
        - performanceThreshold2D {int} (default 10): The max time it can take to initialize 2D gradient
        - performanceThreshold3D {int} (default 275): The max time it can take to initialize 3D gradient
        - gradientType {string} (default auto): Determines what gradient should be used (2D, 3D, CSS, or auto)
        - scrollListener {boolean} (default true): If ture, the gradient is animated while scrolling
        - startupAnimation {int} (default N/A): If initialized, the gradient will play for a time when it's loaded (in ms)
        - animationListener {boolean} (default true): If true, a custom event listener for toggling animation is added. To be used with the animation toggle in the menubar

    @return {void}
  */
  constructor(canvas, fallbackElement, colors, options = {}) {
    super()
    this._canvas = canvas // Set canvas element
    this._colors = colors // Set colors
    this._fallbackGradient = new GradientCSS(fallbackElement, colors, {
      gradientOptions: "145deg",
      useHCL: true,
      colorStops: colors.length * 6
    }) // Make CSS gradient
    fallbackElement.style.opacity = 1 // Show CSS gradient
    this.listenerTimeout = options?.listenerTimeout || 0 // Wait duration for listener timeouts (see above)
    // Performance values
    this.performanceThreshold2D = options?.performanceThreshold2D || 10
    this.performanceThreshold3D = options?.performanceThreshold3D || 275
    this._setGradient(options?.gradientType || "auto") // Set gradient type
    this._canvas.style.opacity = "1" // Show canvas
    this.scrollListener = options?.scrollListener || true
    this._scroll = this._scroll.bind(this) // Bind scroll function to this instance
    if (options?.startupAnimation) { // Play startup animation if needed
      this.play()
      setTimeout(() => this.pause(), options.startupAnimation)
    } if (this.scrollListener) { // Add scroll listener if needed
      window.addEventListener("scroll", this._scroll)
    } if (options?.animationListener || true) { // Add animation toggle listener if needed
      fallbackElement.addEventListener("toggleAnimation", event => { // Toggles scroll animations
        if (this.scrollListener && !event.detail.animations) {
          window.removeEventListener("scroll", this._scroll)
        } else if (this.scrollListener && event.detail.animations) {
          window.addEventListener("scroll", this._scroll)
        }
      })
    }
  }

  /**
    Sets the type of gradient, if set to auto the gradient with the best performance on device will be chosen

    @params {string} type: Can be 2D, 3D, CSS, and auto (default)

    @return {void}
  */
  _setGradient(type = "auto") {
    const instance = this // "this" isn't accessible in the functions below
    // Initialize correct gradient
    switch (type.toLocaleLowerCase()) {
      case "3d":
        this._gradient = new Gradient3D(this._canvas, this._colors)
        break
      case "2d":
        this._gradient = new Gradient2D(this._canvas, this._colors)
        break
      case "css":
      case "fallback":
        this._gradient = this._fallbackGradient
        break
      default:
        autoGradient()
        break
    }

    /**
      Automatically sets the type of gradient that will have the best performance

      @params {string} type: Can be 2D, 3D, and CSS (default is "")

      @return {void}
    */
    function autoGradient(type = "") {
      switch (type.toLocaleLowerCase()) {
        case "css": // Backup
          instance._gradient =  instance._fallbackGradient
          return
        case "2d": // Then try 2D
          try2D()
          return
        default: // Prioritize 3D
          try3D()
          return
      }
    }

    /**
      Tries setting the 2D gradient based on device's capabilities and performance

      @params none

      @return {void}
    */
    function try2D() {
      if (!isCanvas2DSupported()) { // Check if 2D canvas context is supported
        instance._gradient = instance._fallbackGradient // If not, set gradient to backup
        return
      }
      const startTime = window.performance.now() // Get start time to calculate time of execution
      instance._gradient = new Gradient2D(instance._canvas, instance._colors) // Initialize 2d canvas gradient
      if (window.performance.now() - startTime > instance.performanceThreshold2D) { // Check performance
        // If performance isn't good enough, replace canvas with a new one and set gradient to backup
        replaceCanvas()
        instance._gradient = instance._fallbackGradient
      }
    }

    /**
      Tries setting the 3D gradient based on device's capabilities and performance

      @params none

      @return {void}
    */
    function try3D() {
      if (!isWebGL2Supported()) { // Check if WebGL2 canvas context is supported (this is required)
        autoGradient("2d") // If not, try the 2D gradient
        return
      }
      const startTime = window.performance.now() // Get start time to calculate time of execution
      instance._gradient = new Gradient3D(instance._canvas, instance._colors) // Initialize 3d gradient
      if (window.performance.now() - startTime > instance.performanceThreshold3D) { // Check performance
        // If performance isn't good enough, replace canvas with a new one and try the 2D gradient
        replaceCanvas()
        autoGradient("2d")
      }
    }

    /**
      Replaces the canvas with a new one, this is required if a gradient is initialized but needs to be changed

      @params none

      @return {void}
    */
    function replaceCanvas() {
      const newCanvas = document.createElement("canvas") // Create new canvas
      newCanvas.style.opacity = 0 // Hide it
      instance._canvas.replaceWith(newCanvas) // Replace with old one
      instance.canvas = newCanvas // Update instance's canvas
    }
  }

  /**
    Required Gradient class function

    @params none

    @return {string}
  */
  get getType() {
    try { // Just in case the gradient isn't initialized
      return this._gradient.getType()
    } catch (error) {
      console.error(error)
      return "unknown"
    }
  }

  _scroll() {
    this.play() // Play while scrolling
    if (this.listenerTimeout) {
      clearTimeout(this.scrollTimeout) // Clear timeout, then update it
      this.scrollTimeout = setTimeout(() => {
        this._gradient.pause() // Pause once stopped
      }, this.listenerTimeout)
    }
  }

  /**
    Plays gradient

    @params none

    @return {void}
  */
  play() {
    this._gradient.play()
    if (this._gradient.getType() === "2d") {
      this._fallbackGradient.play()
    }
  }

  /**
    Pauses gradient

    @params none

    @return {void}
  */
  pause() {
    this._gradient.pause()
    this._fallbackGradient.pause()
  }
}

/**
  Make the same gradient available for all pages

  @params {boolean} scrollListener: If true, the gradient will be animated on scroll
  @params {object} selectors: Selectors for elements to add gradient to (optional):
    - canvas {string} (default "div#gradient canvas")
    - fallback {string} (default "div#gradient")

  @return {Gradient}
*/
export function initializeGradient(scrollListener = window.animations || true, selectors = {}) {
  return new Gradient(document.querySelector(selectors?.canvas || "div#gradient canvas"), document.querySelector(selectors?.fallback || "div#gradient"), [
    "#0077b6",
    "#00b4d8",
    "#03045e",
    "#90e0ef",
  ], {amp: random(0, 50), startupAnimation: scrollListener ? 1000 : false, scrollListener: scrollListener, listenerTimeout: 500})
}
