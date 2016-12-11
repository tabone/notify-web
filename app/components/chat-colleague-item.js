import Ember from 'ember';

export default Ember.Component.extend({
  /**
   * tagName of the root element.
   * @type {String}
   */
  tagName: 'li',

  /**
   * classNames of the root element.
   * @type {Array}
   */
  classNames: [
    'app-chat-colleague-item',
    'mdl-list__item',
    'mdl-list__item--two-line'
  ],

  /**
   * attributeBindings binds the instance fields with the root element
   * attributes.
   * @type {Array}
   */
  attributeBindings: ['role', 'tabindex'],

  /**
   * role of the component.
   * @type {String}
   */
  role: 'link',

  /**
   * tabIndex of the component.
   * @type {String}
   */
  tabindex: '0',

  /**
   * click is invoked when the user clicks on the element.
   */
  click () {
    this.openRoom()
  },

  /**
   * keyDown is invoked when the user types something when he is focusing the
   * element.
   */
  keyDown () {
    // When the user hits the 'Enter' key, it should open the private room
    // between the logged in user and the user this component is showing.
    if (event.keyCode === 13) this.openRoom()
  },

  /**
   * openRoom opens the private room between the user this component is showing
   * and the logged in user.
   */
  openRoom () {
    let room = this.get('room')

    if (room === null) {
      room = this.get('privateRoomCache').read(this.get('user.id'))
    }

    this.set('room', room)
    this.get('router').transitionTo('chat.room', room)
  },

  /**
   * privateRoomCache is used to cache private rooms by the friend id.
   * @type {service:private-room-cache}
   */
  privateRoomCache: Ember.inject.service(),

  /**
   * room is the private room of the user being displayed and the logged in
   * user.
   * @type {Record}
   */
  room: null
});
