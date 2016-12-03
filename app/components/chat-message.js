import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['app-chat-message'],
  /**
   * content is the rendered markdown of the message.
   * @type {String}
   */
  content: null,

  init (...args) {
    this._super(...args)
    // Render the markdown of the message.
    this.set('content', marked(this.get('message.content')))
  }
});
