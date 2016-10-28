import Ember from 'ember';

export default Ember.Component.extend({
  /**
   * username is binded with the Username Input Field.
   * @type {String}
   */
  username: null,

  /**
   * password is binded with the Password Input Field.
   * @type {String}
   */
  password: null,

  /**
   * session will be used to authenticate the user with the provided
   * credentials.
   * @type {service:session}
   */
  session: Ember.inject.service(),

  /**
   * routing is used to redirect the user to the app on successful
   * authentication.
   * @type {service:-routing}
   */
  routing: Ember.inject.service('-routing'),

  /**
   * didInsertElement is called when the element of the view has been inserted
   * into the DOM or after the view was re-rendered.
   */
  didInsertElement () {
    componentHandler.upgradeElements(this.$('[class*="mdl-js-"]'));
  },

  actions: {
    /**
     * login is used to authenticate the user with the crentials provided.
     */
    login () {
      const username = this.get('username')
      const password = this.get('password')
      this.get('session').login(username, password)
      this.get('routing').transitionTo('index')
    }
  }
});
