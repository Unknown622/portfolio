/**
  @module parallax-background
  @description Contains Parallax class
  @author Vincent Zimmer
  @version 1.0.0
  @requires []
*/

export default class Parallax {
  /**
    Constructor for Parallax class

    @param {HTMLElement} parentElement: The parent element to animate
    @param {array} childrenElements: Array of HTMLElements to animate
    @param {object} options: Other options (optional)
      Values:
        - parentThreshold {int} (default 45): Percent scrolled before animating the parent element
        - toggleAnimationDuration {int} (default 500): The duration in ms of animating the animation toggle

    @return {void}
  */
  constructor(parentElement, childrenElements = [], options = {}) {
    this.element = parentElement
    this.children = [...childrenElements] // Make an array copy of the children
    this.parentThreshold = options?.parentThreshold ?? 45
    this.toggleAnimationDuration = options?.toggleAnimationDuration ?? 500
    this._scroll = this._scroll.bind(this) // Bind the scroll function to this instance
    if (window.animations) {
      this._scroll() // Set initial position
      window.addEventListener("scroll", this._scroll) // Add scroll listener if needed
    } else {
      Object.assign(this.element.style, { // Hide parallax element if needed
        display: "none",
        opacity: "",
        scale: "",
        transform: ""
      })
    }
    // Add custom animation listener
    this.element.addEventListener("toggleAnimation", event => {
      if (event.detail.animations) { // Show parallax
        this.element.style.display = "" // Reset display property
        this.element.animate([ // Fade in the parallax elements
          { opacity: 0 },
          { opacity: 1 }
        ], {
          duration: this.toggleAnimationDuration,
          easing: "ease"
        })
        window.addEventListener("scroll", this._scroll) // Add scroll listener again
      } else { // Hide parallax
        window.removeEventListener("scroll", this._scroll)
        Object.assign(this.element.style, { // Hide parallax element
          display: "none",
          opacity: "",
          scale: "",
          transform: ""
        })
      }
    })
  }

  /**
    Updates parallax elements with scroll

    @param none

    @return {void}
  */
  _scroll() {
    const scrollPercent = ((document.documentElement.scrollTop || document.body.scrollTop) / (document.documentElement.scrollHeight - window.innerHeight)) * 100 // Calculate the percentage of the page that has been scrolled
    this.children.forEach((element, index) => element.style.transform = `translate3D(0, ${-(scrollPercent * (this.children.length - index))}px, ${index * 1.75 + 1}px)`) // Animate children elements
    // Check if the scroll percentage is greater than threshold
    if (scrollPercent >= this.parentThreshold) {
      // Animate parent element
      Object.assign(this.element.style, {
        opacity: Math.max(0, 1 - ((scrollPercent - this.parentThreshold) / this.parentThreshold)),
        scale: (1 - (1 - ((scrollPercent - this.parentThreshold) / 500))) * 1.5 + 1,
        transform: `translateY(-${(scrollPercent - this.parentThreshold) * 10}px)`
      })
    } else if (scrollPercent <= 0) { // Set to default
      Object.assign(this.element.style, {
        opacity: 1,
        scale: 1,
        transform: "translateY(0)"
      })
    }
  }
}
