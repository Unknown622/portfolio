/**
  @module tooltip
  @description Contains tooltip class and function to initialize all tooltips
  @author Vincent Zimmer
  @version 2.0.0
  @requires [helper/isString]
*/

import {isString} from "./helper.js"

/**
  Initialize all tooltips with elements that have a title attribute

  @param {object} options: Other options, the only value used in this function is initializationSelector to replace [title] selector
    All options passed to tooltip constructor (optional)

  @return {void}
*/
export function initializeAllTooltips(options = {}) {
  document.querySelectorAll(options?.initializationSelector || "[title]").forEach(element => new Tooltip(element, options))
}

export default class Tooltip {
  /**
    Constructor for Tooltip class

    @param {HTMLElement} element: The parent element to animate
    @param {object} options: Other options (optional)
      Values:
        - darkTheme {boolean} (default false): If true dark will be added as a class, otherwise light will be added as a class
        - className {string} (default N/A): Overrides the CSS class that gives the tooltip its look
        - animations {boolean} (default true): If true, the tooltip will animate in and out
        - distance {int} (default 16): The distance the tooltip is away from its parent element in px, can also be overridden by setting the data-distance attribute
        - placement {string} (default auto): The placement of the tooltip relative to its parent element (top, right, bottom, or left), can also be overridden by setting the data-placement attribute
          The tooltip will always find the best placement to ensure it doesn't go off page
        - mobileThreshold {int} (default 700): Window width threshold in px to use mobile placement
        - mobilePlacement {string} (default N/A): Placement when window width is less than mobileThreshold, if not set normal placement is used
        - animationTime {int} (default 200): Transition time for css animations, in ms
        - animationInClass {string} (default slide-in-to): CSS animation in class prefix
        - animationOutClass {string} (default slid-out-from): CSS animation out class prefix
        - initializationSelector {string} (default false): Used to check if the mouse is hovering over the parent element (see setText())
        - text {string} (default N/A): Text used for the tooltip, if unset the text from the title attribute is used

    @return {void}
  */
  constructor(element, options ={}) {
    this._parentElement = element
    this._darkTheme = options?.darkTheme || false
    // Make tooltip element
    this._tooltipElement = document.createElement("p")
    this._tooltipElement.style.visibility = "hidden"
    this._tooltipElement.role = "tooltip"
    this._tooltipElement.classList.add("source-code-pro", options?.className || "blur-light-10", this._darkTheme ? "dark" : "light")
    this.showAnimations = options?.animations || true
    this.distance = options?.distance || 16 // Distance tooltip is away from parent element, default is 16 px
    this.placement = options?.placement || "auto" // Show tooltip on top of parent element (default), right, bottom, or left
    this.mobileThreshold = options?.mobileThreshold || 700 // Window width threshold in px to use mobile placement
    this.mobilePlacement = options?.mobilePlacement || this.placement // Placement when window width is less than mobileThreshold
    this.animationTime = options?.animationTime || 200 // Transition time for css animations
    this.animationInClass = options?.animationInClass || "slide-in-to-"
    this.animationOutClass = options?.animationOutClass || "slide-out-from-"
    this.selector = options?.initializationSelector || false // See function setText
    this._isShowing = false // Tooltip is hidden by default
    this._text = options?.text || element.title.trim()
    if (element.title) {element.title = ""} // Remove element's title attribute (hide OS tooltip)
    // Add event listeners
    element.addEventListener("toggleAnimation", event => this._toggleAnimations(event.detail.animations)) // Toggle animations with custom event
    element.addEventListener("mouseenter", this.show.bind(this))
    element.addEventListener("mouseleave", this.hide.bind(this))
    window.addEventListener("scroll", this.hide.bind(this))
    window.addEventListener("resize", this.hide.bind(this))
    element.tooltip = this // Add object to element for global access
  }

  /**
    Toggles animations in/out for tooltip

    @param {boolean} animate: If true the tooltip will animate in/out, otherwise there won't be any animations

    @return {void}
  */
  _toggleAnimations(animate) {
    if (animate) {
      this.showAnimations = true
    } else {
      this.showAnimations = false
      // Remove animations from tooltip element
      this._tooltipElement.classList.remove([...this._tooltipElement.classList].find(className => className.startsWith(this.animationInClass)))
      this._tooltipElement.classList.remove([...this._tooltipElement.classList].find(className => className.startsWith(this.animationOutClass)))
    }
  }

  /**
    Shows tooltips, animates if needed

    @param none

    @return {void}
  */
  show() {
    if (this._isShowing || !this._text) {return} // If the tooltip is already showing or the text isn't set
    this._isShowing = true
    const mobilePlacement = this._parentElement.dataset?.mobilePlacement ? this._parentElement.dataset.mobilePlacement : this.mobilePlacement // Prefer mobilePlacement from dataset over object
    if (window.innerWidth <= this.mobileThreshold && mobilePlacement === "false") { // Don't show tooltip if mobilePlacement is false
      return
    }
    this._tooltipElement.innerHTML = this._text // Update text each time
    document.body.append(this._tooltipElement) // Add tooltip to DOM (not visible)
    const position = getPosition(this._tooltipElement.getBoundingClientRect(), this._parentElement.getBoundingClientRect(),
      this._parentElement.dataset?.distance ? parseInt(this._parentElement.dataset?.distance) : this.distance, // Prefer distance from dataset over class
      window.innerWidth <= this.mobileThreshold ? mobilePlacement : (this._parentElement.dataset?.placement ? this._parentElement.dataset.placement : this.placement) // Prefer placement from dataset over object
    )
    Object.assign(this._tooltipElement.style, { // Update tooltip location and make it visible
      left: position.left + "px",
      top: position.top + "px",
      visibility: "visible"
    })
    this._autoPlacement = position.placement // Update so that the tooltip can be animated out
    if (this.showAnimations) {this._tooltipElement.classList.add(this.animationInClass + position.placement)} // Animate if needed

    /**
      Recursively looks for tooltip's best position to ensure it doesn't go off page
      Based off code generated using ChatGPT

      @param {DOMRect} tooltipRect: Dimensions and position of tooltip rectangle (must already be on DOM)
      @param {DOMRect} parentRect: Dimensions and position of the tooltip's parent element
      @param {int} distance: The distance the tooltip is away from the parent element in px
      @param {string} placement: The tooltip position to check
      @param {int} runs (optional): Used to not make an infinite loop (no need to include in initial call)

      @return {object}: Contains left and top number values and string placement
    */
    function getPosition(tooltipRect, parentRect, distance, placement, runs = 0) {
      runs++
      let top = 0 , left = 0
      switch (placement) {
        case "right":
          left = parentRect.right + distance
          top = parentRect.top + (parentRect.height - tooltipRect.height) / 2
          break
        case "bottom":
          left = parentRect.left + (parentRect.width - tooltipRect.width) / 2
          top = parentRect.bottom + distance
          break
        case "left":
          left = parentRect.left - tooltipRect.width - distance
          top = parentRect.top + (parentRect.height - tooltipRect.height) / 2
          break
        default:
          placement = "top"
          left = parentRect.left + (parentRect.width - tooltipRect.width) / 2
          top = parentRect.top - tooltipRect.height - distance
          break
      }
      const placementObject = {
        placement: placement, // For CSS animation class
        left: left,
        top: top
      }
      if (runs > 4) { // All sides have been checked so return current placement
        return placementObject
      } else if (top < 0) { // Check top value
        return getPosition(tooltipRect, parentRect, distance, "bottom", runs)
      } else if (left < 0) { // Check left value
        return getPosition(tooltipRect, parentRect, distance, "right", runs)
      } else if (top + tooltipRect.height > document.body.offsetHeight) { // Check bottom value
        return getPosition(tooltipRect, parentRect, distance, "top", runs)
      } else if (left + tooltipRect.width > document.body.offsetWidth) { // Check right value
        return getPosition(tooltipRect, parentRect, distance, "left", runs)
      }
      return placementObject // Found placement
    }
  }

  /**
    Hides tooltips, animates if needed

    @param none

    @return {void}
  */
  hide() {
    if (!this._isShowing) {return} // If tooltip is already showing
    this._isShowing = false
    const mobilePlacement = this._parentElement.dataset?.mobilePlacement ? this._parentElement.dataset.mobilePlacement : this.mobilePlacement // Prefer mobilePlacement from dataset over object
    if (window.innerWidth <= this.mobileThreshold && mobilePlacement === "false") { // If mobile and not showing on mobile
      return
    } else if (!this.showAnimations) { // If no animations
      this._tooltipElement.remove() // Remove tooltip from DOM
      return
    }
    this._tooltipElement.classList.remove([...this._tooltipElement.classList].find(className => className.startsWith(this.animationInClass))) // Remove slide in animation class
    this._tooltipElement.classList.add(this.animationOutClass + this._autoPlacement) // Add slide out animation
    setTimeout(() => { // Wait for animation to play
      this._tooltipElement.remove() // Remove tooltip element from DOM
      this._tooltipElement.classList.remove(this.animationOutClass + this._autoPlacement) // Remove slide out animation
    }, this.animationTime)
  }

  /**
    Updates tooltip's text, if the tooltip is showing it will be hidden briefly to update location

    @param {string} text: New tooltip text

    @return {void}
  */
  setText(text) {
    const wasShowing = this._isShowing // Save for later
    this.hide() // Hide tooltip
    this._text = text // Update
    if (wasShowing && this.showAnimations) {
      setTimeout(() => { // Wait for out animation to play
        // Check if the mouse is hovering over the tooltip's parent element
        if ((isString(this.selector) && document.querySelector(this.selector + ":hover") == this._parentElement)
          || (this.selector === false && this._parentElement.parentElement.querySelector(":scope > :hover") == this._parentElement))
        {this.show()}
      }, this.animationTime)
    } else if (wasShowing) { // No need to animate
      this.show()
    }
  }
}
