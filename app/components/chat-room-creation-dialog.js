import Ember from 'ember'

export default Ember.Component.extend({
  /**
   * tagName of the root element.
   * @type {String}
   */
  tagName: 'dialog',

  /**
   * classNames to be added to the root element of the component.
   * @type {Array}
   */
  classNames: ['app-chat-room-creation-dialog', 'mdl-dialog'],

  /**
   * store service to query the Ember Data Repository.
   * @type {Store}
   */
  store: Ember.inject.service(),

  /**
   * session is used to get the details of the current logged in user.
   * @type {service:session}
   */
  session: Ember.inject.service(),

  /**
   * name of the new room.
   * @type {String}
   */
  name: null,

  /**
   * didInsertElement is called when the element of the view has been inserted
   * into the DOM or after the view was re-rendered.
   */
  didInsertElement (...args) {
    this._super(...args)
    this.polyfillDialog()
  },

  /**
   * polyfillDialog polyfills the dialog for browsers who don't support HTML5
   * Dialog.
   */
  polyfillDialog () {
    dialogPolyfill.registerDialog(this.element)
  },

  actions: {
    /**
     * create a new room.
     * @return {Promise} Resolved once the new room has been successfully
     *                   persisted.
     */
    create () {
      // Close dialog.
      this.$('dialog')[0].close()

      // Create new room.
      return this.get('store').createRecord('room', {
        name: this.get('name'),
        image: null,
        private: false,
        users: [this.get('session.user')]
      })
      .save()
      .then(() => { this.set('name', '') })
    },

    /**
     * closeDialog closes the dialog
     */
    closeDialog () {
      this.$('dialog')[0].close()
      this.set('name', '')
    }
  }
})
