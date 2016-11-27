import Ember from 'ember';

export default Ember.Service.extend({
  /**
   * WebSocket instance.
   * @type {Object}
   */
  socket: null,

  /**
   * configuration object.
   * @type {service:config}
   */
  config: Ember.inject.service(),

  /**
   * store used to retrieve the user object of the logged in user.
   * @type {service:store}
   */
  store: Ember.inject.service(),

  /**
   * connect to WebSocket server.
   */
  connect () {
    const socket = new WebSocket(this.get('config').get('ws').url)
    this.set('socket', socket)
    socket.onmessage = (message) => {
      this.get('store').push(JSON.parse(message.data))
    }
  }
});
