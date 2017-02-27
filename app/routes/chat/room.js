import Ember from 'ember'

export default Ember.Route.extend({
  /**
   * model hook is used to convert the url to a model.
   */
  model (params, transition) {
    // If the room id is set to null, redirect the user to the chat page. This
    // happens when the user refreshes the page while having a new private room
    // opened.
    if (params['room_id'] === 'null') return this.transitionTo('chat')
    return this.get('store').findRecord('room', params['room_id'])
  }
})
