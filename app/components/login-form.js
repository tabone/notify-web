import Ember from 'ember';

export default Ember.Component.extend({
  className: ['app-login-form'],
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
   * error message.
   * @type {String}
   */
  error: null,

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

  actions: {
    /**
     * login is used to authenticate the user with the crentials provided.
     */
    login () {
      const username = this.get('username')
      const password = this.get('password')

      this.get('session').login(username, password)
        .then(() => {
          this.get('routing').transitionTo('app')
        })
        .catch((err) => {
          switch (err.status) {
            case 401: {
              this.set('error', "Invalid credentials")
              break
            }
            default: {
              this.set('error', "An unexpected error occured")
              break
            }
          }

          const usernameField = this.$('#app-login-form__username-field')[0]
          usernameField.focus()
          usernameField.select()
        })
    }
  }
});
