import Ember from 'ember';

export default Ember.Component.extend({
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
   * message to be sent.
   * @type {String}
   */
  message: null,

  actions: {
    /**
     * submitMessage persist the message written by the user on submission.
     * @return {Promise} Resolved once the message has been submitted
     */
    submitMessage () {
      let content = this.get('message')

      if (event.shiftKey && content != null && content.length > 0) return null

      // Remove last character since it will be a new line (due to the enter).
      content = content.slice(0, -1)

      // Create and persist message
      return this.get('store')
        .createRecord('message', {
          content: content,
          deleted: false,
          user: this.get('session').get('user'),
          room: this.get('room')
        })
        .save()
        .then(() => this.set('message', null))
    }
  }
});
