import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['app-chat-room-creation-dialog'],

  session: Ember.inject.service(),

  store: Ember.inject.service(),

  name: null,

  /**
   * didInsertElement is called when the element of the view has been inserted
   * into the DOM or after the view was re-rendered.
   */
  didInsertElement () {
    this.polyfillDialog()
  },

  /**
   * polyfillDialog polyfills the dialog for browsers who don't support HTML5
   * Dialog.
   */
  polyfillDialog () {
    const dialog = this.$('dialog')[0]
    if (dialog.showModal === undefined) dialogPolyfill.registerDialog(dialog)
  },

  actions: {
    /**
     * create a new room.
     * @return {Promise} Resolved once the new room has been successfully
     *                   persisted.
     */
    create () {
      this.$('dialog')[0].close()

      return this.get('store').createRecord('room', {
        name: this.get('name'),
        image: null,
        private: false,
        users: [this.get('session.user')]
      })
      .save()
    },

    /**
     * closeDialog closes the dialog
     */
    closeDialog () {
      this.$('dialog')[0].close()
    }
  }
});
