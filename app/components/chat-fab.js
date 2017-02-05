import Ember from 'ember';

export default Ember.Component.extend({
  /**
   * classNames to be added to the root element of the component.
   * @type {Array}
   */
  classNames: ['app-chat-fab'],

  /**
   * didInsertElement is called when the element of the view has been inserted
   * into the DOM or after the view was re-rendered.
   */
  didInsertElement (...args) {
    this._super(...args)
    componentHandler.upgradeElements(this.$('[class*="mdl-js-"]'));
  },

  actions: {
    /**
     * openRoomCreationDialog opens the dialog used to create a new public room.
     */
    openRoomCreationDialog () {
      this.$('.app-chat-room-creation-dialog dialog')[0].showModal()
    }
  }
});
