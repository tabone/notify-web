import Ember from 'ember'
import RSVP from 'rsvp'

/**
 * Service used to keep up-to-date the Ember Data Store via a WebSocket
 * connection.
 */
export default Ember.Service.extend({
  /**
   * config is used to get info about the WebSocket server.
   * @type {service:config}
   */
  config: Ember.inject.service(),

  /**
   * store is used to query the Ember Data Repository.
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
   * socket is the WebSocket instance.
   * @type {Object}
   */
  socket: null,

  /**
   * connect to WebSocket server.
   */
  connect () {
    return new RSVP.Promise((resolve, reject) => {
      try {
        // Create a WebSocket connection.
        const socket = new window.WebSocket(this.get('config.ws.url'))

        // Store WebSocket connection.
        this.set('socket', socket)

        socket.onmessage = (message) => {
          // When recieving a message, push the data to the store.
          const model = this.get('store').push(JSON.parse(message.data))

          switch (model.constructor.modelName) {
            // If the synced record is a message, cache it inside the message
            // cache service.
            case 'message': {
              this.get('messageCache').cache(model.get('room'), false, model)
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
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }
})
