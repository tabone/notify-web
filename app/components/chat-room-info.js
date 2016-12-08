import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['chat-room-info'],
  actions: {
    /**
     * showInviteDialog shows the invitation dialog.
     */
    showInviteDialog () {
      this.$('dialog')[0].showModal()
    }
  }
});
