import Ember from 'ember';

export default Ember.Component.extend({
  /**
   * classNames to be added to the root element of the component.
   * @type {Array}
   */
  classNames: ['chat-room-info'],

  /**
   * session is used to get the details of the current logged in user.
   * @type {service:session}
   */
  session: Ember.inject.service(),

  actions: {
    /**
     * showInviteDialog shows the invitation dialog.
     */
    showInviteDialog () {
      this.$('dialog')[0].showModal()
    },

    /**
     * leaveRoom removes the logged in user from the room he is currently in.
     * @return {Promise} Resolved once the change has been persisted.
     */
    leaveRoom () {
      const room = this.get('room')
      room.get('users').removeObject(this.get('session.user'))
      return room.save()
        .then(() => room.unloadRecord())
        .then(() => this.get('router').transitionTo('chat'))
    }
  }
});
