import Ember from 'ember'

export default Ember.Route.extend({
  /**
   * session is used to get the details of the current logged in user.
   * @type {service:session}
   */
  session: Ember.inject.service(),

  /**
   * model hook is used to convert the url to a model.
   */
  model (params, transition) {
    // If the room id is set to null, redirect the user to the chat page. This
    // happens when the user refreshes the page while having a new private room
    // opened.
    if (params['room_id'] === 'null') return this.transitionTo('chat')
    return this.get('store').findRecord('room', params['room_id'])
  },

  /**
   * afterModel hook is called after the route's model has resolved. When
   * invokded it will set all unread messages related to the room model just
   * resolved to be read.
   */
  afterModel (model) {
    /**
     * Current logged in user.
     * @type {Record}
     */
    const loggedInUser = this.get('session.user')

    // Filter out the unread messages within the room just opened.
    loggedInUser.set('unread', loggedInUser.get('unread').filter(message => {
      return message.get('room.id') !== model.get('id')
    }))

    // Save changes.
    return loggedInUser.save()
  }
})
