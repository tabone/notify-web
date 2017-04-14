import Ember from 'ember'

/**
 * This is the route of a Chat Room Page. In this route the user will be able to
 * see all the info about a specific room.
 */
export default Ember.Route.extend({
  /**
   * Before rendering the route's template, the model of the requested room
   * should be retrieved.
   * Note that there will be times when the id of the room to be retrieved will
   * be set to 'null' (which is invalid). This happens when the user refreshes
   * the page while in a non-persisted private room. When this happens the user
   * should be redirected back to the 'chat' route.
   */
  model (params) {
    if (params['room_id'] === 'null') return this.transitionTo('chat')
    return this.get('store').findRecord('room', params['room_id'])
  }
})
