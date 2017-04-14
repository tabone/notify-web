import Ember from 'ember'

/**
 * This the 'index' route of the application. When the user enters in this
 * route, he is immediately redirected to the 'chat' route.
 */
export default Ember.Route.extend({
  /**
   * The user should be immediately redirected to the 'chat' route.
   */
  beforeModel () {
    this.transitionTo('chat')
  }
})
