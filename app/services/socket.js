import Ember from 'ember'

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
   * store service to query the Ember Data Repository.
   * @type {service:store}
   */
  store: Ember.inject.service(),

  /**
   * messageCache is used to cache messages by room.
   * @type {service:messageCache}
   */
  messageCache: Ember.inject.service(),

  /**
   * privateRoomCache is used to cache private rooms by the friend id.
   * @type {service:private-room-cache}
   */
  privateRoomCache: Ember.inject.service(),

  /**
   * connect to WebSocket server.
   */
  connect () {
    // Create a WebSocket connection.
    const socket = new WebSocket(this.get('config.ws.url'))

    // Store WebSocket connection.
    this.set('socket', socket)

    socket.onmessage = (message) => {
      // When recieving a message, push the data to the store.
      const model = this.get('store').push(JSON.parse(message.data))

      switch (model.constructor.modelName) {
        // If the synced record is a message, cache it inside the message cache
        // service.
        case 'message': {
          this.get('messageCache').cache(model.get('room'), model)
          break
        }

        // If the record is a private room, cache it inside the private room
        // cache service.
        case 'room': {
          if (model.get('private') === true) {
            this.get('privateRoomCache').cache(model)
          }
          break
        }
      }
    }
  }
})
