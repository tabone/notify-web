import Ember from 'ember';

export default Ember.Service.extend({
  /**
   * token is provided by the API Server during autentication and it is used to
   * authenticate the user on each HTTP Request.
   * @type {String}
   */
  apiToken: null,

  /**
   * username of the logged in user.
   * @type {String}
   */
  username: null,

  /**
   * isLoggedIn determines whether the user is logged in or not.
   * @return {Boolean} true if the user is logged in, false otherwise.
   */
  isLoggedIn () {
    return this.apiToken !== null
  },

  /**
   * login is used to authenticate the user.
   * @param  {String} username The username of the user.
   * @param  {String} password The password of the user.
   * @return {[type]}          [description]
   */
  login (username, password) {
    this.token = 'abc123'
    this.username = username
  },

  /**
   * logout is used to logout the user.
   * @return {[type]} [description]
   */
  logout () {
    this.token = null
    this.username = null
  }
});
