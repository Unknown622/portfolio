/**
 @description Contains main initialization function for error page
 @author Vincent Zimmer
 @version 1.0.0
 @requires [initializeAllTooltips, initializeGradient, helper/isMobile, helper/setGlobalVariables, helper/random]
*/
import {initializeAllTooltips} from "./modules/tooltip.js"
import {isMobile, random, setGlobalVariables} from "./modules/helper.js"
import {initializeGradient} from "./modules/gradient"

// Make a list of messages to mix it up (generated using ChatGPT)
const MESSAGES = [
  {
    title: "Lost and Found",
    text: "Page not found. Did you try looking under the couch?"
  },
  {
    title: "The Cyber Navigator",
    text: "You're lost in cyberspace! Let us help you find your way back"
  },
  {
    title: "U-turn Ahead",
    text: "Looks like someone took a wrong turn... don't worry, we'll figure it out!"
  },
  {
    title: "Coffee Break",
    text: "Oops, looks like this page went out for a coffee break. It should be back soon!"
  },
  {
    title: "Tech Support",
    text: "Page not found. Did you try turning it off and on again?"
  },
  {
    title: "Opposites Attract",
    text: "Page not found? Must be opposite day. Try clicking the opposite button!"
  },
  {
    title: "Jedi Mind Trick",
    text: "This isn't the page you're looking for... but you should be able find it soon!"
  },
  {
    title: "Mapquest",
    text: "Looks like someone lost the map! We'll help you find your way back to the right path"
  },
  {
    title: "Spelling Bee",
    text: "Sorry, we couldn't find what you were looking for. Maybe try a different spelling?"
  },
  {
    title: "Knock Knock",
    text: "Oops, something went wrong. Maybe you should try knocking on the internet's door?"
  },
]

setGlobalVariables()
window.addEventListener("load", initialize)

/**
 Initializes page on load

 @param none

 @return {void}
 */
function initialize() {
  document.querySelector("div.message").style.display = "" // Show message element
  // Set random title and text
  const title = document.querySelector("div.message h1.title"),
    message = MESSAGES[random(0, MESSAGES.length - 1)]
  title.innerHTML = message.title
  Object.assign(title.style, { // Update CSS
    animation: `typing 1.75s steps(${message.title.length}), blink 500ms step-end infinite alternate`,
    width: message.title.length + "ch"
  })
  title.nextElementSibling.innerHTML = message.text
  initializeGradient(false).play() // Initialize gradient without startup animation and play
  if (!isMobile) {
    initializeAllTooltips() // Add custom tooltips
  }
}
