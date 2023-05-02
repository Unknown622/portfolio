/**
  @description Contains main initialization function for portfolio page
  @author Vincent Zimmer
  @version 1.0.0
  @requires [Menubar, initializeAllTooltips, VanillaTilt, initializeGradient, helper/isMobile, helper/setGlobalVariables, initializeTimeline, Parallax]
*/
import Menubar from "./modules/menubar.js"
import {initializeAllTooltips} from "./modules/tooltip.js"
import VanillaTilt from "./modules/vanilla-tilt.js"
import {initializeGradient} from "./modules/gradient"
import {isMobile, setGlobalVariables} from "./modules/helper.js"
import initializeTimeline from "./modules/timeline.js"
import Parallax from "./modules/parallax-background.js"

setGlobalVariables()
window.addEventListener("load", initialize)

/**
  Initializes portfolio page on load

  @param none

  @return {void}
*/
function initialize() {
  initializeGradient()
  new Parallax(document.querySelector("div#gradient div.parallax-scroll"), document.querySelectorAll("div#gradient div.parallax-scroll img")) // Add parallax scrolling
  new Menubar() // Initialize menubar
  initializeTimeline()
  if (!isMobile) { // Add custom tooltips and tilt animations only if the device isn't mobile
    initializeAllTooltips({animations: window.animations}) // Add custom tooltips
    document.querySelectorAll(".tilt-animation").forEach(element => { // Add tilt animation
      if (window.animations) {VanillaTilt.init(element, window.tiltOptions)} // Initialize tilt animation if needed
      element.addEventListener("toggleAnimation", event => {
        if (event.detail.animations) { // Play animations
          VanillaTilt.init(element, window.tiltOptions) // Reinitialize tilt animation
        } else { // Stop animations
          element.vanillaTilt.destroy() // Remove tilt animation from element
        }
      })
    })
  }
}
