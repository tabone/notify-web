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
  classNames: ['app-chat-room-item'],
});
