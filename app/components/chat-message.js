import Ember from 'ember';

export default Ember.Component.extend({
  /**
   * classNames to be added to the root element of the component.
   * @type {Array}
   */
  classNames: ['app-chat-message'],

  /**
   * content is the rendered markdown of the message.
   * @type {String}
   */
  content: null,

  /**
   * init is invoked when the object is initialized.
   */
  init (...args) {
    this._super(...args)
    // Render the markdown of the message.
    this.set('content', marked(this.get('message.content')))
  }
});
