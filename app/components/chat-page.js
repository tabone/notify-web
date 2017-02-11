import Ember from 'ember'

export default Ember.Component.extend({
  /**
   * didInsertElement is called when the element of the view has been inserted
   * into the DOM or after the view was re-rendered.
   */
  didInsertElement (...args) {
    this._super(...args)
    this.upgradeElements()
  },

  /**
   * upgradeElements register the DOM to mdl.
   */
  upgradeElements () {
    componentHandler.upgradeElements(this.$('[class*="mdl-js-"]'))
  }
})
