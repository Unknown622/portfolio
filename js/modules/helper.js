/**
  @module helper
  @description Contains helper functions for other files
  @author Vincent Zimmer
  @version 1.0.0
  @requires []
*/

/**
  Returns a random integer between min and max (inclusive)

  @params {number} min: The min number the random int can be
  @params {number} max: The max number the random int can be

  @return {int}
*/
export function random(min, max) {
  min = Math.ceil(min)
  return Math.floor(Math.random() * (Math.floor(max) - min + 1) + min)
}

/**
  Returns true if input is an HTML DOM element, otherwise false

  @params {any} input: The variable to check

  @return {boolean}
*/
export function isElement(input) {
  return input && input instanceof Element
}

/**
  Returns true if input is a string, otherwise false

  @params {any} input: The variable to check

  @return {boolean}
*/
export function isString(input) {
  return input && typeof input === "string"
}

/**
  Set global variables using window (like animations boolean)

  @params none

  @return {void}
*/
export function setGlobalVariables() {
  window.animations = !reduceMotion
  window.tiltOptions = {gyroscope: false, reverse: true, glare: true, perspective: 1000, scale: 1.01, max: 4, "max-glare": 0.1}
}

/**
  Returns true if input is a number, otherwise false
  Generated using ChatGPT

  @params {any} input: The variable to check

  @return {boolean}
*/
export function isNumber(input) {
  return input && typeof input === "number" && !isNaN(input)
}

/**
  True if current device is a mobile device, otherwise false
  Generated using ChatGPT
*/
export const isMobile = typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1 || screen.orientation !== undefined && screen.orientation.type.indexOf('portrait') !== -1

/**
  True if current device has reduced motion turned on, otherwise false
  Generated using ChatGPT
*/
export const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
  Returns the name of the current browser being used
  Generated using ChatGPT

  @params none

  @return {string}
*/
export function getBrowserName() {
  const userAgent = navigator.userAgent.toLowerCase()
  if (userAgent.indexOf("edge") !== -1) {
    return "edge"
  } else if (userAgent.indexOf("edg/") !== -1) {
    return "edge-chrome"
  } else if (userAgent.indexOf("chrome") !== -1) {
    return "chrome"
  } else if (userAgent.indexOf("safari") !== -1) {
    return "safari"
  } else if (userAgent.indexOf("firefox") !== -1) {
    return "firefox"
  } else if (userAgent.indexOf("opera") !== -1 || userAgent.indexOf("opr/") !== -1) {
    return "opera"
  } return "unknown"
}

/**
  Returns true if the Webgl2 canvas context is supported on the current device, otherwise false
  Generated using ChatGPT

  @params none

  @return {boolean}
*/
export function isWebGL2Supported() {
  try {
    const canvas = document.createElement("canvas") // Will be collected with garbage since not used
    return !!window.WebGL2RenderingContext && !!canvas.getContext("webgl2")
  } catch (error) {
    console.error(error)
    return false
  }
}

/**
  Returns true if the 2D canvas context is supported on the current device, otherwise false
  Generated using ChatGPT

  @params none

  @return {boolean}
*/
export function isCanvas2DSupported() {
  try {
    const canvas = document.createElement("canvas") // Will be collected with garbage since not used
    return !!canvas.getContext("2d")
  } catch (error) {
    console.error(error)
    return false
  }
}
