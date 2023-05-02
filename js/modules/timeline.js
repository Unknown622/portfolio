/**
  @module timeline
  @description Contains function to initialize timeline
  @author Vincent Zimmer
  @version 2.0.0
  @requires [VanillaTilt, isMobile/helper]
*/
import VanillaTilt from "./vanilla-tilt.js"
import {isMobile} from "./helper.js"

/**
  Initializes timeline more-info elements

  @param {int} transitionTime: Time to animate height of more-info expansion/retraction (optional, default 500 ms)

  @return {void}
*/
export default function initializeTimeline(transitionTime = 500) {
  document.querySelectorAll("section#experience #timeline .item-container .item-grid > .more-info > label.toggle input[type]").forEach(element => element.addEventListener("change", toggleInfo)) // Add event listener to all timeline checkboxes
  document.querySelectorAll("section#experience #timeline .item-container .item-grid .more-info .content[data-animated]").forEach(element => { // Add toggle animations listener to all more-info content elements
      element.addEventListener("toggleAnimation", () => element.classList.toggle("animated"))
      if (window.animations) {element.classList.add("animated")} // Add animated class if enabled
    })

  /**
    Expands/retracts more info element, to be used with change listener on checkbox

    @param {Event} event

    @return {void}
  */
  function toggleInfo(event) {
    event.target.parentElement.tooltip?.hide() // Hide tooltip
    const timelineItem = event.target.parentElement.parentElement.parentElement, // Timeline item-grid
      content = event.target.parentElement.parentElement.querySelector(":scope > .content") // Item more-info content
    if (event.target.checked) { // Expand more info
      content.classList.add("visible")
      content.style.height = content.scrollHeight + "px" // Update element height to show content
      event.target.parentElement.tooltip?.setText("Hide Info") // Update tooltip text
      timelineItem.classList.remove("tilt-animation")
      timelineItem.vanillaTilt?.destroy() // Remove tilt animation from item (if animations are on)
    } else { // Retract more info
      content.style.height = "" // Reset height
      setTimeout(() => { // Wait for animation to play (if needed) and reset element
        content.classList.remove("visible")
        event.target.parentElement.tooltip?.setText("More Info") // Update tooltip text
        timelineItem.classList.add("tilt-animation")
        if (window.animations && !isMobile) {VanillaTilt.init(timelineItem, window.tiltOptions)} // Add tilt animation if animations are on
      }, window.animations ? transitionTime : 0)
    }
  }
}
