import Ember from 'ember';

export default Ember.Service.extend({
  /**
   * messages cached by room ID.
   * @type {Object}
   */
  messages: {},

  /**
   * cache messages for a room.
   * @param  {Record} room   The room to read the cached messages from.
   * @param  {...[Model]} messages  Message model to be cached.
   * @return {Array}      All cached messages of the room specified.
   */
  cache (room, ...messages) {
    // Make sure that id is not null.
    if (room.get('id') === null) return null

    const key = `messages.${room.get('id')}`
    if (this.get(key) === undefined) this.set(key, [])
    const cachedMessages = this.get(key)

    messages.forEach(message => {
      if (!~cachedMessages.indexOf(message)) cachedMessages.pushObject(message)
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
    if (this.get(key) === undefined) this.set(key, [])
    return this.get(key)
  }
});
