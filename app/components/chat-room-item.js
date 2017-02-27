import Ember from 'ember'

export default Ember.Component.extend({
  /**
   * tagName of the root element.
   * @type {String}
   */
  tagName: 'li',

  /**
   * classNames to be added to the root element of the component.
   * @type {Array}
   */
  classNames: ['app-chat-room-item'],

  /**
   * session is used to get the details of the current logged in user.
   * @type {service:session}
   */
  session: Ember.inject.service(),

  /**
   * hasUpdates indicates whether there are unread messages within the room.
   */
  hasUpdates: Ember.computed('session.user.unread', function () {
    return this.get('session.user.unread').any(message => {
      return message.get('room.id') === this.get('room.id')
    })
  })
})
