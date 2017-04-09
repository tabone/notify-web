import Ember from 'ember'

/**
 * This the 'index' route of the application. When the user enters in this
 * route, he is immediately redirected to the 'chat' route.
 */
export default Ember.Route.extend({
  /**
   * beforeModel hook is the first of the route entry validation hooks called.
   */
  beforeModel () {
    this.transitionTo('chat')
  }
})
