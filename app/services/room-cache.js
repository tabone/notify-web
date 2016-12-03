import Ember from 'ember';

export default Ember.Service.extend({
  /**
   * messages cached by room ID.
   * @type {Object}
   */
  messages: {},

  /**
   * cache messages for a room.
   * @param  {String}     roomID    ID of the room the messages belong in.
   * @param  {...[Model]} messages  Message model to be cached.
   * @return {Array}      All cached messages of the room specified.
   */
  cache (roomID, ...messages) {
    const key = `messages.${roomID}`
    if (this.get(key) === undefined) this.set(key, [])
    const cachedMessages = this.get(key)

    messages.forEach(message => {
      if (!~cachedMessages.indexOf(message)) cachedMessages.pushObject(message)
    })

    return this.get(key)
  },

  /**
   * read cached messages of a room.
   * @param  {String} roomID ID of the room to read the cached messages from.
   * @return {Array}         All cached messages of the room specified.
   */
  read (roomID) {
    const key = `messages.${roomID}`
    if (this.get(key) === undefined) this.set(key, [])
    return this.get(`messages.${roomID}`)
  }
});
