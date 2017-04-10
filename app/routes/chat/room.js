import Ember from 'ember'

/**
 * Route used to display the info about a room.
 */
export default Ember.Route.extend({
  /**
   * model hook is used to convert the url to a model.
   */
  model (params) {
    // If the room id is set to null, redirect the user to the 'chat' route.
    // This happens when the user refreshes the page while viewing a
    // non-persisted private room.
    if (params['room_id'] === 'null') return this.transitionTo('chat')
    return this.get('store').findRecord('room', params['room_id'])
  }
})
