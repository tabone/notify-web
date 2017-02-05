import Ember from 'ember'

/**
 * Service used to cache room messages. This is mainly used to reduce the number
 * of requests done to retrieve messages.
 */
export default Ember.Service.extend({
  /**
   * messages cached by room ID.
   * @type {Object}
   */
  messages: {},

  /**
   * cache messages for a room.
   * @param  {Record}     room      The room to read the cached messages from.
   * @param  {Boolean}    pre       Indicates wether to append (indicates that
   *                                the messages aren't new) or prepend
   *                                (indicates that the messages are new).
   * @param  {...[Model]} messages  Message model to be cached.
   * @return {Array}      All cached messages of the room specified.
   */
  cache (room, pre, ...messages) {
    // Make sure that id is not null.
    if (room.get('id') === null) return null

    const key = `messages.${room.get('id')}`

    // Create an entry for the room if it doesn't exists.
    if (this.get(key) === undefined) this.set(key, [])

    // Retrieve the already cached messages.
    const cachedMessages = this.get(key)

    // Include the messages to be cached if they aren't cached already.
    messages.forEach(message => {
      // If message already exists, ignore it.
      if (cachedMessages.indexOf(message) === true) return

      // If message isn't new, prepend it, else append it.
      if (pre) {
        cachedMessages.unshiftObject(message)
      } else {
        cachedMessages.pushObject(message)
      }
    })

    return this.get(key)
  },

  /**
   * read cached messages of a room.
   * @param  {Record} room   The room to read the cached messages from.
   * @return {Array}         All cached messages of the room specified.
   */
  read (room) {
    // Make sure that id is not null.
    if (room.get('id') === null) return null

    const key = `messages.${room.get('id')}`

    // Create entry for the room requested if it doesn't exists.
    if (this.get(key) === undefined) this.set(key, [])
    return this.get(key)
  }
})
