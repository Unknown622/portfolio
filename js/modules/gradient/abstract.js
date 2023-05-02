/**
  @module gradient/abstract
  @description Contains GradientAbstract class
  @author Vincent Zimmer
  @version 1.0.0
  @requires []
*/

/** Used to define functions gradient classes must have */
export default class GradientAbstract {
  constructor() {
    if (this.constructor === GradientAbstract) {
      throw new Error("Abstract classes can't be constructed")
    }
  }

  getType() {
    throw new Error("The getType() function hasn't been defined")
  }

  play() {
    throw new Error("The play() function hasn't been defined")
  }

  pause() {
    throw new Error("The pause() function hasn't been defined")
  }
}
