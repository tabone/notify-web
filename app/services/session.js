import Ember from 'ember';

export default Ember.Service.extend({
  /**
   * store used to retrieve the user object of the logged in user.
   * @type {service:store}
   */
  store: Ember.inject.service(),

  /**
   * user of the logged in user.
   * @type {String}
   */
  user: null,

  /**
   * isLoggedIn determines whether the user is logged in or not.
   * @return {Boolean} true if the user is logged in, false otherwise.
   */
  isLoggedIn () {
    return this.get('user') !== null
  },

  /**
   * login the user.
   * @param  {String} username The username of the user.
   * @param  {String} password The password of the user.
   * @return {[type]}          [description]
   */
  login (username, password) {
    return $.ajax({
      url: 'http://localhost:8181/auth',
      method: 'POST',
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
      data: {
        username: username,
        password: password
      }
    })
    .then((data) => {
      return this.get('store').findRecord('user', data.id)
    })
    .then((user) => {
      this.set('user', user)
    })
  },

  /**
   * logout the user.
   * @return {[type]} [description]
   */
  logout () {
    this.set('user', null)
    this.set('apiToken', null)
  }
});
